import express from "express";
import cors from "cors";
import { analyzePresentation } from "./gemini.js";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";

// importing db schemas
import User from "./models/User.js";

import bcrypt from "bcrypt";
import multer from "multer"; // for audio capture

// for video processing
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";
import * as faceapi from "face-api.js";
import { Canvas, Image, ImageData, loadImage } from "canvas";

// for video uploads
import uploadFullVideoRoutes from "./routes/uploadFullVideo.js";
import Video from "./models/Video.js";



ffmpeg.setFfmpegPath(ffmpegInstaller.path);

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// load face-api models (just once)
console.log("loading face-api.js models...");

await Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromDisk("models/face"),
  faceapi.nets.faceExpressionNet.loadFromDisk("models/face"),
  faceapi.nets.faceLandmark68Net.loadFromDisk("models/face"),
]);

console.log("finished loading face-api.js models");

//const ffmpeg = createFFmpeg({ log: false });

const upload = multer({ dest: "uploads/" }); // temp upload folder

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// get gemini api key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", uploadFullVideoRoutes);

// Correct static path
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// register
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Missing username, email, or password" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hpassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, hpassword });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.hpassword);
    if (!valid) {
      return res.status(400).json({ error: "Incorrect password." });
    }

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/analyze", async (req, res) => {
  try {
    const metrics = req.body;
    const feedback = await analyzePresentation(metrics);
    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/make-query", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("request received: ", prompt);

    // add safety check to make sure prompt is in string format
    if (!prompt) {
      return res.status(400).json({ error: "incorrect prompt format" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const text_response = response.candidates[0].content.parts[0].text;
    console.log("prompt response: ", text_response);

    res.json({ result: text_response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// process audio data
app.post("/process-audio", upload.single("audio"), async (req, res) => {
  try {
    // sanity check, make sure audio file was received
    if (!req.file) {
      return res.status(400).json({ error: "No audio file received" });
    }

    console.log("Audio received:", req.file);

    const audioPath = req.file.path; // temp file path
    const mimeType = req.file.mimetype; // file type

    // upload audio to gemini
    const uploaded = await ai.files.upload({
      file: audioPath,
      config: { mimeType },
    });

    //console.log("Uploaded to Gemini:", uploaded.uri);

    // query speech feedback from gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(uploaded.uri, mimeType),
        `
You are an advanced public speaking and presentation coach.

Note, the feedback provided should NOT be more than one sentence. It needs to be readable in 5 seconds or less. Aim for 10 words or less. 

Analyze the speaker's voice in this audio and give feedback including:

- monotone vs expressiveness
- pacing (too fast / too slow)
- clarity of speech
- confidence in voice
- filler words
- emotional tone
- pauses and breathing
- audience engagement cues

Keep feedback concise and actionable.

The feedback will be displayed to the user every 15 seconds or so. Again, be mindful of the fact that feedback should be kept short. 

Do not, under any circumstances, provide long responses. Example of appropriate messages include: "Try using a more enthusiastic tone," "You're speaking too fast, try slowing down," and "Avoid using filler words such as 'like' and 'um'."
        `,
      ]),
    });

    const text = response.candidates[0].content.parts[0].text;

    console.log("feedback on speech: ", text);

    res.json({ feedback: text });
  } catch (err) {
    console.error("Error in /process-audio:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// process video data for body language
app.post("/process-video", upload.single("video"), async (req, res) => {
  try {
    // sanity check
    if (!req.file) {
      return res.status(400).json({ error: "No video file received" });
    }

    const videoPath = req.file.path;
    const framesDir = "./uploads/frames";

    // Clear or create frames directory
    fs.mkdirSync(framesDir, { recursive: true });
    for (const f of fs.readdirSync(framesDir)) {
      fs.unlinkSync(path.join(framesDir, f));
    }

    console.log("extracting frames...");

    // extract 0.1 frames per second to perform analysis of facial expression
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(path.join(framesDir, "frame-%03d.jpg"))
        .outputOptions(["-vf fps=0.1"]) // can change later
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    console.log("frames extracted");

    const frameFiles = fs
      .readdirSync(framesDir)
      .filter((f) => f.endsWith(".jpg"));

    // face-api.js models loaded outside of POST method (to avoid loading on each request), then used here to process image data

    let results = [];

    for (const file of frameFiles) {
      const imgPath = path.join(framesDir, file);
      const img = await loadImage(imgPath);

      const canvas = new Canvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const detection = await faceapi
        .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      results.push({
        frame: file,
        detected: !!detection,
        expressions: detection?.expressions || null,
      });
    }

    res.json({
      status: "success",
      frames: frameFiles.length,
      rawResults: results,
    });
  } catch (err) {
    console.error("Error in /process-video:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// use feedback from process-video to generate feedback using gemini api
app.post("/video-feedback", async (req, res) => {
  try {
    const { rawResults } = req.body; // output of the /process-video POST method

    // sanity check
    if (!rawResults || !Array.isArray(rawResults)) {
      return res.status(400).json({ error: "Missing rawResults array" });
    }

    // get totals (if total = 0, no face was detected)
    const totals = {
      neutral: 0,
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
    };

    let count = 0;

    for (const frame of rawResults) {
      if (frame.detected && frame.expressions) {
        count++;
        for (const [emotion, value] of Object.entries(frame.expressions)) {
          totals[emotion] += value;
        }
      }
    }

    // handle no face detected
    if (count === 0) {
      return res.json({
        status: "success",
        feedback: "Ensure your face is visible to the camera.",
      });
    }

    // compute averages
    const averages = {};
    for (const emotion of Object.keys(totals)) {
      averages[emotion] = totals[emotion] / count;
    }

    // prompt
    const promptForGemini = `
You are generating real-time presentation feedback based on facial expression data.

Expression averages (0 to 1):
${JSON.stringify(averages, null, 2)}

Instructions:
1. Generate 1–2 short feedback cues.
2. Each cue must be 10 words or less.
3. Focus on the intensity of each emotion and how it affects the presentation:
   - neutral: too high = expressionless; suggest ways to add energy.
   - happy: too low = appear less engaging; suggest smiling or enthusiasm.
   - sad: too high = appear discouraged; suggest maintaining a confident expression.
   - angry: too high = appear frustrated; suggest relaxing facial muscles.
   - fearful: too high = appear nervous; suggest breathing and calmness.
   - disgusted: too high = appear off-putting; suggest neutralizing expression.
   - surprised: low or high = use appropriately; encourage natural reactions.
4. Provide specific actionable advice for the presenter based on these cues.
5. Be objective: do not invent emotions or exaggerate.
6. Feedback should reflect the actual data and intensity levels.
7. Be direct, concise, and easy to read quickly.
8. Do not use emojis or any non-text symbols.
9. Avoid generic or overly positive statements; focus on observable improvement.

Examples of good feedback:
- "Smile more to stay engaging."
- "Relax facial tension to appear confident."
- "Use more expressive cues to connect with audience."
- "Maintain eye contact with camera"

Now, generate 1–2 actionable feedback cues strictly based on the above expression data.
`;

    // Query Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptForGemini,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    // for testing
    console.log("feedback on facial expression: ", text.trim());

    // send only feedback in the response
    res.json({
      feedback: text.trim(),
    });
  } catch (err) {
    console.error("Error in /video-feedback:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/get-tone", async (req, res) => {
  try {
    const { prompt } = req.body;

    const fprompt =
      "Classify the following feedback as one of the following: 'Appreciative', 'Evaluative', or 'Actionable' (in this exact format). Provide a one word answer, the answer should not be a sentence, or more than any one of these words alone. Note, appreciative feedback focuses on reinforcing behavior that was successful, evaluative feedback focuses on identifying areas where performance failed to meet a standard or expectation, and actionable feedback focuses on providing specific, actionable advice to close the gap identified by critical evaluative feedback. Here is the feedback for evaluation: " +
      prompt;

    if (!prompt) {
      return res.status(400).json({ error: "incorrect prompt format" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              text: fprompt,
            },
          ],
        },
      ],
    });

    const text_response = response.candidates[0].content.parts[0].text;
    console.log("prompt tone: ", text_response);

    res.json({ result: text_response });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}); 

// Get all videos for a user
app.get("/user-videos/:userId", async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({ videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch videos" });
  }
});

const PORT = 5050;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);