// CONFIG — ADD YOUR API KEY HERE
const API_KEY = "API_KEY";// =========================


// A stable multimodal model from your list
const MODEL = "models/gemini-2.5-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`;

// Images
let screenBase64 = null;
let uploadBase64 = null;

// Initialize extension
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(captureScreen, 150);
  setupListeners();
});

// =========================
// SCREEN CAPTURE
// =========================
function captureScreen() {
  const preview = document.getElementById("screen-image");
  const spinner = document.getElementById("loading-spinner");
  const hint = document.getElementById("progress-hint");

  chrome.windows.getCurrent({}, (win) => {
    chrome.tabs.captureVisibleTab(win.id, { format: "png" }, (dataUrl) => {
      if (!dataUrl) {
        hint.textContent = "Could not capture screen.";
        return;
      }

      screenBase64 = dataUrl.split(",")[1];
      preview.src = dataUrl;

      preview.onload = () => {
        spinner.classList.add("hidden");
        preview.classList.remove("hidden");
        hint.textContent = "Captured from active tab.";
      };
    });
  });
}

// =========================
// LISTENERS
// =========================
function setupListeners() {
  // Optional upload
  const fileInput = document.getElementById("file-upload");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("file-name").textContent = file.name;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      uploadBase64 = dataUrl.split(",")[1];
      
      const prev = document.getElementById("upload-preview");
      prev.src = dataUrl;
      prev.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  // Answer button - adds prompt to textarea
  const textarea = document.getElementById("user-input");
  document.querySelectorAll(".quick-prompt").forEach((chip) => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt");
      textarea.value = prompt;
      textarea.focus();
    });
  });

  // Run analysis
  document.getElementById("ask-btn").addEventListener("click", analyzeScreen);

  // Copy output
  document.getElementById("copy-btn").addEventListener("click", () => {
    const text = document.getElementById("result-text").textContent.trim();
    navigator.clipboard.writeText(text);
  });
}

// =========================
// SIMPLE ANALYSIS FUNCTION
// =========================
async function analyzeScreen() {
  const question = document.getElementById("user-input").value.trim();
  const resultArea = document.getElementById("result-area");
  const resultText = document.getElementById("result-text");
  const btn = document.getElementById("ask-btn");

  if (!API_KEY || API_KEY === "INSERT_KEY_HERE") {
    alert("Add your API key to popup.js first.");
    return;
  }
  if (!question) {
    alert("Ask a question first.");
    return;
  }
  if (!screenBase64) {
    alert("Screen not captured yet.");
    return;
  }

  btn.textContent = "Analyzing...";
  btn.disabled = true;
  resultArea.classList.add("hidden");

  // Build request
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `
        You are ScreenRead-AI.
        
        Your job:
        1. Look ONLY at the images provided (screen capture + uploaded image)
        2. Answer using *only visible information* — no assumptions.
        
        Format your response EXACTLY like this:
        
        Final Answer:
        <your answer>
        
        Explanation:
        <how the answer was derived strictly from visible content>
        
        Rules:
        - If the answer is not visible in the images, say: "Not visible".
        - Do NOT include additional sections, intros, outros, or commentary.
        - Be concise but clear.
        `
        },
        { inline_data: { mime_type: "image/png", data: screenBase64 } }
      ]
    }
  ];

  if (uploadBase64) {
    contents.push({
      role: "user",
      parts: [
        { inline_data: { mime_type: "image/png", data: uploadBase64 } }
      ]
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: question }]
  });

  const payload = { contents };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No answer.";

    resultText.textContent = answer;
    resultArea.classList.remove("hidden");

  } catch (err) {
    resultText.textContent = "Error: " + err.message;
    resultArea.classList.remove("hidden");
  }

  btn.textContent = "Analyze Screen";
  btn.disabled = false;
}
