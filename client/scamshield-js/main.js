// ============== Vercel Analytics ============== \\
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

// ============== Message Analyzer ============== \\

const button = document.getElementById("submit-button");
const warningLabel = document.getElementById("warning-text");

button.addEventListener("click", async () => {
    const userMessage = document.getElementById("input-scam").value;
    const letterCount = userMessage.length;
    
    const outputLabel = document.getElementById("scam-output");

    if(userMessage.trim().length === 0){
        warningLabel.textContent = `Please input a valid message.`;
        setTimeout(() => {
            warningLabel.textContent = ``;
        }, 3000);
        return console.error(`Must include valid message`);
    } else if(letterCount > 15000){
        warningLabel.textContent = `Message too long by ${Number(letterCount) - 15000} characters.`;
        setTimeout(() => {
            warningLabel.textContent = ``;
        }, 3000);
        return console.error(`Message too long by ${Number(letterCount) - 15000} characters.`);
    }
    
    warningLabel.textContent = "Retrieving Content...";
    button.disabled = true;

    try {
        const response = await fetch("https://scamshield-api-stix.onrender.com/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        const result = await response.text();

        try {
            const JSONresult = JSON.parse(result);
            console.log(JSONresult)

            if(JSONresult.error){
                outputLabel.innerHTML = JSONresult.error
            } else {
                outputLabel.innerHTML = result;
            }
        } catch(error) {
            outputLabel.innerHTML = result;
        }
        
    }
    catch(error){
        console.error(error);
        warningLabel.textContent = `Analyzer unavailable. Please try again later.`;
        setTimeout(() => {
            warningLabel.textContent = ``;
        }, 3000);
    }
    finally{
        button.disabled = false; 
    }

    warningLabel.textContent = ``;
    
    const clearButton = document.getElementById("clear-output");
    clearButton.classList = "clear-output-button";

    clearButton.addEventListener("click", () => {
        outputLabel.innerHTML = ``;
        clearButton.classList = "hidden";
    })
});