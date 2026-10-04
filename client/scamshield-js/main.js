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

let image_upload;

button.addEventListener("click", async () => {
    const userMessage = messageInput.value;
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

    startLoadingAnimation()
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
});

// ============== Upload Image Analyzer ============== \\
const upload_button = document.getElementById("image-uploader");
const image_upload_area = document.getElementById("image-upload-area");
const remove_image_button = document.getElementById("remove-image-button")

upload_button.addEventListener("change", async (event) => {
    const user_file = event.target.files[0];

    if(user_file.size / 1024 > 5000){
        warningLabel.textContent = `File exceeds 5MB limit.`;
        setTimeout(() => {
            warningLabel.textContent = ``;
        }, 3000);
        return;
    }

    remove_image_button.style.display = "block"

    image_upload = user_file
    image_upload_area.src = URL.createObjectURL(user_file);;
    image_upload_area.style.display = "block";
    
    console.log(image_upload);
});

remove_image_button.addEventListener("click", () => {
    image_upload = "";
    image_upload_area.src = "";
    image_upload_area.style.display = "none";
    messageInput.value = '';
})