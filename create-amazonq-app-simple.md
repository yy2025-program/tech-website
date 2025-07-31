# Amazon Q Business 应用创建 - 简化步骤

## 🚀 立即创建步骤

### 1. 访问Amazon Q Business控制台
https://console.aws.amazon.com/amazonq/business

### 2. 点击 "Create application"

### 3. 填写基本信息
- **Application name**: `Logistics Hub Test`
- **Description**: `Test application for logistics chat - $5 budget limit`

### 4. 访问管理配置
- **Access management method**: `AWS IAM Identity Center` ✅
- **AWS Region**: `亚太地区 (悉尼) | ap-southeast-2` ✅
- **IAM Identity Center**: 使用现有实例 `8259c9f924ce1281` ✅

### 5. 用户访问设置
- **User access**: `Enable for all users in the organization` ✅

### 6. 订阅设置
- **Default subscription tier**: `Q Business Lite` ✅ (最便宜选项)

### 7. 应用服务访问
- **Application service access**: `Create and use a new service-linked role` ✅

### 8. 加密设置
- **Encryption**: `Amazon Q Business owned key` ✅ (默认免费)

### 9. Web体验设置
- **Web experience service access**: 选择可用的服务角色

### 10. 点击 "Create"

## ⏱️ 创建时间
通常需要3-5分钟完成创建

## 📋 创建完成后
1. 记录应用ID
2. 创建Web Experience
3. 获取聊天URL
4. 集成到网站

## 💰 费用提醒
- Q Business Lite: ~$3/用户/月
- 预算限制: $5/月
- 建议测试期: 1个月

## 🚨 重要提醒
创建应用后立即开始计费，请确保：
1. ✅ 已设置预算警报
2. ✅ 定期检查费用
3. ✅ 测试完成后及时删除应用
