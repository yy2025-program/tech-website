#!/bin/bash

echo "💰 设置Amazon Q Business预算控制"
echo "================================"

echo "📋 第一步：设置AWS预算警报"
echo "1. 访问: https://console.aws.amazon.com/billing/home#/budgets"
echo "2. 点击 'Create budget'"
echo "3. 选择 'Cost budget'"
echo "4. 配置如下："
echo "   - Budget name: AmazonQ-Test-Budget"
echo "   - Budget amount: \$5.00"
echo "   - Time period: Monthly"
echo "   - Budget scope: Specific services"
echo "   - Service: Amazon Q Business"
echo ""

echo "📧 第二步：设置警报"
echo "Alert 1:"
echo "   - Threshold: 80% (\$4.00)"
echo "   - Email: 你的邮箱"
echo "   - Action: Send notification"
echo ""
echo "Alert 2:"
echo "   - Threshold: 100% (\$5.00)"
echo "   - Email: 你的邮箱"
echo "   - Action: Send notification"
echo ""

echo "⚠️  第三步：设置自动停止 (可选)"
echo "创建Lambda函数在达到预算时自动删除Amazon Q应用"
echo ""

echo "🎯 完成预算设置后，继续创建Amazon Q Business应用"
echo ""

# 尝试通过CLI创建预算
echo "🔧 尝试通过CLI创建预算..."

cat > budget-policy.json << EOF
{
    "BudgetName": "AmazonQ-Test-Budget",
    "BudgetLimit": {
        "Amount": "5.00",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
        "Service": ["Amazon Q Business"]
    }
}
EOF

cat > budget-notification.json << EOF
[
    {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 80,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "your-email@example.com"
            }
        ]
    },
    {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 100,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "your-email@example.com"
            }
        ]
    }
]
EOF

echo "📁 预算配置文件已创建:"
echo "- budget-policy.json"
echo "- budget-notification.json"
echo ""
echo "请手动在AWS控制台设置预算，或修改邮箱地址后运行:"
echo "aws budgets create-budget --account-id \$(aws sts get-caller-identity --query Account --output text) --budget file://budget-policy.json --notifications-with-subscribers file://budget-notification.json"
