#!/bin/bash

echo "🧪 测试Amazon Q Developer聊天功能"
echo "================================"

# 测试Amazon Q Developer的聊天API
echo "1. 测试Amazon Q Developer访问..."

# 尝试使用Amazon Q Developer的API
# 注意：Amazon Q Developer主要通过IDE集成，可能没有直接的聊天API

# 测试CodeWhisperer (Amazon Q Developer的一部分)
echo "2. 测试CodeWhisperer服务..."
RESULT=$(aws codewhisperer list-profiles 2>&1)

if echo "$RESULT" | grep -q "AccessDenied"; then
    echo "❌ CodeWhisperer访问被拒绝"
elif echo "$RESULT" | grep -q "profiles"; then
    echo "✅ CodeWhisperer访问成功"
else
    echo "⚠️  CodeWhisperer响应: $RESULT"
fi

# 测试Amazon Q Chat (如果存在)
echo "3. 测试Amazon Q Chat服务..."
CHAT_RESULT=$(aws q chat --message "Hello" 2>&1)

if echo "$CHAT_RESULT" | grep -q "Unknown operation"; then
    echo "❌ Amazon Q Chat API不存在"
elif echo "$CHAT_RESULT" | grep -q "AccessDenied"; then
    echo "❌ Amazon Q Chat访问被拒绝"
else
    echo "✅ Amazon Q Chat响应: $CHAT_RESULT"
fi

echo ""
echo "📋 结论："
echo "Amazon Q Developer主要用于代码开发辅助，不是通用聊天服务"
echo "我们需要Amazon Q Business来实现网站聊天功能"
