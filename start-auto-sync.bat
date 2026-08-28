@echo off
title Launching Website Auto-Sync...
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0auto-sync.ps1"
pause
