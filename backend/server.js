import express from "express";
import cors from "cors";
import { analyzePresentation } from "./gemini.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// get gemini api key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

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
          "parts": [
            {
              "text": prompt
            }
          ]
        }
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

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
