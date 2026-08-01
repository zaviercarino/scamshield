import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
});

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});


export async function analyzeMessage(message) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: message,
        config: {
            temperature: 0.2
        }
    });

    const text = response.text;
    const data = JSON.parse(text);

    return data;
}