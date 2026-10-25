import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import {analyzeMessage} from "./analyzer-js/api.js";
import {formatResult} from "./analyzer-js/formatter.js";
import {scamPrompt} from "./analyzer-js/prompt.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const analyzerLimit = rateLimit({
    windowMs: 1440 * 60 * 1000,
    max: 30,
    message: {
        error: "You Have Hit Your Daily Limit."
    },
    standardHeaders: true,
    legacyHeaders: false
})

app.get("/", (req, res) => {
    res.send("ScamShield backend is running!");
});


app.post("/analyze", analyzerLimit, async (req, res) => {
    try {
        const { message = "", image = null, mimeType = null } = req.body;

        if (!message.trim() && !image) {
            return res.status(400).json({
                error: "Please provide a message or image."
            });
        }

        const prompt = scamPrompt + message + "\nEND_UNTRUSTED_CONTENT";

        const result = await analyzeMessage(
            prompt,
            image,
            mimeType
        );

        const formatted = formatResult(result);

        res.send(formatted);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Analysis Failed. Try again soon."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});