@echo off
echo Starting MedVision AI...

:: Start Backend (Running from root to ensure module resolution works)
start "MedVision Backend" cmd /k "python -m uvicorn server.main:app --reload --port 8000"

:: Start Frontend
start "MedVision Frontend" cmd /k "cd client && npm run dev"

echo Servers starting... 
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
