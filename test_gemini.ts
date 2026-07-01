import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    const aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    console.log("Trying gemini-3.5-flash...");
    await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello",
    });
    console.log("Success with 3.5-flash");
  } catch (err: any) {
    console.error("Error with 3.5-flash:", err.message);
  }

  try {
    const aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    console.log("Trying gemini-2.5-flash...");
    await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello",
    });
    console.log("Success with 2.5-flash");
  } catch (err: any) {
    console.error("Error with 2.5-flash:", err.message);
  }
}

run();
