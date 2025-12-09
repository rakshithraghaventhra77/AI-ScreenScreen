ScreenRead-AI — Understand What’s On Your Screen Instantly

A lightweight Chrome extension that captures your current browser tab, analyzes the visible content using AI, and gives you Final Answer + Explanation instantly — without switching apps, taking manual screenshots, or copying text.

Built to streamline learning, debugging, UX reviews, and rapid analysis of any webpage.

🚀 Features
🔍 Instant Screen Capture

Automatically grabs the visible content of the active tab as soon as the popup opens.

🖼️ Optional Image Upload

Add a second reference image (mockup, diagram, chart) for comparison or dual-analysis.

🤖 AI-Powered Screen Understanding

Uses multimodal AI to provide:

Final Answer

Explanation

Answers only from the visible content.

⚡ Clean, Fast, Minimal

Lightweight popup, no server, no backend — everything runs client-side.

🧩 Requirements

Chrome Browser

A valid API key
Supported providers:

Google Gemini API

Other AI APIs (OpenAI, Groq, HuggingFace, etc.)

🛠️ Install & Run Locally (Developer Mode)

Clone or download this repository

Open Chrome and go to:

chrome://extensions


Enable Developer Mode (top-right)

Click Load Unpacked

Select the extension folder containing:

manifest.json
popup.html
popup.js
styles.css


Open any webpage → Click the extension → Ask questions

🔑 Set Your API Key

Open popup.js and add your key:

const API_KEY = "YOUR_API_KEY_HERE";


Supported models (for Google Gemini users):

models/gemini-2.5-flash-lite   // recommended
models/gemini-2.5-flash
models/gemini-2.0-flash

📦 Folder Structure
ScreenReadAI/
│── manifest.json
│── popup.html
│── popup.js
│── styles.css
│── icons/ (optional)
│── README.md

🌐 Publish to Chrome Web Store (Optional)

Zip all extension files

Go to:
https://chrome.google.com/webstore/devconsole

Upload ZIP → Fill listing info → Submit for review

💡 Usage Example

Ask questions such as:

"Summarize what is happening on this screen."

"What is the main CTA?"

"Compare this screen with the uploaded design."

"Explain the steps shown here."

AI responds in this exact format:

Final Answer:
<answer>

Explanation:
<why the answer was chosen based on visible content>
