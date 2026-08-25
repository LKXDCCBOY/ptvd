@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo    PTVD 开发服务器启动脚本
echo ============================================
echo.

if not exist "node_modules" (
    echo [1/2] 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo.
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
) else (
    echo [1/2] 依赖已安装，跳过
)

echo.
echo [2/2] 启动开发服务器...
echo.
echo ============================================
echo    启动成功后，请访问: http://localhost:5173
echo    按 Ctrl+C 停止服务器
echo ============================================
echo.

call npm run dev
pause
