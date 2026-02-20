import requests
import sys

# Read URL from main.py to be sure
try:
    with open('server/main.py', 'r') as f:
        for line in f:
            if 'COLAB_API_URL =' in line:
                url = line.split('=')[1].strip().strip('"').strip("'")
                # Remove comments if any
                if '#' in url:
                    url = url.split('#')[0].strip()
                break
except:
    url = "https://unsportful-joyously-charise.ngrok-free.dev"

print(f"🔍 Testing Connection to: {url}")

try:
    # Try ROOT first
    print("\n--- Attempt 1: Root URL ---")
    headers = {"ngrok-skip-browser-warning": "true"}
    r = requests.get(f"{url}/", headers=headers, timeout=10)
    print(f"Status Code: {r.status_code}")
    print(f"Content Type: {r.headers.get('Content-Type')}")
    print(f"Response Preview: {r.text[:200]}")

    # Try DOCS (FastAPI default)
    print("\n--- Attempt 2: /docs ---")
    r = requests.get(f"{url}/docs", headers=headers, timeout=10)
    if r.status_code == 200:
        print("✅ SUCCESS: ML Service is reachable!")
    else:
        print(f"❌ Failed to reach /docs: {r.status_code}")

except requests.exceptions.ConnectionError:
    print(f"❌ Connection Error: The URL '{url}' is invalid or down.")
    print("   Please check if the Colab notebook is actually running.")
except Exception as e:
    print(f"❌ Error: {e}")
