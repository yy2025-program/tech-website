# Amazon Q Business Web Experience 集成指南

## 🚀 方式1: 托管Web体验（最简单）

### 步骤1: 在AWS控制台创建应用
1. **登录AWS控制台** → 搜索 "Amazon Q Business"
2. **点击 "Create application"**
3. **填写应用信息**:
   - Application name: `Logistics Hub Assistant`
   - Description: `AI assistant for FMS logistics operations`
   - Access management: 选择 "AWS IAM Identity Center" 或 "Service-linked role"

### 步骤2: 配置Web Experience
1. **在应用详情页面**，点击 "Web experience" 标签
2. **点击 "Create web experience"**
3. **配置Web体验**:
   - Title: `Logistics Hub AI Assistant`
   - Subtitle: `Your FMS Logistics Expert`
   - Welcome message: `Hello! I'm here to help with FMS logistics operations.`
   - Theme: 选择合适的主题色

### 步骤3: 获取嵌入代码
创建完成后，Amazon Q Business会提供：
- **Web Experience URL**: 独立的聊天页面
- **嵌入代码**: 可以嵌入到你的网站中

### 步骤4: 集成到网站
有两种集成方式：

#### 方式A: iframe嵌入
```html
<iframe 
    src="https://your-app-id.amazonchatbot.com" 
    width="400" 
    height="600"
    frameborder="0">
</iframe>
```

#### 方式B: 弹窗集成
```javascript
function openAmazonQ() {
    window.open(
        'https://your-app-id.amazonchatbot.com',
        'amazonq',
        'width=400,height=600,scrollbars=yes,resizable=yes'
    );
}
```

## 🔧 方式2: API集成（更灵活）

### 使用Amazon Q Business API
```javascript
// 使用AWS SDK调用Amazon Q Business API
const response = await qbusiness.chatSync({
    applicationId: 'your-app-id',
    userMessage: message,
    conversationId: conversationId
});
```

## 📋 优缺点对比

### Web Experience方式
✅ **优点**:
- 无需编程，即开即用
- AWS托管，无需维护
- 自动更新和安全补丁
- 内置用户认证

❌ **缺点**:
- 样式定制有限
- 无法深度集成到现有UI
- 依赖AWS托管服务

### API集成方式  
✅ **优点**:
- 完全自定义UI
- 深度集成到现有系统
- 更好的用户体验一致性

❌ **缺点**:
- 需要更多开发工作
- 需要处理认证和安全
- 需要维护API代理服务器

## 🎯 推荐方案

对于你的Logistics Hub网站，我推荐：

1. **快速验证**: 先用Web Experience方式快速上线
2. **长期方案**: 逐步迁移到API集成方式获得更好体验
