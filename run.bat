@echo off
title ECOMSIGHT AI - Platform Launcher
color 0B
setlocal enabledelayedexpansion

:: Navigate to project root directory
cd /d "%~dp0"

cls
echo ======================================================================
echo             ECOMSIGHT AI PLATFORM - ONE-CLICK LAUNCHER
echo ======================================================================
echo.

:: 1. Check Python
echo [*] Checking Python environment...
set "PYTHON_CMD="

python --version >nul 2>&1
if !errorlevel! equ 0 (
    set "PYTHON_CMD=python"
) else (
    py --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_CMD=py"
    )
)

if "!PYTHON_CMD!"=="" (
    color 0C
    echo [ERROR] Python is not found in your system PATH!
    echo Please install Python 3.10+ from https://www.python.org/
    echo and ensure "Add Python to PATH" is checked during installation.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('!PYTHON_CMD! --version 2^>^&1') do echo     Found: %%v

:: 2. Check Node.js and NPM
echo.
echo [*] Checking Node.js and NPM...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v 2^>^&1') do echo     Found Node: %%v
for /f "tokens=*" %%v in ('npm -v 2^>^&1') do echo     Found NPM:  v%%v

:: 3. Check frontend dependencies
if not exist "frontend\node_modules" (
    echo.
    echo [*] Frontend dependencies not found. Installing node_modules...
    cd frontend
    call npm install
    cd ..
)

:: 4. Start Backend Server in a new window
echo.
echo [*] Starting FastAPI Backend on http://localhost:8000 ...
start "ECOMSIGHT - Backend API (Port 8000)" cmd /k "cd /d "%~dp0backend" && title ECOMSIGHT - Backend API (Port 8000) && color 0A && echo ========================================== && echo   ECOMSIGHT FastAPI Backend (Port 8000)    && echo ========================================== && echo. && !PYTHON_CMD! -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

:: 5. Start Frontend Vite Server in a new window
echo [*] Starting Vite Frontend on http://localhost:5173 ...
start "ECOMSIGHT - Frontend UI (Port 5173)" cmd /k "cd /d "%~dp0frontend" && title ECOMSIGHT - Frontend UI (Port 5173) && color 03 && echo ========================================== && echo   ECOMSIGHT Frontend Dev Server (Port 5173)  && echo ========================================== && echo. && npm run dev"

:: 6. Wait a moment and launch default browser
echo.
echo [*] Waiting for services to initialize...
timeout /t 3 /nobreak >nul

echo [*] Opening ECOMSIGHT Dashboard in your browser...
start http://localhost:5173

:: 7. Control Panel Hub
:CONTROL_HUB
cls
color 0B
echo ======================================================================
echo             ECOMSIGHT AI PLATFORM IS RUNNING!
echo ======================================================================
echo.
echo   [1] Frontend App:   http://localhost:5173
echo   [2] Backend API:    http://localhost:8000
echo   [3] API Docs:       http://localhost:8000/docs
echo.
echo   Status: Both Backend and Frontend services are running in their
echo           own dedicated console windows with hot-reload enabled.
echo ======================================================================
echo.
echo  Quick Actions:
echo    [1] Re-open Frontend in browser
echo    [2] Open Backend Swagger API Docs
echo    [3] Stop all ECOMSIGHT servers
echo    [Q] Quit this launcher (leaves servers running)
echo.
set /p choice="Enter selection [1/2/3/Q]: "

if "%choice%"=="1" (
    start http://localhost:5173
    goto CONTROL_HUB
)
if "%choice%"=="2" (
    start http://localhost:8000/docs
    goto CONTROL_HUB
)
if "%choice%"=="3" (
    goto STOP_SERVERS
)
if /i "%choice%"=="q" (
    exit /b 0
)

goto CONTROL_HUB

:STOP_SERVERS
echo.
echo [*] Stopping servers on ports 8000 and 5173...
call "%~dp0stop.bat"
echo.
echo [DONE] All servers stopped.
pause
exit /b 0
