#!/bin/bash

echo "🧪 简化Amazon Q Business测试"
echo "=========================="

# 测试基本AWS访问
echo "1. 测试AWS基本访问..."
if aws sts get-caller-identity > /dev/null 2>&1; then
    echo "✅ AWS访问正常"
else
    echo "❌ AWS访问失败"
    exit 1
fi

# 测试Amazon Q Business - 列出应用
echo "2. 测试Amazon Q Business访问..."
RESULT=$(aws qbusiness list-applications --region us-east-1 2>&1)

if echo "$RESULT" | grep -q "AccessDeniedException"; then
    echo "❌ 权限不足 - 需要添加Amazon Q Business权限"
    echo "错误详情: $RESULT"
    echo ""
    echo "📋 解决方案："
    echo "1. 在AWS控制台创建自定义策略（推荐）"
    echo "2. 或者先尝试附加 AmazonQDeveloperAccess 策略"
    echo "3. 策略JSON文件已保存到: amazon-q-business-policy.json"
    
elif echo "$RESULT" | grep -q "applications"; then
    echo "✅ Amazon Q Business访问成功！"
    echo "现有应用: $RESULT"
    echo ""
    echo "🚀 可以继续运行完整配置："
    echo "./setup-amazon-q-complete.sh"
    
else
    echo "⚠️  未知响应: $RESULT"
fi

echo ""
echo "📝 下一步操作："
echo "1. 在AWS控制台添加权限后，重新运行此脚本"
echo "2. 或者尝试附加 AmazonQDeveloperAccess 看是否有效"
