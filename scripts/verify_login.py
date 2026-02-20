import requests
from server.database import SessionLocal
from server.models import User
from server.auth import verify_password, get_password_hash

def test_login_logic():
    print("Testing Login Logic...")
    db = SessionLocal()
    
    # 1. Check if admin user exists
    user = db.query(User).filter(User.email == "admin@medvision.com").first()
    if not user:
        print("❌ Admin user NOT found in DB!")
    else:
        print(f"✅ Admin user found: {user.email}")
        
        # 2. Check password hash
        is_valid = verify_password("admin123", user.hashed_password)
        if is_valid:
            print("✅ Password 'admin123' matches hash.")
        else:
            print("❌ Password 'admin123' does NOT match hash.")
            # Reset password
            print("⚠️ Resetting password to 'admin123'...")
            user.hashed_password = get_password_hash("admin123")
            db.commit()
            print("✅ Password reset committed.")

    db.close()

    # 3. Test API Endpoint
    print("\nTesting API Endpoint...")
    try:
        response = requests.post("http://localhost:8000/auth/login", json={"email": "admin@medvision.com", "password": "admin123"})
        if response.status_code == 200:
             print("✅ API Login Successful!")
             print("Token:", response.json().get("access_token")[:20] + "...")
        else:
             print(f"❌ API Login Failed: {response.status_code}")
             print(response.text)
    except Exception as e:
        print(f"❌ API Connection Failed: {e}")

if __name__ == "__main__":
    test_login_logic()
