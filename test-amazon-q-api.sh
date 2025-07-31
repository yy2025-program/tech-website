#!/bin/bash

echo "🧪 Amazon Q API 测试脚本"
echo "========================"

# 检查API代理是否运行
echo "📡 检查API代理状态..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ API代理运行正常"
else
    echo "❌ API代理未运行，请先启动:"
    echo "cd /home/ste92/tech-website/api-proxy && npm start"
    exit 1
fi

# 测试API端点
echo "🔍 测试Amazon Q API..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/amazon-q/chat \
    -H "Content-Type: application/json" \
    -d '{
        "message": "Hello, can you help me with FMS logistics?",
        "conversationId": "test-conversation-123"
    }')

if [ $? -eq 0 ]; then
    echo "✅ API调用成功"
    echo "响应: $RESPONSE"
else
    echo "❌ API调用失败"
fi

echo ""
echo "🌐 测试网站聊天功能:"
echo "1. 打开浏览器访问: https://yy2025-program.github.io/tech-website"
echo "2. 点击右下角的聊天按钮"
echo "3. 发送消息测试"
