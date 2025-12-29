# AI Hub 部署脚本 (Windows PowerShell)
# 这个脚本用于在本地测试和部署AI Hub网站

Write-Host "AI Hub 部署脚本 (Windows)"
Write-Host "=" * 50

# 检查是否安装了Python
Write-Host "检查Python环境..."
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "未找到Python，请先安装Python 3.7+"
    exit 1
}

$pythonVersion = python --version
Write-Host "✅ Python版本: $pythonVersion"

# 启动本地HTTP服务器
Write-Host "启动本地HTTP服务器..."
Write-Host "访问地址: http://localhost:8000"
Write-Host "按 Ctrl+C 停止服务器"
Write-Host "=" * 50

# 启动HTTP服务器
python -m http.server 8000 --bind 127.0.0.1
