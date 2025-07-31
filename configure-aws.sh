#!/bin/bash

echo "🔧 AWS凭证配置助手"
echo "==================="

# 检查.env文件是否存在
if [ ! -f "api-proxy/.env" ]; then
    echo "❌ .env文件不存在，正在创建..."
    cp api-proxy/.env.example api-proxy/.env
fi

echo ""
echo "📝 请输入你的AWS凭证信息："
echo ""

# 获取Access Key ID
read -p "🔑 Access Key ID: " ACCESS_KEY_ID
if [ -z "$ACCESS_KEY_ID" ]; then
    echo "❌ Access Key ID不能为空"
    exit 1
fi

# 获取Secret Access Key
read -s -p "🔐 Secret Access Key: " SECRET_ACCESS_KEY
echo ""
if [ -z "$SECRET_ACCESS_KEY" ]; then
    echo "❌ Secret Access Key不能为空"
    exit 1
fi

# 获取Amazon Q App ID（可选）
read -p "🤖 Amazon Q App ID (可选，稍后配置): " APP_ID

# 更新.env文件
cd api-proxy

# 备份原文件
cp .env .env.backup

# 更新配置
sed -i "s/your_aws_access_key_id/$ACCESS_KEY_ID/g" .env
sed -i "s/your_aws_secret_access_key/$SECRET_ACCESS_KEY/g" .env

if [ ! -z "$APP_ID" ]; then
    sed -i "s/your_amazon_q_application_id/$APP_ID/g" .env
fi

echo ""
echo "✅ 配置已更新！"
echo ""
echo "📋 当前配置："
echo "   AWS Region: us-east-1"
echo "   Access Key ID: ${ACCESS_KEY_ID:0:10}..."
echo "   Secret Key: ${SECRET_ACCESS_KEY:0:10}..."
if [ ! -z "$APP_ID" ]; then
    echo "   App ID: $APP_ID"
else
    echo "   App ID: 待配置"
fi

echo ""
echo "🚀 下一步："
echo "1. 如果还没有Amazon Q应用，请先创建"
echo "2. 运行: npm start"
echo "3. 测试: ../test-api.js"
echo ""
echo "🔒 安全提醒："
echo "- .env文件已添加到.gitignore"
echo "- 不要将凭证分享给他人"
echo "- 定期轮换访问密钥"
