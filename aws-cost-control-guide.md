# AWS费用控制和免费套餐使用指南

## 🚨 重要提醒
AWS免费套餐无法"切换回去"，但可以通过以下方式控制费用：

## 💰 设置费用监控和警报

### 1. 设置账单警报
1. 访问: https://console.aws.amazon.com/billing/
2. 左侧菜单 → "Billing preferences"
3. 勾选 "Receive Free Tier Usage Alerts"
4. 勾选 "Receive Billing Alerts"
5. 输入邮箱地址
6. 保存设置

### 2. 创建预算警报
1. 访问: https://console.aws.amazon.com/billing/home#/budgets
2. 点击 "Create budget"
3. 选择 "Cost budget"
4. 设置预算金额: $1 (或你的预期金额)
5. 设置警报阈值: 80%, 100%
6. 添加邮箱通知

### 3. 启用Cost Explorer
1. 访问: https://console.aws.amazon.com/cost-management/home
2. 启用 Cost Explorer
3. 定期检查费用分析

## 🆓 免费套餐服务使用策略

### 永久免费服务 (Always Free)
- **Lambda**: 每月100万次请求
- **DynamoDB**: 25GB存储 + 25个读写容量单位
- **CloudWatch**: 10个自定义指标
- **SNS**: 每月100万次发布
- **SQS**: 每月100万次请求

### 12个月免费服务 (12 Months Free)
- **EC2**: 750小时/月 t2.micro实例
- **S3**: 5GB标准存储
- **RDS**: 750小时/月 db.t2.micro
- **CloudFront**: 50GB数据传输

### 试用服务 (Trials)
- 各种服务的短期免费试用

## 🛡️ 避免意外费用的最佳实践

### 1. 定期清理资源
- 删除未使用的EC2实例
- 清理S3存储桶
- 删除未使用的EBS卷
- 释放未使用的Elastic IP

### 2. 使用免费套餐监控
- 定期检查免费套餐使用情况
- 设置使用量警报

### 3. 谨慎使用付费服务
- Amazon Q Business (付费)
- Amazon Bedrock (付费)
- Amazon SageMaker (部分付费)
- Amazon Textract (付费)

## 🔧 当前账户建议操作

### 立即执行:
1. 设置$5预算警报
2. 启用免费套餐使用警报
3. 删除任何不必要的资源
4. 检查当前月费用

### 定期执行:
1. 每周检查费用报告
2. 每月清理未使用资源
3. 监控免费套餐使用量
