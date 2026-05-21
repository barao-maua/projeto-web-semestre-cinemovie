$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$projectRoot\frontend"

Write-Host "Subindo frontend Vite em http://localhost:5173 ..." -ForegroundColor Green
npm run dev
