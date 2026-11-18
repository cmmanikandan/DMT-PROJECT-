@echo off
title ECOMSIGHT AI - Setup Dependencies
color 0A
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ======================================================================
echo              ECOMSIGHT AI - ENVIRONMENT SETUP
echo ======================================================================
echo.

:: 1. Detect Python
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
    echo [ERROR] Python not found. Please install Python 3.10+ from python.org.
    pause
    exit /b 1
)

echo [*] Installing / updating Python backend dependencies...
cd backend
!PYTHON_CMD! -m pip install -r requirements.txt
cd ..

:: 2. Detect Node & npm
echo.
echo [*] Installing frontend npm packages...
cd frontend
call npm install
cd ..

echo.
echo ======================================================================
echo [SUCCESS] Setup complete! You can now launch the app using run.bat
echo ======================================================================
echo.
pause
