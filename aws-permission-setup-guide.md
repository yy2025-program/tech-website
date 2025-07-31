# AWS Amazon Q Business 权限配置详细指南

## 🎯 目标
为用户 `amazon-q-user` 添加Amazon Q Business权限

## 📋 详细步骤

### 步骤1: 登录AWS控制台
1. 访问: https://console.aws.amazon.com
2. 使用你的AWS账户登录
3. 确保区域选择为 `us-east-1` (N. Virginia)

### 步骤2: 进入IAM服务
1. 在AWS控制台顶部搜索框输入 "IAM"
2. 点击 "IAM" 服务

### 步骤3: 创建自定义策略
1. 在IAM控制台左侧菜单点击 "策略"
2. 点击蓝色的 "创建策略" 按钮
3. 选择 "JSON" 标签页
4. 删除文本框中的默认内容
5. 复制粘贴以下JSON内容:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "qbusiness:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

6. 点击 "下一步: 标签" (可跳过标签)
7. 点击 "下一步: 审核"
8. 填写策略信息:
   - 名称: `LogisticsHubAmazonQBusinessAccess`
   - 描述: `Amazon Q Business access for Logistics Hub`
9. 点击 "创建策略"

### 步骤4: 附加策略到用户
1. 在IAM控制台左侧菜单点击 "用户"
2. 在用户列表中找到并点击 `amazon-q-user`
3. 点击 "权限" 标签页
4. 点击 "添加权限" 按钮
5. 选择 "直接附加策略"
6. 在搜索框输入: `LogisticsHubAmazonQBusinessAccess`
7. 勾选你刚创建的策略
8. 点击 "下一步: 审核"
9. 点击 "添加权限"

### 步骤5: 验证权限
权限添加完成后，等待1-2分钟让权限生效。

## 🚨 常见问题

### 问题1: 找不到用户 `amazon-q-user`
**解决方案**: 用户可能使用了不同的名称，查找包含你AWS访问密钥的用户

### 问题2: 策略创建失败
**解决方案**: 确保你有IAM管理权限，或联系AWS账户管理员

### 问题3: 权限不生效
**解决方案**: 等待2-3分钟，AWS权限更新需要时间

## ✅ 验证步骤
完成后，你可以运行以下命令验证:
```bash
aws qbusiness list-applications --region us-east-1
```

如果返回应用列表（即使为空）而不是权限错误，说明配置成功！

## 📞 需要帮助?
如果遇到问题，请提供:
1. 错误信息截图
2. 当前步骤位置
3. AWS控制台显示的具体错误
