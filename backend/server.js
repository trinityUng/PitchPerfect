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

// register
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing username, email, or password" });
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

    res.json({ message: "Login successful" });
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

Analyze the speaker's voice in this audio and give **live-presentation feedback** including:

- monotone vs expressiveness
- pacing (too fast / too slow)
- clarity of speech
- confidence in voice
- filler words
- emotional tone
- pauses and breathing
- audience engagement cues

Keep feedback concise and actionable.

The feedback will be displayed to the user every 30 seconds or so. Because of this, feedback should be 1-2 sentences in length, no longer than that.
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

Rules:
- Output 1–2 short feedback cues.
- Maximum 15 words each.
- No emojis.
- Be direct.
- Be clear in stating the presenter's current expression, and how this can be improved (e.g., "Your current expression is grumpy. Smile more to engage the audience.").
- The feedback doesn't need to be overly positive (we want it to be evident that the user's current expression is being correctly identified).
- Only give feedback based on the data.
- Examples: "Smile more to stay engaging", "Relax your facial tension", "Use more expressive facial cues".

Now produce the cues:
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

const PORT = 5050;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
