import requests
import os

# Create a dummy image file
with open("test_image.png", "wb") as f:
    f.write(os.urandom(1024)) # Random bytes

url = "http://127.0.0.1:8000/reports/upload"
files = {'file': ('test_image.png', open('test_image.png', 'rb'), 'image/png')}
token = None

# Get Token first (using the test user created earlier)
auth_url = "http://127.0.0.1:8000/auth/login"
try:
    print("Logging in...")
    # Using the randomized email from previous test might be hard if we don't know it.
    # Let's try to create a *new* user or rely on hardcoded one if possible.
    # Ideally, I should sign up a fresh user to be sure.
    email = "debug_user@example.com"
    password = "debugpassword"
    
    requests.post("http://127.0.0.1:8000/auth/signup", json={"email": email, "password": password, "name": "Debug User"})
    r = requests.post(auth_url, json={"email": email, "password": password})
    if r.status_code == 200:
        token = r.json()['access_token']
        print("Login Successful.")
    else:
        print(f"Login Failed: {r.text}")
        exit()
except Exception as e:
    print(f"Auth Connection Failed: {e}")
    exit()

print(f"Uploading file to {url}...")
headers = {'Authorization': f'Bearer {token}'}

try:
    response = requests.post(url, files=files, headers=headers, timeout=35) # Slightly larger than backend timeout
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except requests.exceptions.Timeout:
    print("❌ Client Validation: Request Timed Out! (Backend took > 35s)")
except Exception as e:
    print(f"❌ Error: {e}")
