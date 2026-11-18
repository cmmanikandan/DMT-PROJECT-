@echo off
title ECOMSIGHT AI - Stop Servers
color 0E

echo ======================================================================
echo                ECOMSIGHT AI - STOPPING SERVERS
echo ======================================================================
echo.

:: Kill processes listening on Port 8000 (Backend)
echo [*] Checking for Backend processes on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo     Terminating process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill processes listening on Port 5173 (Frontend)
echo [*] Checking for Frontend processes on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo     Terminating process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Close launcher windows if any remain
taskkill /FI "WINDOWTITLE eq ECOMSIGHT - Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq ECOMSIGHT - Frontend*" /F >nul 2>&1

echo.
echo [OK] All ECOMSIGHT servers have been stopped.
echo ======================================================================
timeout /t 2 >nul
