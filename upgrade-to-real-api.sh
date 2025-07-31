#!/bin/bash

echo "🚀 升级到Amazon Q Business真实API"
echo "=================================="

# 检查当前状态
echo "📋 检查当前配置..."
echo "用户: $(aws sts get-caller-identity --query Arn --output text)"
echo "区域: $(aws configure get region)"

# 步骤1: 权限检查
echo ""
echo "🔐 步骤1: 检查Amazon Q Business权限..."
if aws qbusiness list-applications --region us-east-1 > /dev/null 2>&1; then
    echo "✅ Amazon Q Business权限正常"
else
    echo "❌ 缺少Amazon Q Business权限"
    echo ""
    echo "📋 需要在AWS控制台完成以下操作："
    echo "1. 进入IAM → 策略 → 创建策略"
    echo "2. 使用JSON内容: amazon-q-business-policy.json"
    echo "3. 策略名称: LogisticsHubQBusinessAccess"
    echo "4. 附加到用户: amazon-q-user"
    echo ""
    echo "⏸️  权限配置完成后，重新运行此脚本"
    exit 1
fi

# 步骤2: 检查现有应用
echo ""
echo "📱 步骤2: 检查现有Amazon Q Business应用..."
APPS=$(aws qbusiness list-applications --region us-east-1 --output json)
APP_COUNT=$(echo $APPS | jq '.applications | length')

if [ "$APP_COUNT" -gt 0 ]; then
    echo "✅ 找到 $APP_COUNT 个现有应用:"
    echo $APPS | jq -r '.applications[] | "- \(.displayName) (\(.applicationId))"'
    
    # 使用第一个应用
    APP_ID=$(echo $APPS | jq -r '.applications[0].applicationId')
    echo "🎯 使用应用ID: $APP_ID"
else
    echo "📝 未找到现有应用，创建新应用..."
    
    # 创建新应用
    CREATE_RESULT=$(aws qbusiness create-application \
        --display-name "Logistics Hub Assistant" \
        --description "AI assistant for FMS logistics operations" \
        --region us-east-1 \
        --output json)
    
    if [ $? -eq 0 ]; then
        APP_ID=$(echo $CREATE_RESULT | jq -r '.applicationId')
        echo "✅ 应用创建成功: $APP_ID"
    else
        echo "❌ 应用创建失败: $CREATE_RESULT"
        exit 1
    fi
fi

# 步骤3: 更新配置文件
echo ""
echo "📝 步骤3: 更新配置文件..."

# 更新前端配置
echo "更新前端配置..."
sed -i "s/applicationId: 'your-amazon-q-app-id'/applicationId: '$APP_ID'/" index.html
sed -i "s/useDemo: true/useDemo: false/" index.html

# 更新API代理配置
echo "更新API代理配置..."
if [ -f "api-proxy/.env" ]; then
    sed -i "s/AMAZON_Q_APP_ID=.*/AMAZON_Q_APP_ID=$APP_ID/" api-proxy/.env
else
    echo "⚠️  API代理配置文件不存在，创建新文件..."
    cat > api-proxy/.env << EOF
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)

# Amazon Q Business Configuration
AMAZON_Q_APP_ID=$APP_ID

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yy2025-program.github.io

# Security
JWT_SECRET=logistics-hub-jwt-$(date +%s)
EOF
fi

echo "✅ 配置文件更新完成"

# 步骤4: 安装依赖并启动服务
echo ""
echo "📦 步骤4: 准备API代理服务..."
cd api-proxy

if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

echo "✅ 依赖安装完成"

# 步骤5: 测试配置
echo ""
echo "🧪 步骤5: 测试配置..."
cd ..

# 启动API代理（后台）
echo "启动API代理服务器..."
cd api-proxy
nohup npm start > ../api-proxy.log 2>&1 &
API_PID=$!
cd ..

echo "API代理已启动 (PID: $API_PID)"
sleep 3

# 测试API
echo "测试Amazon Q Business API..."
TEST_RESULT=$(curl -s -X POST http://localhost:3000/api/amazon-q/chat \
    -H "Content-Type: application/json" \
    -d '{
        "message": "Hello, test message",
        "conversationId": "test-upgrade-123"
    }' 2>&1)

if echo "$TEST_RESULT" | grep -q "error"; then
    echo "❌ API测试失败: $TEST_RESULT"
    echo "📋 检查日志: tail -f api-proxy.log"
else
    echo "✅ API测试成功!"
fi

# 步骤6: 部署更新
echo ""
echo "🚀 步骤6: 部署更新到GitHub Pages..."
git add .
git commit -m "🔧 升级到Amazon Q Business真实API - App ID: $APP_ID"
git push origin main

echo ""
echo "🎉 升级完成!"
echo "===================="
echo "Amazon Q Business应用ID: $APP_ID"
echo "API代理PID: $API_PID"
echo "网站地址: https://yy2025-program.github.io/tech-website"
echo ""
echo "📝 注意事项:"
echo "- API代理在本地运行 (localhost:3000)"
echo "- 生产环境需要将API代理部署到云服务器"
echo "- 停止API代理: kill $API_PID"
echo ""
echo "🧪 测试聊天功能:"
echo "1. 访问网站"
echo "2. 点击右下角聊天按钮"
echo "3. 发送消息测试真实API"
