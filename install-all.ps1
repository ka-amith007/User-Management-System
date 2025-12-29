# Installation Script for PowerShell
# Run with: powershell -ExecutionPolicy Bypass -File install-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mini User Management System" -ForegroundColor Cyan
Write-Host "  Complete Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = $PSScriptRoot
Set-Location $baseDir

# Function to install packages
function Install-Packages {
    param (
        [string]$Directory,
        [string]$Name
    )
    
    Write-Host "Installing $Name Dependencies..." -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location "$baseDir\$Directory"
    
    # Clean up
    if (Test-Path "node_modules") {
        Write-Host "Removing old node_modules..." -ForegroundColor Gray
        Start-Sleep -Seconds 1
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    }
    
    # Install
    Write-Host "Running npm install..." -ForegroundColor Gray
    $result = & npm install --prefer-offline --no-audit --loglevel=error 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: Installation had issues, retrying without lock..." -ForegroundColor Yellow
        $result = & npm install --no-package-lock --prefer-offline --loglevel=error 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $Name dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ $Name installation failed!" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
    }
    
    Write-Host ""
    Set-Location $baseDir
}

# Install Backend
Install-Packages -Directory "backend" -Name "Backend"

# Install Frontend
Install-Packages -Directory "frontend" -Name "Frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy backend\.env.example to backend\.env" -ForegroundColor White
Write-Host "2. Update backend\.env with your MongoDB URI and JWT_SECRET" -ForegroundColor White
Write-Host "3. Run: cd backend; npm run seed:admin" -ForegroundColor White
Write-Host "4. Start backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "5. Start frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

Read-Host "Press Enter to exit"
