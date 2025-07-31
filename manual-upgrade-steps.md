# 手动升级到Amazon Q Business真实API

## 🔧 手动配置步骤

### 1. 获取Amazon Q Business应用ID
在AWS控制台创建应用后，记录应用ID (格式: a1b2c3d4-e5f6-7890-abcd-ef1234567890)

### 2. 更新前端配置
编辑 `index.html` 文件，找到这两行：
```javascript
applicationId: 'your-amazon-q-app-id', // 替换为真实应用ID
useDemo: true // 改为 false
```

### 3. 更新API代理配置
编辑 `api-proxy/.env` 文件：
```bash
AMAZON_Q_APP_ID=你的真实应用ID
```

### 4. 启动API代理
```bash
cd api-proxy
npm install
npm start
```

### 5. 测试API
```bash
curl -X POST http://localhost:3000/api/amazon-q/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "conversationId": "test-123"}'
```

### 6. 部署更新
```bash
git add .
git commit -m "升级到Amazon Q Business真实API"
git push origin main
```

## 🚨 常见问题

### 问题1: 权限不足
- 确保IAM策略包含所有 `qbusiness:*` 权限
- 检查策略是否正确附加到用户

### 问题2: API代理连接失败
- 检查AWS凭证是否正确
- 确认应用ID格式正确
- 查看 `api-proxy.log` 日志文件

### 问题3: CORS错误
- 确保 `ALLOWED_ORIGINS` 包含你的网站域名
- 检查API代理是否在正确端口运行
