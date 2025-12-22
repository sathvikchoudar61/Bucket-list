@echo off
echo ===============================
echo Starting Bucket List App
echo ===============================

REM Start Backend (Flask API)
echo Starting Backend on port 8000...
start cmd /k "cd backend && python app.py"

REM Small delay to allow backend to start
timeout /t 2 > nul

REM Start Frontend Server
echo Starting Frontend server on port 5500...
start cmd /k "cd frontend && python -m http.server 5500"

REM Open browser
timeout /t 2 > nul
start http://localhost:5500/index.html

echo ===============================
echo App is running!
echo Backend : http://localhost:8000
echo Frontend: http://localhost:5500
echo ===============================

pause
