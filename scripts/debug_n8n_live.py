import requests
import os

# URL from server/main.py
N8N_URL = "https://n8n-tj96.onrender.com/webhook/ocr-process"

def debug_n8n_connection():
    print(f"Testing connection to: {N8N_URL}")
    
    # Create a small dummy PDF/Image
    files = {'file': ('test.txt', b'dummy file content', 'text/plain')}
    data = {'user_id': 'debug_user'}

    try:
        print("Sending request... (this might take a moment)")
        response = requests.post(N8N_URL, files=files, data=data, timeout=30)
        
        print(f"\nStatus Code: {response.status_code}")
        print("Headers:", response.headers)
        print("Raw Content:", response.content)
        
        try:
            print("JSON Content:", response.json())
        except Exception as e:
            print(f"Not JSON: {e}")

    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    debug_n8n_connection()
