#!/bin/bash

echo "🔍 验证AWS配置"
echo "=============="

# 检查AWS CLI配置
echo "📋 当前AWS配置："
aws configure list

echo ""
echo "🔐 验证AWS凭证..."

# 测试AWS凭证
if aws sts get-caller-identity > /dev/null 2>&1; then
    echo "✅ AWS凭证验证成功"
    
    # 显示账户信息
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
    
    echo "AWS账户ID: $ACCOUNT_ID"
    echo "用户ARN: $USER_ARN"
    
    # 检查Amazon Q Business服务可用性
    echo ""
    echo "🔍 检查Amazon Q Business服务..."
    
    if aws qbusiness list-applications --region us-east-1 > /dev/null 2>&1; then
        echo "✅ Amazon Q Business服务可访问"
        
        # 列出现有应用
        APPS=$(aws qbusiness list-applications --region us-east-1 --output json)
        APP_COUNT=$(echo $APPS | jq '.applications | length')
        
        if [ "$APP_COUNT" -gt 0 ]; then
            echo "📱 找到 $APP_COUNT 个现有Amazon Q应用"
            echo $APPS | jq -r '.applications[] | "- \(.displayName) (\(.applicationId))"'
        else
            echo "📱 未找到现有Amazon Q应用，将创建新应用"
        fi
        
        echo ""
        echo "🎉 配置验证完成！可以运行完整配置脚本："
        echo "./setup-amazon-q-complete.sh"
        
    else
        echo "❌ Amazon Q Business服务不可访问"
        echo "可能的原因："
        echo "1. 权限不足 - 需要qbusiness相关权限"
        echo "2. 区域不支持 - 确保使用us-east-1区域"
        echo "3. 服务未启用 - 可能需要在AWS控制台中启用服务"
    fi
    
else
    echo "❌ AWS凭证验证失败"
    echo "请检查："
    echo "1. Access Key ID是否正确"
    echo "2. Secret Access Key是否正确"
    echo "3. 网络连接是否正常"
    echo ""
    echo "重新配置请运行: aws configure"
fi
