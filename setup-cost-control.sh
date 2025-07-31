#!/bin/bash

echo "💰 AWS费用控制设置"
echo "=================="

echo "📊 检查当前月费用..."
aws ce get-cost-and-usage \
    --time-period Start=2025-01-01,End=2025-02-01 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
    --output text 2>/dev/null || echo "无法获取费用信息"

echo ""
echo "🔍 检查免费套餐使用情况..."
aws support describe-trusted-advisor-checks \
    --language en \
    --query 'checks[?contains(name, `Free Tier`)]' 2>/dev/null || echo "无法获取免费套餐信息"

echo ""
echo "📋 建议的费用控制措施："
echo "1. 访问 AWS Billing Console: https://console.aws.amazon.com/billing/"
echo "2. 设置预算警报 (建议: $5/月)"
echo "3. 启用免费套餐使用警报"
echo "4. 定期检查 Cost Explorer"
echo ""
echo "⚠️  重要提醒："
echo "- Amazon Q Business 不在免费套餐范围内"
echo "- 已创建的IAM Identity Center实例可能产生少量费用"
echo "- 建议删除不必要的资源"
echo ""
echo "🔧 清理建议："
echo "1. 删除未使用的EC2实例"
echo "2. 清理S3存储桶"
echo "3. 删除未使用的EBS卷"
echo "4. 释放未使用的Elastic IP"
