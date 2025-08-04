#!/bin/bash

echo "🎯 一键AWS部署脚本"
echo "=================="
echo ""

# 检查AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ 请先安装AWS CLI："
    echo "   Windows: https://awscli.amazonaws.com/AWSCLIV2.msi"
    echo "   Mac: brew install awscli"
    echo "   Linux: sudo apt install awscli"
    echo ""
    echo "安装后运行: aws configure"
    exit 1
fi

# 检查AWS凭证
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ 请先配置AWS凭证："
    echo "   运行: aws configure"
    echo "   输入你的AWS Access Key ID"
    echo "   输入你的AWS Secret Access Key"
    echo "   区域: us-east-1"
    echo "   格式: json"
    exit 1
fi

echo "✅ AWS配置检查通过"
echo ""

# 简单配置
BUCKET_NAME="fms-logistics-$(date +%Y%m%d%H%M)"
REGION="us-east-1"

echo "🚀 开始部署到AWS..."
echo "   存储桶: $BUCKET_NAME"
echo "   区域: $REGION"
echo ""

# 创建S3存储桶
echo "📦 创建存储桶..."
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 配置网站托管
echo "🌐 配置网站托管..."
aws s3 website s3://$BUCKET_NAME --index-document index.html

# 设置公共访问
echo "🔓 设置公共访问..."
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
    "Version": "2012-10-17",
    "Statement": [{
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
    }]
}'

# 上传文件
echo "📤 上传网站文件..."
aws s3 sync . s3://$BUCKET_NAME --exclude "*.sh" --exclude ".git/*"

# 完成
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "🎉 部署完成！"
echo "=============="
echo ""
echo "🌐 你的AWS网站: $WEBSITE_URL"
echo "💰 费用: $0 (免费)"
echo "⏱️  生效时间: 立即"
echo ""
echo "🔗 原GitHub网站仍然正常运行："
echo "   https://yy2025-program.github.io/tech-website/"
echo ""
echo "✅ 现在你有两个网站可以对比测试！"
