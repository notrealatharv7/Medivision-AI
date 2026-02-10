# MedVision AI - Setup & Run Instructions

## Prerequisites
- Python 3.8+
- Node.js & npm
- Google Account (for Colab)

## 1. Backend Setup (FastAPI)
Navigate to the `server` directory and install dependencies (if not already done):
```bash
cd server
pip install -r requirements.txt
```
Run the server:
```bash
python -m uvicorn server.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`.*

## 2. Frontend Setup (React)
Navigate to the `client` directory:
```bash
cd client
npm install
```
Start the development server:
```bash
npm run dev
```
*Open `http://localhost:5173` in your browser.*

## 3. ML Service Setup (Google Colab)
1. Open [Google Colab](https://colab.research.google.com/).
2. Create a new notebook.
3. Copy the content from `ml_notebook/medvision_colab_script.py` into a cell.
4. Run the cell.
5. It will print a public ngrok URL (e.g., `http://xxxx-xx-xx.ngrok-free.app`).
6. **Important**: You likely need to update `COLAB_API_URL` in `server/main.py` or set it via environment variable `COLAB_API_URL=http://...` before running the backend, or just update the variable in `server/main.py` line 67 manually.

## 4. Usage
1. Go to the Sign Up page and create an account.
2. Log in.
3. Upload a medical report image or PDF on the Dashboard.
4. Wait for analysis (ensure Colab is running).
5. View results and history.
