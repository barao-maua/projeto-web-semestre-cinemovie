$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$projectRoot\config"

Write-Host "Limpando __pycache__..." -ForegroundColor Cyan
Get-ChildItem -Recurse -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Recurse -Filter "*.pyc" | Remove-Item -Force

Write-Host "Rodando migrations..." -ForegroundColor Cyan
python manage.py migrate

Write-Host "Subindo servidor Django em http://127.0.0.1:8000 ..." -ForegroundColor Green
python manage.py runserver 127.0.0.1:8000
