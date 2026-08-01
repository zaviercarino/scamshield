import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});


export async function analyzeMessage(message) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: message
    });

    const text = response.text;
    const data = JSON.parse(text);

    return data;
}