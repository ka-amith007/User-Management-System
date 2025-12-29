@echo off
echo ========================================
echo   Mini User Management System
echo   Complete Installation Script
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Installing Backend Dependencies...
echo.
cd backend
if exist node_modules (
    echo Removing old node_modules...
    timeout /t 2 /nobreak >nul
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json del /f package-lock.json 2>nul

echo Installing backend packages...
call npm install --prefer-offline --no-audit --progress=false

if %ERRORLEVEL% NEQ 0 (
    echo Warning: Installation had issues, retrying...
    call npm install --no-package-lock --prefer-offline
)

cd ..
echo.
echo ========================================
echo.

echo Step 2: Installing Frontend Dependencies...
echo.
cd frontend
if exist node_modules (
    echo Removing old node_modules...
    timeout /t 2 /nobreak >nul
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json del /f package-lock.json 2>nul

echo Installing frontend packages...
call npm install --prefer-offline --no-audit --progress=false

if %ERRORLEVEL% NEQ 0 (
    echo Warning: Installation had issues, retrying...
    call npm install --no-package-lock --prefer-offline
)

cd ..
echo.
echo ========================================
echo.
echo Installation Complete!
echo.
echo Next steps:
echo 1. Copy backend\.env.example to backend\.env
echo 2. Update backend\.env with your MongoDB URI and JWT_SECRET
echo 3. Run: cd backend ^&^& npm run seed:admin
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo.
echo ========================================
pause
