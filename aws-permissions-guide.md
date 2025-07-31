# AWS权限配置指南

## 🔐 当前状态
- ✅ AWS凭证配置成功
- ✅ 用户: amazon-q-user
- ✅ 账户ID: 027929308619
- ❌ 缺少Amazon Q Business权限

## 🛠️ 解决方案

### 方法1: 通过AWS控制台添加权限（推荐）

1. **登录AWS控制台**
   - 访问: https://console.aws.amazon.com
   - 使用管理员账户登录

2. **进入IAM服务**
   - 搜索并点击"IAM"

3. **找到用户**
   - 点击"用户"
   - 找到用户: `amazon-q-user`

4. **添加权限**
   - 点击用户名进入详情页
   - 点击"权限"标签
   - 点击"添加权限"

5. **选择权限策略**
   选择以下策略之一：
   
   **选项A: 使用AWS管理策略（简单）**
   - 搜索并选择: `AmazonQBusinessFullAccess`
   - 如果没有，选择: `PowerUserAccess`

   **选项B: 创建自定义策略（精确）**
   - 点击"创建策略"
   - 选择"JSON"标签
   - 粘贴以下内容：

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

6. **保存并应用**
   - 策略名称: `LogisticsHubQBusinessAccess`
   - 点击"创建策略"
   - 返回用户页面，选择新创建的策略
   - 点击"添加权限"

### 方法2: 使用管理员凭证（临时）

如果你有管理员访问权限，可以运行：

```bash
# 使用管理员凭证配置
aws configure --profile admin
# 然后运行权限配置脚本
./setup-permissions.sh
```

## 🧪 验证权限

权限配置完成后，运行验证脚本：

```bash
./verify-aws-config.sh
```

应该看到：
```
✅ Amazon Q Business服务可访问
```

## 🚀 下一步

权限配置完成后，运行完整配置：

```bash
./setup-amazon-q-complete.sh
```

## 📞 需要帮助？

如果遇到问题，请提供：
1. 错误信息截图
2. 当前用户权限列表
3. AWS控制台访问级别
