#!/bin/bash

echo "🔧 创建Amazon Q Business所需的IAM角色"
echo "====================================="

# 创建Web Experience服务角色
echo "📝 创建Web Experience服务角色..."

# 信任策略
cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "qbusiness.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

# 权限策略
cat > web-experience-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "qbusiness:Chat",
                "qbusiness:ChatSync",
                "qbusiness:ListConversations",
                "qbusiness:GetConversation",
                "qbusiness:DeleteConversation"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# 创建角色
ROLE_NAME="LogisticsHubQBusinessWebExperienceRole"

echo "创建IAM角色: $ROLE_NAME"
aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document file://trust-policy.json \
    --description "Service role for Amazon Q Business Web Experience"

if [ $? -eq 0 ]; then
    echo "✅ 角色创建成功"
else
    echo "⚠️  角色可能已存在，继续..."
fi

# 创建并附加策略
POLICY_NAME="LogisticsHubQBusinessWebExperiencePolicy"

echo "创建IAM策略: $POLICY_NAME"
POLICY_ARN=$(aws iam create-policy \
    --policy-name $POLICY_NAME \
    --policy-document file://web-experience-policy.json \
    --description "Policy for Amazon Q Business Web Experience" \
    --query 'Policy.Arn' \
    --output text 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ 策略创建成功: $POLICY_ARN"
else
    echo "⚠️  策略可能已存在，获取现有策略ARN..."
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"
fi

# 附加策略到角色
echo "附加策略到角色..."
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn $POLICY_ARN

if [ $? -eq 0 ]; then
    echo "✅ 策略附加成功"
else
    echo "❌ 策略附加失败"
fi

# 清理临时文件
rm -f trust-policy.json web-experience-policy.json

echo ""
echo "🎉 角色创建完成！"
echo "角色名称: $ROLE_NAME"
echo ""
echo "📋 现在你可以在Amazon Q Business配置中选择这个角色了"

# 等待角色生效
echo "⏳ 等待角色生效（30秒）..."
sleep 30
echo "✅ 角色应该已经生效"
