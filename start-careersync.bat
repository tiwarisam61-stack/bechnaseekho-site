@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT=%~dp0"
set "DEV_TITLE=CareerSync Dev"
set "PORT=5173"
set "URL=http://localhost:%PORT%/"

pushd "%ROOT%"

echo ==================================================
echo   CareerSync startup
echo ==================================================
echo [1/5] Checking system runtime...

where node >nul 2>nul
if errorlevel 1 goto :node_missing

where npm >nul 2>nul
if errorlevel 1 goto :npm_missing

echo [2/5] Runtime found: Node.js and npm are available.

if not exist "node_modules\" (
  echo [3/5] Installing dependencies...
  call npm install
  if errorlevel 1 goto :install_failed
) else (
  echo [3/5] Dependencies already installed. Skipping npm install.
)

echo [4/5] Releasing any previous CareerSync session...
call "%ROOT%stop-careersync.bat" quiet

set "PORT_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do set "PORT_PID=%%P"
if defined PORT_PID (
  echo [CareerSync] Port %PORT% is already in use by PID !PORT_PID!.
  echo [CareerSync] Stop the conflicting app or run stop-careersync.bat if this is a previous CareerSync session.
  popd
  exit /b 1
)

echo [5/5] Starting the TanStack Start dev server...
echo [CareerSync] Loading server...
echo [CareerSync] Loading server..
echo [CareerSync] Loading server.
start "%DEV_TITLE%" cmd /k "title %DEV_TITLE% && cd /d ""%ROOT%"" && npm run dev -- --host 127.0.0.1 --port %PORT% --strictPort"

echo [CareerSync] Waiting for %URL% to become available...
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$deadline = (Get-Date).AddMinutes(2); $ready = $false; while ((Get-Date) -lt $deadline) { try { $client = [System.Net.Sockets.TcpClient]::new(); $async = $client.BeginConnect('127.0.0.1', %PORT%, $null, $null); if ($async.AsyncWaitHandle.WaitOne(1000) -and $client.Connected) { $client.Close(); $ready = $true; break }; $client.Close() } catch {}; Start-Sleep -Seconds 1 }; if (-not $ready) { exit 1 }"
if errorlevel 1 (
  echo [CareerSync] The dev server did not become ready.
  echo [CareerSync] Check the "%DEV_TITLE%" window for errors.
  popd
  exit /b 1
)

start "" "%URL%"
echo [CareerSync] Browser opened at %URL%
echo [CareerSync] Frontend and server are running in the "%DEV_TITLE%" window.
echo [CareerSync] Startup complete.
popd
exit /b 0

:node_missing
echo [CareerSync] Node.js was not found.
echo [CareerSync] Install Node.js LTS from https://nodejs.org/
echo [CareerSync] Then reopen a new terminal and confirm:
echo [CareerSync]   node -v
echo [CareerSync]   npm -v
popd
exit /b 1

:npm_missing
echo [CareerSync] npm was not found.
echo [CareerSync] Reinstall Node.js from https://nodejs.org/ so npm is included, then reopen the terminal.
echo [CareerSync] Confirm the fix with:
echo [CareerSync]   node -v
echo [CareerSync]   npm -v
popd
exit /b 1

:install_failed
echo [CareerSync] npm install failed. Check the output above for the exact package error.
popd
exit /b 1