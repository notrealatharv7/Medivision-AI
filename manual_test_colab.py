import requests

# The URL currently in your server/main.py
COLAB_API_URL = "https://unsportful-joyously-charise.ngrok-free.dev"

print(f"Testing URL: {COLAB_API_URL}")

headers = {"ngrok-skip-browser-warning": "true"}

# 1. Test GET (like your browser did)
try:
    print("\n--- Test 1: GET Request (Root) ---")
    response = requests.get(f"{COLAB_API_URL}/", headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"GET Failed: {e}")

# 2. Test POST (like the upload does)
try:
    print("\n--- Test 2: POST Request (Analyze) ---")
    # Sending a dummy file
    files = {'file': ('test.txt', b'dummy content', 'text/plain')}
    response = requests.post(f"{COLAB_API_URL}/analyze-report", files=files, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}") # First 200 chars
except Exception as e:
    print(f"POST Failed: {e}")
