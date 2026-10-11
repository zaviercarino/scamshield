import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function analyzeMessage(
    message,
    image = null,
    mimeType = null
) {
    const parts = [
        {
            text: message
        }
    ];

    if (image) {
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: image
            }
        });
    }
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [
            {
                role: "user",
                parts: parts
            }
        ],
        config: {
            temperature: 0.2,
            responseMimeType: "application/json"
        }
    });

    const text = response.text;
    const data = JSON.parse(text);

    return data;
}