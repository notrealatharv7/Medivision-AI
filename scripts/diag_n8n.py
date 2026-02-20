import requests
import os

N8N_URL = "https://n8n-tj96.onrender.com/webhook/ocr-process"

def debug():
    print(f"DEBUG: Testing {N8N_URL}")
    files = {'file': ('test.png', b'fake image data', 'image/png')}
    data = {'user_id': '1', 'user_age': '30', 'user_gender': 'Male', 'user_weight': '70'}
    
    try:
        response = requests.post(N8N_URL, files=files, data=data, timeout=60)
        print(f"STATUS: {response.status_code}")
        print(f"RAW TEXT: '{response.text}'")
        print(f"RAW BYTES: {response.content}")
        
        with open("n8n_raw_response.txt", "w", encoding="utf-8") as f:
            f.write(f"Status: {response.status_code}\n")
            f.write(f"Text: {response.text}\n")
            f.write(f"Bytes: {list(response.content)}\n")
            
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    debug()
