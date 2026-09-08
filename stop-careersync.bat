@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "DEV_TITLE=CareerSync Dev"
set "PORT=5173"
set "QUIET=%~1"
set "STOPPED=0"

if /i not "%QUIET%"=="quiet" (
  echo ==================================================
  echo   CareerSync shutdown
  echo ==================================================
  echo [1/3] Looking for running dev servers...
)

taskkill /FI "WINDOWTITLE eq %DEV_TITLE%" /T /F >nul 2>nul
if not errorlevel 1 set "STOPPED=1"

set "PORT_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do set "PORT_PID=%%P"
if defined PORT_PID (
  if /i not "%QUIET%"=="quiet" echo [2/3] Stopping PID !PORT_PID! on port %PORT%...
  taskkill /PID !PORT_PID! /T /F >nul 2>nul
  if not errorlevel 1 set "STOPPED=1"
)

if /i not "%QUIET%"=="quiet" (
  echo [3/3] Finalizing shutdown...
  if "%STOPPED%"=="1" (
    echo [CareerSync] Dev server stopped.
  ) else (
    echo [CareerSync] No running CareerSync dev server was found.
  )
  echo [CareerSync] Shutdown complete.
  pause
)

exit /b 0