import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import {analyzeMessage} from "./analyzer-js/api.js";
import {formatResult} from "./analyzer-js/formatter.js";
import {scamPrompt} from "./analyzer-js/prompt.js";

const app = express();
app.use(cors());
app.use(express.json());

const analyzerLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})

app.get("/", (req, res) => {
    res.send("ScamShield backend is running!");
});

app.post("/analyze", analyzerLimit, async (req, res) => {
    try {
        const message = scamPrompt + req.body.message + `END_UNTRUSTED_CONTENT`;

        const result = await analyzeMessage(message);
        const formatted = formatResult(result);

        res.send(formatted);

    } catch(error) {
        console.error(error);

        res.status(500).json({
            error: "Analysis Failed. Try again later."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});