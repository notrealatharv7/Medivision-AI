# MedVision AI - Colab ML Service
# Copy this code into a Google Colab cell and run it.

# 1. Install Dependencies
!pip install fastapi uvicorn pyngrok python-multipart torch torchvision transformers accelerate sentencepiece pytesseract Pillow

# 2. Install Tesseract OCR (System dependency)
!sudo apt-get install tesseract-ocr
!sudo apt-get install libtesseract-dev

# 3. Import Libraries
import nest_asyncio
from pyngrok import ngrok
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import pytesseract
from PIL import Image
import io
import json

# 4. Load Models (Run once)
print("Loading Models...")

# OCR
# pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract' # Usually auto-detected in Colab

# SLM (TinyLlama or Phi-2)
model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
# model_id = "microsoft/phi-2" 

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16, device_map="auto")

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=512)

print("Models Loaded!")

# 5. Define Application
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResult(BaseModel):
    extracted_data: dict
    explanation: str
    risks: List[str]
    diet: List[str]
    exercise: List[str]

@app.get("/")
def home():
    return {"message": "MedVision ML Service Running"}

@app.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):
    # Read Image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # 1. OCR Extraction
    text = pytesseract.image_to_string(image)
    print(f"Extracted Text: {text[:100]}...")
    
    # 2. Parse Data (Simple Heuristic / LLM Extraction)
    # For demo, we ask LLM to extract JSON or we do simple regex. 
    # Here let's ask LLM to explain and extract.
    
    prompt = f"""
    <|system|>
    You are a medical assistant. Analyze the following medical report text.
    1. Extract key values (Hemoglobin, Sugar, etc.) into a JSON format.
    2. Explain the results in simple terms.
    3. Identify health risks.
    4. Suggest a diet plan.
    5. Suggest exercises.
    
    Format the output as valid JSON with keys: "extracted_data", "explanation", "risks" (list), "diet" (list), "exercise" (list).
    </s>
    <|user|>
    Report Text:
    {text}
    </s>
    <|assistant|>
    """
    
    # Generate
    outputs = pipe(prompt, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
    generated_text = outputs[0]["generated_text"]
    
    # Post-process (Extract JSON from response - tricky with LLMs, needs robust parsing)
    # For resilience, we'll try to find the first '{' and last '}'
    response_json = {}
    try:
        response_part = generated_text.split("<|assistant|>")[-1]
        start_idx = response_part.find('{')
        end_idx = response_part.rfind('}') + 1
        if start_idx != -1 and end_idx != -1:
            json_str = response_part[start_idx:end_idx]
            response_json = json.loads(json_str)
        else:
            response_json = {"explanation": response_part}
    except Exception as e:
        response_json = {"explanation": "Error parsing AI response", "raw_output": generated_text}

    return response_json

# 6. Start Server
# Set your ngrok authtoken if needed
# Get your token from https://dashboard.ngrok.com/get-started/your-authtoken
ngrok.set_auth_token("ENTER_YOUR_NGROK_AUTH_TOKEN_HERE")

ngrok_tunnel = ngrok.connect(8000)
print('Public URL:', ngrok_tunnel.public_url)

# Fix for Colab/Jupyter running event loop
import asyncio

if __name__ == "__main__":
    config = uvicorn.Config(app, port=8000)
    server = uvicorn.Server(config)
    await server.serve()
