# Amazon Q 真实API集成指南

## 🎯 当前状态
- ❌ 演示模式：使用预设响应
- ✅ 目标：连接真实Amazon Q API

## 🔧 集成步骤

### Step 1: 创建Amazon Q应用
1. **登录AWS控制台**
   ```
   https://console.aws.amazon.com/
   ```

2. **创建Amazon Q Business应用**
   ```
   服务搜索: Amazon Q Business
   → Create application
   → 记录 Application ID
   ```

3. **配置权限**
   ```
   IAM → Create Role
   → 添加 QBusiness 权限
   → 记录 Role ARN
   ```

### Step 2: 后端API代理（Node.js）
```javascript
// server.js
const express = require('express');
const { QBusinessClient, ChatCommand } = require('@aws-sdk/client-qbusiness');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const qClient = new QBusinessClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

app.post('/api/amazon-q/chat', async (req, res) => {
    try {
        const { message, conversationId } = req.body;
        
        const command = new ChatCommand({
            applicationId: process.env.AMAZON_Q_APP_ID,
            conversationId: conversationId,
            message: message,
            userId: 'logistics-hub-user'
        });
        
        const response = await qClient.send(command);
        
        res.json({
            message: response.systemMessage || response.userMessage,
            conversationId: response.conversationId
        });
    } catch (error) {
        console.error('Amazon Q API Error:', error);
        res.status(500).json({ 
            error: 'Failed to get response from Amazon Q',
            details: error.message 
        });
    }
});

app.listen(3000, () => {
    console.log('Amazon Q API proxy running on port 3000');
});
```

### Step 3: 环境变量配置
```bash
# .env 文件
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AMAZON_Q_APP_ID=your_app_id
```

### Step 4: 前端配置更新
```javascript
// 更新 index.html 中的配置
window.AMAZON_Q_CONFIG = {
    region: 'us-east-1',
    applicationId: 'your-real-app-id',
    apiEndpoint: 'http://localhost:3000/api/amazon-q/chat',
    useDemo: false // 关闭演示模式
};
```

### Step 5: 部署选项

#### 选项A: AWS Lambda + API Gateway
```yaml
# serverless.yml
service: amazon-q-proxy

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  
functions:
  chat:
    handler: handler.chat
    events:
      - http:
          path: /chat
          method: post
          cors: true
```

#### 选项B: 使用 Vercel/Netlify Functions
```javascript
// api/amazon-q-chat.js (Vercel)
export default async function handler(req, res) {
    // Amazon Q API 调用逻辑
}
```

## 🔒 安全考虑

### 1. 认证机制
- 使用 AWS Cognito 用户池
- 实现 JWT token 验证
- 添加 API 限流

### 2. 权限控制
- 最小权限原则
- 用户级别访问控制
- 审计日志记录

## 📊 成本估算

### Amazon Q Business 定价
- **按对话收费**: ~$20/用户/月
- **API调用**: 按请求数量计费
- **存储**: 知识库存储费用

### 建议
- 从小规模开始测试
- 监控使用量和成本
- 设置预算警报

## 🚀 快速测试方法

### 1. 本地测试
```bash
npm install express @aws-sdk/client-qbusiness cors
node server.js
```

### 2. 前端测试
```javascript
// 在浏览器控制台测试
fetch('/api/amazon-q/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message: 'Hello Amazon Q',
        conversationId: 'test-conv-123'
    })
});
```

## ⚠️ 常见问题

1. **CORS错误**: 配置后端CORS策略
2. **认证失败**: 检查AWS凭证和权限
3. **应用ID错误**: 确认Amazon Q应用配置
4. **超时问题**: 增加API超时设置

## 📞 需要帮助？

如果遇到问题，可以：
1. 检查AWS CloudWatch日志
2. 验证IAM权限配置
3. 测试API端点连通性
4. 联系AWS支持团队
