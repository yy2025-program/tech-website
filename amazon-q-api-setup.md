# Amazon Q API 集成设置指南

## 🔧 当前状态
- ✅ 前端聊天界面已升级
- ✅ 演示模式已启用（智能响应）
- ⚠️ 真实API集成需要后端配置

## 🚀 启用真实Amazon Q API的步骤

### 1. AWS 配置
```bash
# 安装AWS CLI
aws configure
# 输入你的AWS Access Key ID
# 输入你的AWS Secret Access Key
# 输入默认区域 (例如: us-east-1)
```

### 2. 创建Amazon Q应用
1. 登录AWS控制台
2. 搜索"Amazon Q Business"
3. 创建新应用
4. 记录应用ID

### 3. 后端API代理 (Node.js示例)
```javascript
// server.js
const express = require('express');
const { QBusinessClient, ChatCommand } = require('@aws-sdk/client-qbusiness');

const app = express();
app.use(express.json());

const qClient = new QBusinessClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

app.post('/api/amazon-q/chat', async (req, res) => {
    try {
        const { message, conversationId, applicationId } = req.body;
        
        const command = new ChatCommand({
            applicationId: applicationId,
            conversationId: conversationId,
            message: message
        });
        
        const response = await qClient.send(command);
        res.json({ message: response.message });
    } catch (error) {
        console.error('Amazon Q API Error:', error);
        res.status(500).json({ error: 'Failed to get response from Amazon Q' });
    }
});

app.listen(3000, () => {
    console.log('Amazon Q API proxy running on port 3000');
});
```

### 4. 更新前端配置
在 `index.html` 中修改配置：
```javascript
window.AMAZON_Q_CONFIG = {
    region: 'us-east-1',
    applicationId: 'your-actual-amazon-q-app-id',
    useDemo: false // 改为false启用真实API
};
```

### 5. CORS 配置
确保你的后端API支持CORS，或者将前端部署到同一域名下。

## 📋 当前功能特性

### ✅ 已实现的功能：
- 智能聊天界面
- 打字指示器
- 错误处理
- 双语支持
- FMS专业知识响应
- 流畅的用户体验

### 🔄 演示模式特性：
- 模拟真实API延迟
- FMS物流专业响应
- 上下文感知回答
- 多样化的回复内容

## 🎯 生产环境建议

1. **安全性**: 不要在前端暴露AWS凭证
2. **认证**: 使用AWS Cognito或其他身份验证
3. **缓存**: 实现响应缓存以提高性能
4. **监控**: 添加API调用监控和日志
5. **限流**: 实现请求限流防止滥用

## 🔧 故障排除

### 常见问题：
1. **CORS错误**: 配置后端CORS策略
2. **认证失败**: 检查AWS凭证和权限
3. **应用ID错误**: 确认Amazon Q应用ID正确
4. **区域不匹配**: 确保前后端使用相同的AWS区域

当前的演示模式已经提供了非常智能的响应体验！
