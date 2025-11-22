import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzePresentation(metrics) {
  const prompt = `
  You are an AI presentation coach.
  User metrics:
  ${JSON.stringify(metrics, null, 2)}
  
  Give short, helpful feedback on:
  - posture
  - gestures
  - eye contact
  - head movement
  - confidence
  Provide one practice exercise too.
  Keep response under 120 words.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
