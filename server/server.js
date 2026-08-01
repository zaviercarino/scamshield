import express from "express";
import cors from "cors";
import {analyzeMessage} from "./analyzer-js/api.js";
import {formatResult} from "./analyzer-js/formatter.js";
import {scamPrompt} from "./analyzer-js/prompt.js"

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("ScamShield backend is running!");
});

app.post("/analyze", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});