#!/bin/bash

echo "🚀 启动Amazon Q服务"
echo "=================="

# 检查配置
if [ ! -f "/home/ste92/tech-website/api-proxy/.env" ]; then
    echo "❌ 配置文件不存在，请先运行配置脚本:"
    echo "./setup-amazon-q-complete.sh"
    exit 1
fi

# 检查依赖
if [ ! -d "/home/ste92/tech-website/api-proxy/node_modules" ]; then
    echo "📦 安装依赖..."
    cd /home/ste92/tech-website/api-proxy
    npm install
fi

# 启动API代理
echo "🔧 启动API代理服务器..."
cd /home/ste92/tech-website/api-proxy

# 后台启动
nohup npm start > ../api-proxy.log 2>&1 &
API_PID=$!

echo "✅ API代理已启动 (PID: $API_PID)"
echo "📋 日志文件: /home/ste92/tech-website/api-proxy.log"

# 等待服务启动
sleep 3

# 检查服务状态
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 服务运行正常"
    echo ""
    echo "🌐 现在可以测试网站聊天功能:"
    echo "https://yy2025-program.github.io/tech-website"
    echo ""
    echo "🛑 停止服务: kill $API_PID"
else
    echo "❌ 服务启动失败，请检查日志:"
    echo "tail -f /home/ste92/tech-website/api-proxy.log"
fi
