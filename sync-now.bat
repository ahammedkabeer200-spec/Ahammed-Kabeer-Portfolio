@echo off
title Syncing Website to GitHub...
echo ======================================================
echo    Ahammed Kabeer Portfolio - Sync to GitHub
echo ======================================================
echo.

set "REPO_DIR=%~dp0"
cd /d "%REPO_DIR%"

echo [1/3] Staging changes...
git add .

git diff-index --quiet HEAD --
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [i] No new changes detected. Everything is already up to date!
    echo.
    timeout /t 3 >nul
    exit /b 0
)

echo [2/3] Committing changes...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set "timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%"
git commit -m "Update website: %timestamp%"

echo [3/3] Uploading to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================
    echo  [SUCCESS] Successfully uploaded to GitHub!
    echo  Your live GitHub Pages and Netlify sites will
    echo  update automatically within 60 seconds.
    echo ======================================================
) else (
    echo.
    echo [ERROR] Failed to push to GitHub. Please check internet connection.
)

echo.
echo Closing in 4 seconds...
timeout /t 4 >nul
