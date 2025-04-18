@echo off

echo Starting .Net Server
start cmd /k "cd /d Api && dotnet watch run"

echo Starting Vite App
start cmd /k "cd /d frontend && npm run dev"

echo Starting Django Auth Server
start cmd /k "cd /d auth && env\scripts\activate && python manage.py runserver"

echo Starting Node Proxy Server
start cmd /k "cd /d backend && npm run dev"

echo Starting Node File Server
start cmd /k "cd /d fileServer && npm run dev"
