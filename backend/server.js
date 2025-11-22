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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hpassword = await bcrypt.hash(password, 10);

    await User.create({ username, hpassword });

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

    console.log("Uploaded to Gemini:", uploaded.uri);

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
        `,
      ]),
    });

    const text = response.candidates[0].content.parts[0].text;

    res.json({ feedback: text });
  } catch (err) {
    console.error("Error in /process-audio:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// process video data
app.post("/process-video", upload.single("video"), async (req, res) => {
  try {
  } catch (err) {
    console.error("Error in /process-video:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
