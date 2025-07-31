# Amazon Q Business 真实API设置指南

## 🎯 在AWS控制台创建Amazon Q Business应用

### 1. 访问Amazon Q Business控制台
- 登录AWS控制台: https://console.aws.amazon.com
- 搜索 "Amazon Q Business" (不是Amazon Q)
- 选择区域: us-east-1

### 2. 创建应用程序
1. 点击 "Create application"
2. 填写应用信息：
   - **Application name**: `logistics-hub-assistant`
   - **Description**: `AI assistant for FMS logistics operations`
   - **Access management method**: 选择 "AWS IAM Identity Center" 或 "Service-linked role"

### 3. 配置检索器 (Retriever)
1. 选择 "Amazon Kendra" 或 "Native retriever"
2. 如果选择Native retriever：
   - 创建索引
   - 配置数据源（可选）

### 4. 配置Web体验
1. 在应用详情页，点击 "Web experience"
2. 点击 "Create web experience"
3. 配置：
   - **Title**: `Logistics Hub Assistant`
   - **Subtitle**: `Your FMS AI Assistant`
   - **Welcome message**: `Hello! I'm here to help with FMS logistics operations.`

### 5. 获取应用ID和端点
- 在应用详情页面记录：
  - **Application ID** (例如: a1b2c3d4-e5f6-7890-abcd-ef1234567890)
  - **Web experience URL** (如果使用托管界面)

## 🔐 权限配置

### 创建自定义IAM策略
使用项目中的 `amazon-q-business-policy.json` 文件创建策略：

1. IAM → 策略 → 创建策略
2. 粘贴JSON内容
3. 策略名称: `LogisticsHubQBusinessAccess`
4. 附加到用户: `amazon-q-user`

## 🔧 API端点配置

Amazon Q Business提供两种API方式：

### 方式1: 直接API调用
- 端点: `https://qbusiness.us-east-1.amazonaws.com/`
- 需要AWS签名v4认证

### 方式2: 使用我们的代理服务器
- 本地端点: `http://localhost:3000/api/amazon-q/chat`
- 代理服务器处理AWS认证

## 📝 配置文件更新

更新以下文件：
1. `index.html` - 设置 `useDemo: false`
2. `api-proxy/.env` - 填入真实的Application ID
3. 启动代理服务器: `npm start`

## 🧪 测试步骤

1. 创建应用后运行: `./verify-aws-config.sh`
2. 如果成功，运行: `./setup-amazon-q-complete.sh`
3. 启动服务: `./start-amazon-q.sh`
4. 测试API: `./test-amazon-q-api.sh`
