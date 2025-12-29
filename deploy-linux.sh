#!/bin/bash
# AI Hub 部署脚本 (Linux/macOS Bash)
# 这个脚本用于在本地测试和部署AI Hub网站

echo "AI Hub 部署脚本 (Linux/macOS)"
echo "===================================="

# 检查是否安装了Python
echo "检查Python环境..."
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ 未找到Python，请先安装Python 3.7+"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

PYTHON_VERSION=$($PYTHON_CMD --version)
echo "✅ Python版本: $PYTHON_VERSION"

# 启动本地HTTP服务器
echo "启动本地HTTP服务器..."
echo "访问地址: http://localhost:8000"
echo "按 Ctrl+C 停止服务器"
echo "===================================="

# 启动HTTP服务器
$PYTHON_CMD -m http.server 8000 --bind 127.0.0.1
