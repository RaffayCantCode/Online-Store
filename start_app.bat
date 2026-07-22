@echo off
title Taskeen Variety Store - Local Server
echo ========================================================
echo   Starting Taskeen Variety Store E-Commerce Web App...
echo ========================================================
echo.

:: Wait 1 second and launch default browser to local server
timeout /t 2 /nobreak >nul
start http://localhost:3000/

:: Start Vite Development Server
cmd /c npm run dev

pause
