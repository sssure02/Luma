window.openSidebar = (prefillText = "", mode = "read") => {
  let sidebar = document.getElementById("lumaSidebar");
  let currentAudio = null;

  const logoUrl = typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL("icon.png") : "icon.png";

  if (!document.getElementById("lumaSidebarStyles")) {
    const style = document.createElement("style");
    style.id = "lumaSidebarStyles";
    style.textContent = `
        :root {
          --luma-orange: #f37021;
          --bg-light: #f8fafc;
          --panel-light: #ffffff;
          --text-light: #0f172a;
          --muted-light: #64748b;
          --border-light: #e5e7eb;
          --bg-dark: #0f172a;
          --panel-dark: #111827;
          --text-dark: #e5e7eb;
          --muted-dark: #9ca3af;
          --border-dark: #1f2937;
          --radius: 12px;
        }

        #lumaSidebar {
          position: fixed;
          top: 0; right: 0;
          width: 380px; height: 100%;
          z-index: 999999;
          background: var(--bg-light);
          color: var(--text-light);
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
          padding: 20px;
          box-shadow: -4px 0 15px rgba(0,0,0,0.1);
          display: flex; flex-direction: column;
          box-sizing: border-box; overflow-y: auto;
        }

        #lumaSidebar.dark { background: var(--bg-dark); color: var(--text-dark); }

        .luma-header {
          display: flex; align-items: center; justify-content: space-between;
          margin: -20px -20px 20px -20px; padding: 12px 20px;
          background: var(--luma-orange); border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        /* 1. Fix the Card Backgrounds */
        #lumaSidebar.dark .luma-card {
        background: var(--panel-dark) !important;
        border-color: var(--border-dark) !important;
        }

        /* 2. Fix the Textarea (Input Box) */
        #lumaSidebar.dark textarea {
        background: transparent !important;
        color: var(--text-dark) !important;
        }

        /* 3. Fix the Pre elements (Explanation & Rewritten) */
        #lumaSidebar.dark .luma-output-text {
        background: transparent !important;
        color: var(--text-dark) !important;
        }

        /* 4. Fix the Placeholder text visibility in dark mode */
        #lumaSidebar.dark textarea::placeholder {
        color: var(--muted-dark);
        }

        .luma-mode-badge {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--luma-orange);
          margin-bottom: 12px;
          letter-spacing: 1px;
          display: inline-block;
          border: 1px solid var(--luma-orange);
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
        }

        .hidden { display: none !important; }
        .luma-title { font-size: 20px; font-weight: 700; color: white; margin: 0; }
        .luma-logo-img { width: 32px; height: 32px; object-fit: contain; }
        .luma-header .icon-btn { color: white !important; opacity: 0.9; }

        #lumaSidebar h4 {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
          margin: 16px 0 8px; color: white; background: var(--luma-orange);
          padding: 6px 12px; border-radius: var(--radius); text-align: center;
        }

        .luma-card { background: var(--panel-light); border-radius: var(--radius); padding: 12px; border: 1px solid var(--border-light); }
        #lumaSidebar.dark .luma-card { background: var(--panel-dark) !important; border-color: var(--border-dark) !important; }

        textarea { width: 100%; min-height: 120px; resize: vertical; border: none; background: transparent; color: inherit; font-size: 14px; outline: none; }
        
        #lumaAnalyzeBtn {
          background: var(--luma-orange); color: white; border: none;
          border-radius: var(--radius); padding: 14px; font-weight: 600;
          cursor: pointer; margin: 16px 0; font-size: 14px;
        }

        // .luma-output-text { white-space: pre-wrap; font-size: 14px; line-height: 1.6; margin: 0; }
        .luma-output-text {
            white-space: pre-wrap;
            font-size: 15px; /* Slightly larger for easier scanning */
            line-height: 1.8; /* More vertical space between lines */
            letter-spacing: 0.3px; /* Better character spacing */
            margin: 0;
            color: inherit;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; /* Clean sans-serif */
            }

        /* Add a subtle highlight to the labels in the output */
        #lumaExplanation, #lumaRewrite {
        padding: 5px;
        }
        .icon-btn, .speak-btn { background: transparent; border: none; cursor: pointer; }
        .header-container { display: flex; align-items: center; justify-content: space-between; }
        
        .speak-btn { font-size: 18px; opacity: 0.6; transition: opacity 0.2s; }
        .speak-btn:hover { opacity: 1; color: var(--luma-orange); }
    `;
    document.head.appendChild(style);
  }

  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "lumaSidebar";
    sidebar.innerHTML = `
      <div class="luma-header">
        <div class="luma-brand" style="display:flex; align-items:center; gap:12px;">
          <img src="${logoUrl}" class="luma-logo-img">
          <h3 class="luma-title">Luma</h3>
        </div>
        <div>
          <button id="lumaDarkToggle" class="icon-btn">🌓</button>
          <button id="lumaClose" class="icon-btn">✕</button>
        </div>
      </div>

      <div id="lumaModeBadge" class="luma-mode-badge">Reading Mode</div>

      <div class="luma-card">
        <textarea id="lumaInput" placeholder="Text to analyze..."></textarea>
      </div>

      <button id="lumaAnalyzeBtn">Analyze Context</button>

      <div class="header-container">
        <h4>Social Explanation</h4>
        <button class="speak-btn" id="speakExplanation">🔊</button>
      </div>
      <div class="luma-card" style="margin-bottom: 12px;">
        <pre id="lumaExplanation" class="luma-output-text">Analysis will appear here...</pre>
      </div>

      <div id="rewriteContainer">
        <div class="header-container">
          <h4>Clear Rewrite</h4>
          <button class="speak-btn" id="speakRewrite">🔊</button>
        </div>
        <div class="luma-card">
          <pre id="lumaRewrite" class="luma-output-text">---</pre>
        </div>
      </div>
    `;

    document.body.appendChild(sidebar);

    document.getElementById("lumaDarkToggle").onclick = () => sidebar.classList.toggle("dark");
    document.getElementById("lumaClose").onclick = () => { if(currentAudio) currentAudio.pause(); sidebar.remove(); };

    document.getElementById("lumaAnalyzeBtn").onclick = async () => {
      const text = document.getElementById("lumaInput").value;
      const explanationEl = document.getElementById("lumaExplanation");
      const rewriteEl = document.getElementById("lumaRewrite");
      const currentMode = document.getElementById("lumaModeBadge").innerText.includes("Reading") ? "read" : "write";

      explanationEl.innerText = "Processing...";
      rewriteEl.innerText = "...";

      try {
        const res = await fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            text: text, 
            mode: currentMode
          })
        });
        const data = await res.json();
        // This line removes all asterisks from the text before displaying it
        const cleanExplanation = data.explanation.replace(/\*/g, '');
        const cleanRewrite = data.rewrite.replace(/\*/g, '');
        explanationEl.innerText = cleanExplanation;
        rewriteEl.innerText = cleanRewrite;
      } catch (err) {
        explanationEl.innerText = "Error: Check API.";
      }
    };

    const speakViaBackend = async (textId, btnId) => {
        const text = document.getElementById(textId).innerText;
        const btn = document.getElementById(btnId);
        if (!text || text.length < 5 || text.includes("...")) return;
        if (currentAudio) currentAudio.pause();
        btn.innerText = "⏳";
        try {
            const response = await fetch("http://127.0.0.1:8000/proxy-tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });
            const blob = await response.blob();
            currentAudio = new Audio(URL.createObjectURL(blob));
            currentAudio.onplay = () => btn.innerText = "🔊";
            currentAudio.onended = () => btn.innerText = "🔊";
            await currentAudio.play();
        } catch (err) { btn.innerText = "❌"; }
    };

    document.getElementById("speakExplanation").onclick = () => speakViaBackend("lumaExplanation", "speakExplanation");
    document.getElementById("speakRewrite").onclick = () => speakViaBackend("lumaRewrite", "speakRewrite");
  }

  // --- Mode Handling Logic ---
  const badge = document.getElementById("lumaModeBadge");
  const rewriteBox = document.getElementById("rewriteContainer");
  const input = document.getElementById("lumaInput");

  input.value = prefillText;
  
  if (mode === 'read') {
    badge.innerText = "🔍 Reading Mode";
    badge.style.borderColor = "var(--luma-orange)";
    rewriteBox.classList.add("hidden");
  } else {
    badge.innerText = "✍️ Writing Mode";
    badge.style.borderColor = "#22c55e"; // Green for writing
    rewriteBox.classList.remove("hidden");
  }

  // Auto-analyze if text is provided via right-click
  if (prefillText) {
    document.getElementById("lumaAnalyzeBtn").click();
  }
};

// content.js - At the bottom of the file
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openLuma") {
    // This calls the function defined in this file
    window.openSidebar(request.text, request.mode);
  }
});