@echo off
echo ============================================
echo  Cai dat NotebookLM MCP Server
echo ============================================

:: Cai thu vien Python
echo [1/3] Cai dat thu vien Python...
pip install -r "%~dp0requirements.txt"
if errorlevel 1 (
    echo LOI: Khong the cai dat thu vien. Kiem tra Python va pip.
    pause
    exit /b 1
)

:: Cai dat Playwright browsers
echo [2/3] Cai dat Chromium cho Playwright...
playwright install chromium
if errorlevel 1 (
    echo LOI: Khong the cai dat Chromium.
    pause
    exit /b 1
)

:: Kiem tra server chay duoc khong
echo [3/3] Kiem tra server...
python "%~dp0server.py" --version 2>nul || echo (Khong co flag --version - binh thuong)

echo.
echo ============================================
echo  Cai dat hoan tat!
echo.
echo  Buoc tiep theo: them vao claude_desktop_config.json
echo  Xem README.md de biet chi tiet.
echo ============================================
pause
