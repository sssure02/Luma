# Luma 
**Making clarity accessible to everyone**

Luma is a privacy-first Chrome extension that helps users understand and express social meaning in text.  
It is designed for neurodivergent individuals, non-native speakers, and anyone experiencing social anxiety — but useful for everyone.

Luma helps users:
- Read between the lines in written text
- Understand implied social cues
- Rewrite messages to be clearer and less ambiguous

---

## ✨ Features

### 📖 Reading Mode
- Select text on any webpage
- Right-click → “Explain social cues”
- Get a clear explanation of implied meaning and intent

### ✍️ Writing Mode
- Select text you want to edit
- Right-click → “Rewrite”
- Receive:
  - An explanation of how the message might be interpreted
  - A clearer, more explicit rewritten version

### ♿ Accessibility
- Dark mode
- Text-to-speech
- Simple, distraction-free UI

### 🔐 Privacy-First
- No user accounts
- No data storage
- Text is processed only to generate responses

---

## 🧠 Why Luma?

Human communication relies heavily on **implicit meaning** — tone, hints, assumptions, and unspoken requests.  
For many people, especially neurodivergent individuals and non-native speakers, this creates confusion and anxiety.

Luma doesn’t change how people think or speak.  
It makes hidden meaning visible — supporting understanding, not replacing human interaction.

---

## 🏗️ Tech Stack

### Frontend (Chrome Extension)
- HTML
- CSS
- JavaScript
- Chrome Extension APIs (context menus, popup UI)

### Backend (AI Service)
- Python
- FastAPI
- Large Language Model (LLM) for:
  - Social cue explanation
  - Message simplification
  - Clarity-focused rewriting
- Eleven Labs for AI Voice Generator

---

## 📂 Project Structure

```text
luma/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── styles.css
├── backend/
│   ├── main.py
│   └── requirements.txt
└── README.md
```

## 🚀 How to Run the Project

1️⃣ Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

2️⃣ Load the Chrome Extension

Open Chrome
Go to chrome://extensions
Enable Developer mode
Click Load unpacked
Select the extension/ folder

3️⃣ Use Luma

Highlight text → right-click → Read/Write Model
Toggle dark mode or text-to-speech as needed



