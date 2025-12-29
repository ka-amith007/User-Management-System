@echo off
echo Installing Backend Dependencies...
cd /d "%~dp0backend"

echo Cleaning up...
timeout /t 2 /nobreak >nul
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del /f package-lock.json 2>nul

echo Installing dependencies...
call npm install --prefer-offline --no-audit --loglevel=error

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Backend dependencies installed successfully!
    echo.
) else (
    echo.
    echo ✗ Installation failed. Retrying without package-lock...
    call npm install --no-package-lock --prefer-offline --no-audit
)

cd ..
echo Done!
pause
