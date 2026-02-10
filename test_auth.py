import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_signup_login():
    print(f"Testing against {BASE_URL}...")
    
    # Randomize email to avoid "Email already registered" error on repeated runs
    import random
    rand_int = random.randint(1000, 9999)
    email = f"testuser{rand_int}@example.com"
    password = "testpassword123"
    name = "Test User"

    # 1. Signup
    print(f"\n[1] Testing Signup for {email}...")
    signup_payload = {
        "email": email,
        "password": password,
        "name": name
    }
    try:
        r = requests.post(f"{BASE_URL}/auth/signup", json=signup_payload)
        if r.status_code == 200:
            print("✅ Signup Success!")
            print(r.json())
        else:
            print(f"❌ Signup Failed: {r.status_code}")
            print(r.text)
            sys.exit(1)
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        sys.exit(1)

    # 2. Login
    print(f"\n[2] Testing Login...")
    login_payload = {
        "email": email,
        "password": password
    }
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        if r.status_code == 200:
            print("✅ Login Success!")
            token = r.json().get("access_token")
            print(f"Token received: {token[:10]}...")
            return token
        else:
            print(f"❌ Login Failed: {r.status_code}")
            print(r.text)
            sys.exit(1)
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_signup_login()
