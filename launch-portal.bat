@echo off
cd "C:\path\to\reedsolutionsllc-website\portal"
start "" "C:\path\to\python.exe" app.py
timeout /t 3
start "" http://127.0.0.1:5000/portal/login
