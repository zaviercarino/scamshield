// ============== Buttons ============== \\
const menuButton = document.getElementById("btn-menu-dropdown");
const menuDropdown = document.querySelector(".menu-dropdown");

menuButton.addEventListener("click", () => {
    menuDropdown.classList.toggle("active");
});

// ============== Message Analyzer ============== \\
const button = document.getElementById("submit-button");
const warningLabel = document.getElementById("warning-text");
const messageInput = document.getElementById("input-scam");
const outputLabel = document.getElementById("scam-output");

const upload_button = document.getElementById("image-uploader");
const image_upload_area = document.getElementById("image-upload-area");
const remove_image_button = document.getElementById("remove-image-button");

let image_upload = null;

button.addEventListener("click", async () => {
    const userMessage = messageInput.value.trim();

    if (!image_upload && !userMessage) {
        warningLabel.textContent =
            "Please enter a message or upload an image.";
        setTimeout(() => warningLabel.textContent = "", 3000);
        return;
    }

    if (userMessage.length > 15000) {
        warningLabel.textContent =
            `Message too long by ${userMessage.length - 15000} characters.`;
        setTimeout(() => warningLabel.textContent = "", 3000);
        return;
    }

    if (image_upload) {
        await analyze_message(userMessage, "Image_Analysis");
    } else {
        await analyze_message(userMessage, "Message_Analysis");
    }
});

// ============== Image Analyzer ============== \\

upload_button.addEventListener("change", (event) => {
    const user_file = event.target.files[0];

    if (!user_file) return;

    if (user_file.size > 5 * 1024 * 1024) {
        warningLabel.textContent = "File exceeds 5MB limit.";
        setTimeout(() => warningLabel.textContent = "", 3000);
        upload_button.value = "";
        return;
    }

    if (!user_file.type.startsWith("image/")) {
        warningLabel.textContent = "Please upload an image file.";
        setTimeout(() => warningLabel.textContent = "", 3000);
        upload_button.value = "";
        return;
    }

    image_upload = user_file;

    image_upload_area.src = URL.createObjectURL(user_file);
    image_upload_area.style.display = "block";
    remove_image_button.style.display = "block";
});

function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const dataURL = reader.result;
            resolve(dataURL.split(",")[1]);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read image."));
        };

        reader.readAsDataURL(file);
    });
}


remove_image_button.addEventListener("click", () => {
    image_upload = "";
    upload_button.value = "";
    
    image_upload_area.src = "";
    image_upload_area.style.display = "none";

    messageInput.value = '';
})

// ======================================== Main Analyze Function ======================================== \\
async function analyze_message(userMessage, messagetype) {
    if(messagetype == "Image_Analysis") {
        console.log("Image Analysis has begun.");
        startLoadingAnimation();
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
        } catch(error){
            console.error(error);
            warningLabel.textContent = `Analyzer unavailable. Please try again later.`;
            setTimeout(() => {
                warningLabel.textContent = ``;
            }, 3000);
        } finally{
            stopLoadingAnimation();
            button.disabled = false; 
        }
     
        const clearButton = document.getElementById("clear-output");
        clearButton.classList = "clear-output-button";
        
        clearButton.addEventListener("click", () => {
            outputLabel.innerHTML = ``;
            clearButton.classList = "hidden";
        
            image_upload = "";
            image_upload_area.src = "";
            image_upload_area.style.display = "none";
        })

    } else if(messagetype == "Message_Analysis") {
        console.log("Message Analysis has begun.");
        startLoadingAnimation();
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
        } catch(error){
            console.error(error);
            warningLabel.textContent = `Analyzer unavailable. Please try again later.`;
            setTimeout(() => {
                warningLabel.textContent = ``;
            }, 3000);
        } finally{
            stopLoadingAnimation();
            button.disabled = false; 
        }
     
        const clearButton = document.getElementById("clear-output");
        clearButton.classList = "clear-output-button";
        
        clearButton.addEventListener("click", () => {
            outputLabel.innerHTML = ``;
            clearButton.classList = "hidden";
        
            image_upload = "";
            image_upload_area.src = "";
            image_upload_area.style.display = "none";
        })
    }
}

// ======================================== Loading Text | Message Analysis ======================================== \\
const loadingContentLabels = ["Retrieving Content", "Scanning For Red Flags", "Analyzing Credibility", "Evaluating Risk", "Running Scan", "Processing Message", "Inspecting Links"];
let loadingIndex = 0;
let loadingInterval; 

function startLoadingAnimation() {
    loadingIndex = 0;
    warningLabel.textContent = loadingContentLabels[loadingIndex];
    loadingInterval = setInterval(() => {
        loadingIndex++;
        if (loadingIndex >= loadingContentLabels.length) {
            loadingIndex = 0;
        }
        warningLabel.textContent = loadingContentLabels[loadingIndex];
    }, 5000);
}

function stopLoadingAnimation() {
    clearInterval(loadingInterval);
    warningLabel.textContent = "";
}