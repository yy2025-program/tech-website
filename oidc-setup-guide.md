# OIDC Identity Provider 配置指南

## 🔧 在IAM控制台创建OIDC Provider

### 步骤1: 访问IAM控制台
1. 打开新标签页: https://console.aws.amazon.com/iam/
2. 左侧菜单 → "Identity providers"
3. 点击 "Create provider"

### 步骤2: 配置OIDC Provider
1. **Provider type**: 选择 "OpenID Connect"
2. **Provider URL**: `https://logistics-hub-test.auth0.com`
3. **Audience**: `logistics-hub-client`
4. **Thumbprint**: 点击 "Get thumbprint" (自动获取)

### 步骤3: 创建Provider
1. 点击 "Create provider"
2. 记录Provider ARN (类似: arn:aws:iam::123456789012:oidc-provider/logistics-hub-test.auth0.com)

## 📋 配置参数说明

- **Provider URL**: OIDC提供商的URL (我们使用测试URL)
- **Audience**: 客户端ID (应用标识符)
- **Thumbprint**: SSL证书指纹 (AWS自动获取)

## 🎯 完成后
创建成功后，返回Amazon Q Business配置页面继续配置
