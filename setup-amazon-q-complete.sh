#!/bin/bash

echo "🚀 Amazon Q Business 完整配置脚本"
echo "=================================="

# 检查AWS CLI是否已安装
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI 未安装，请先安装 AWS CLI"
    exit 1
fi

# 检查AWS凭证
echo "📋 检查AWS配置..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS凭证未配置，请先运行: aws configure"
    echo "需要提供："
    echo "- AWS Access Key ID"
    echo "- AWS Secret Access Key"
    echo "- Default region: us-east-1"
    echo "- Default output format: json"
    exit 1
fi

echo "✅ AWS凭证配置正常"

# 设置变量
REGION="us-east-1"
APP_NAME="logistics-hub-q-app"
DISPLAY_NAME="Logistics Hub Q Assistant"

echo "🔧 创建Amazon Q Business应用..."

# 创建Amazon Q应用
APP_RESPONSE=$(aws qbusiness create-application \
    --display-name "$DISPLAY_NAME" \
    --description "AI assistant for FMS logistics operations" \
    --region $REGION \
    --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    APP_ID=$(echo $APP_RESPONSE | jq -r '.applicationId')
    echo "✅ Amazon Q应用创建成功！"
    echo "应用ID: $APP_ID"
else
    echo "⚠️  应用创建失败，可能已存在。尝试列出现有应用..."
    
    # 列出现有应用
    APPS=$(aws qbusiness list-applications --region $REGION --output json 2>/dev/null)
    if [ $? -eq 0 ]; then
        APP_ID=$(echo $APPS | jq -r '.applications[0].applicationId // empty')
        if [ -n "$APP_ID" ]; then
            echo "✅ 找到现有应用ID: $APP_ID"
        else
            echo "❌ 未找到任何Amazon Q应用"
            exit 1
        fi
    else
        echo "❌ 无法访问Amazon Q服务，请检查权限"
        exit 1
    fi
fi

# 获取当前AWS账户信息
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS账户ID: $ACCOUNT_ID"

# 更新.env文件
echo "📝 更新配置文件..."

# 更新API代理的.env文件
cat > /home/ste92/tech-website/api-proxy/.env << EOF
# AWS Configuration
AWS_REGION=$REGION
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)

# Amazon Q Business Configuration
AMAZON_Q_APP_ID=$APP_ID

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yy2025-program.github.io

# Security (Optional)
JWT_SECRET=logistics-hub-jwt-secret-$(date +%s)
EOF

echo "✅ API代理配置文件已更新"

# 更新前端配置
echo "📱 更新前端配置..."

# 备份原始index.html
cp /home/ste92/tech-website/index.html /home/ste92/tech-website/index.html.backup

# 更新前端配置
sed -i "s/applicationId: 'your-amazon-q-app-id'/applicationId: '$APP_ID'/" /home/ste92/tech-website/index.html
sed -i "s/useDemo: true/useDemo: false/" /home/ste92/tech-website/index.html

echo "✅ 前端配置已更新"

# 安装API代理依赖
echo "📦 安装API代理依赖..."
cd /home/ste92/tech-website/api-proxy
npm install

echo ""
echo "🎉 配置完成！"
echo "===================="
echo "Amazon Q应用ID: $APP_ID"
echo "AWS区域: $REGION"
echo "AWS账户: $ACCOUNT_ID"
echo ""
echo "🚀 启动服务："
echo "1. 启动API代理: cd /home/ste92/tech-website/api-proxy && npm start"
echo "2. 在浏览器中打开: https://yy2025-program.github.io/tech-website"
echo ""
echo "📝 注意事项："
echo "- API代理需要在本地运行 (localhost:3000)"
echo "- 确保防火墙允许3000端口"
echo "- 生产环境需要部署API代理到云服务器"
