import requests
import json
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import sys
import os
import datetime
sys.path.append(os.getcwd())
try:
    from server.main import app
    from server import auth, database
except ImportError:
    # If running from inside server dir or otherwise
    sys.path.append(os.path.dirname(os.getcwd()))
    from server.main import app
    from server import auth, database

# Create a test client
client = TestClient(app)

# Dummy User and Token for authentication
def get_auth_token():
    pass

@patch('requests.post')
def test_process_with_n8n(mock_post):
    print("Testing /process-with-n8n endpoint...")

    # Mock User
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.email = "test@example.com"

    # Mock DB
    mock_db = MagicMock()
    def side_effect_refresh(obj):
        obj.id = 1
        obj.created_at = datetime.datetime.now()
    mock_db.refresh.side_effect = side_effect_refresh

    # Dependency Override
    app.dependency_overrides[auth.get_current_user] = lambda: mock_user
    app.dependency_overrides[database.get_db] = lambda: mock_db

    # Mock n8n Response
    mock_n8n_response = {
        "status": "success",
        "user_id": 1,
        "structured_data": {
            "hemoglobin": "13.5",
            "blood_sugar": "95",
            "cholesterol": "180"
        },
        "raw_text": "Sample OCR text containing medical data."
    }
    
    mock_response_obj = MagicMock()
    mock_response_obj.status_code = 200
    mock_response_obj.json.return_value = mock_n8n_response
    mock_post.return_value = mock_response_obj

    # Create a dummy file
    file_content = b"fake image content"
    files = {"file": ("report.jpg", file_content, "image/jpeg")}

    # Send Request
    import traceback
    try:
        response = client.post("/process-with-n8n", files=files)
    except Exception:
        with open("test_output.txt", "w", encoding="utf-8") as panic_log:
            panic_log.write("CRASHED:\n")
            panic_log.write(traceback.format_exc())
        return

    # Validation
    with open("test_output.txt", "w", encoding="utf-8") as log:
        if response.status_code == 200:
            data = response.json()
            log.write("SUCCESS: Response received.\n")
            log.write(f"Report ID: {data.get('id')}\n")
            
            extracted = json.loads(data.get('extracted_data', '{}'))
            log.write(f"Extracted Data: {extracted}\n")
            
            try:
                assert extracted['hemoglobin'] == "13.5"
                assert extracted['blood_sugar'] == "95"
                log.write("ASSERTION PASSED\n")
            except AssertionError as e:
                log.write(f"ASSERTION FAILED: {e}\n")
                log.write(f"Got: {extracted}\n")

        else:
            log.write(f"FAILED. Status: {response.status_code}\n")
            log.write(f"Response: {response.text}\n")
    
    # Clean up overrides
    app.dependency_overrides = {}

if __name__ == "__main__":
    # To run this, you need to be in the parent directory of 'server' and have dependencies installed.
    # python test_n8n_integration.py
    try:
        test_process_with_n8n()
    except Exception as e:
        print(f"An error occurred: {e}")
