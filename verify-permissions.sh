#!/bin/bash

echo "🔍 验证Amazon Q Business权限"
echo "=========================="

echo "📋 当前AWS用户信息:"
aws sts get-caller-identity

echo ""
echo "🧪 测试Amazon Q Business访问权限..."

RESULT=$(aws qbusiness list-applications --region us-east-1 2>&1)

if echo "$RESULT" | grep -q "AccessDeniedException"; then
    echo "❌ 权限验证失败"
    echo "错误信息: $RESULT"
    echo ""
    echo "📋 请检查:"
    echo "1. 是否已在AWS控制台创建并附加策略?"
    echo "2. 是否等待了1-2分钟让权限生效?"
    echo "3. 策略JSON是否正确复制?"
elif echo "$RESULT" | grep -q "applications"; then
    echo "✅ 权限验证成功!"
    echo "Amazon Q Business服务可正常访问"
    echo ""
    echo "📱 现有应用列表:"
    echo "$RESULT" | jq -r '.applications[] | "- \(.displayName) (\(.applicationId))"' 2>/dev/null || echo "暂无应用"
    echo ""
    echo "🚀 下一步: 在AWS控制台创建Amazon Q Business应用"
    echo "访问: https://console.aws.amazon.com/amazonq/business"
else
    echo "⚠️  未知响应: $RESULT"
fi
