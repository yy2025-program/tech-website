#!/bin/bash

echo "🔐 配置Amazon Q Business权限"
echo "============================"

USER_NAME="amazon-q-user"
POLICY_NAME="LogisticsHubQBusinessAccess"

echo "👤 目标用户: $USER_NAME"

# 检查是否有IAM权限
echo "🔍 检查IAM权限..."
if aws iam get-user --user-name $USER_NAME > /dev/null 2>&1; then
    echo "✅ 找到用户: $USER_NAME"
else
    echo "❌ 无法访问用户信息，可能需要管理员权限"
    exit 1
fi

# 创建自定义策略
echo "📝 创建Amazon Q Business策略..."

POLICY_DOC='{
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
}'

# 创建策略
POLICY_ARN=$(aws iam create-policy \
    --policy-name $POLICY_NAME \
    --policy-document "$POLICY_DOC" \
    --description "Amazon Q Business access for Logistics Hub" \
    --query 'Policy.Arn' \
    --output text 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ 策略创建成功: $POLICY_ARN"
else
    echo "⚠️  策略可能已存在，尝试获取现有策略..."
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"
fi

# 附加策略到用户
echo "🔗 附加策略到用户..."
if aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn $POLICY_ARN; then
    echo "✅ 策略附加成功"
else
    echo "❌ 策略附加失败"
    exit 1
fi

# 等待权限生效
echo "⏳ 等待权限生效..."
sleep 5

# 验证权限
echo "🧪 验证Amazon Q Business访问..."
if aws qbusiness list-applications --region us-east-1 > /dev/null 2>&1; then
    echo "✅ Amazon Q Business权限配置成功！"
    echo ""
    echo "🚀 现在可以运行完整配置："
    echo "./setup-amazon-q-complete.sh"
else
    echo "❌ 权限验证失败，可能需要等待更长时间或检查策略"
fi
