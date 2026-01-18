from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
import os
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-3-flash" # Note: Updated to current stable model

class TextInput(BaseModel):
    text: str
    mode: str = "read"

@app.post("/analyze")
def analyze_text(input: TextInput):
    if input.mode == "read":
        # Specific instructions for Reading Mode
        explanation_prompt = f"""
        ACT AS A SOCIAL TRANSLATOR. Analyze this text for a neurodivergent reader.
        Format the output EXACTLY like this with no bolding or symbols:
        MEANING: [1 sentence explaining implied intent]
        TONE: [1-2 descriptive words]
        CONTEXT: [1 sentence about assumptions]
        
        Text: {input.text}
        """
        # Generate only the explanation
        explanation_response = client.models.generate_content(
            model=MODEL_NAME,
            contents=explanation_prompt
        )
        return {
            "explanation": explanation_response.text,
            "rewrite": "N/A" # Explicitly empty for Reading Mode
        }
    
    else:
        # Specific instructions for Writing Mode
        explanation_prompt = f"Analyze the tone of this draft briefly: {input.text}"
        rewrite_prompt = f"Rewrite this message to be polite, clear, and direct: {input.text}"

        exp_res = client.models.generate_content(model=MODEL_NAME, contents=explanation_prompt)
        rew_res = client.models.generate_content(model=MODEL_NAME, contents=rewrite_prompt)

        return {
            "explanation": exp_res.text,
            "rewrite": rew_res.text
        }
    
    
@app.post("/proxy-tts")
async def proxy_tts(input: TextInput):
    VOICE_ID = "21m00Tcm4TlvDq8ikWAM" # Rachel
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }

    data = {
        "text": input.text,
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="ElevenLabs API Error")

    # Stream the audio bytes directly to the frontend
    return StreamingResponse(io.BytesIO(response.content), media_type="audio/mpeg")
