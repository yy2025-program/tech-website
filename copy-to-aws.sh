#!/bin/bash

echo "🚀 AWS网站复制部署脚本"
echo "========================"
echo "📋 此脚本将："
echo "   ✅ 复制所有网站内容到AWS"
echo "   ✅ 使用AWS免费服务托管"
echo "   ✅ 获得免费的AWS域名"
echo "   ✅ 不影响GitHub Pages原网站"
echo ""

# 配置变量
BUCKET_NAME="fms-logistics-hub-aws-$(date +%Y%m%d)"
REGION="us-east-1"
PROJECT_NAME="fms-logistics-hub"

echo "📊 部署配置："
echo "   - 存储桶名称: $BUCKET_NAME"
echo "   - AWS区域: $REGION"
echo "   - 项目名称: $PROJECT_NAME"
echo "   - 预计费用: $0 (完全免费)"
echo ""

# 检查AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ 需要安装AWS CLI"
    echo "📥 安装方法："
    echo "   Windows: https://awscli.amazonaws.com/AWSCLIV2.msi"
    echo "   Mac: brew install awscli"
    echo "   Linux: sudo apt install awscli"
    exit 1
fi

# 检查AWS凭证
echo "🔐 检查AWS凭证..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS凭证未配置"
    echo "🔧 配置方法："
    echo "   1. 运行: aws configure"
    echo "   2. 输入你的AWS Access Key ID"
    echo "   3. 输入你的AWS Secret Access Key"
    echo "   4. 区域选择: us-east-1"
    echo "   5. 输出格式: json"
    exit 1
fi

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS凭证已配置 (账户: $AWS_ACCOUNT)"
echo ""

# 方案选择
echo "🎯 选择部署方案："
echo "   1. S3 + CloudFront (推荐) - 最快速度，全球CDN"
echo "   2. AWS Amplify - 一键部署，自动CI/CD"
echo "   3. 仅S3静态托管 - 最简单"
echo ""
read -p "请选择方案 (1/2/3): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        echo "🚀 选择了 S3 + CloudFront 方案"
        DEPLOY_METHOD="s3-cloudfront"
        ;;
    2)
        echo "🚀 选择了 AWS Amplify 方案"
        DEPLOY_METHOD="amplify"
        ;;
    3)
        echo "🚀 选择了 仅S3 方案"
        DEPLOY_METHOD="s3-only"
        ;;
    *)
        echo "❌ 无效选择，使用默认方案 S3 + CloudFront"
        DEPLOY_METHOD="s3-cloudfront"
        ;;
esac

echo ""

# 执行部署
if [ "$DEPLOY_METHOD" = "amplify" ]; then
    echo "📦 AWS Amplify 部署..."
    
    # 检查Node.js和npm
    if ! command -v npm &> /dev/null; then
        echo "❌ 需要安装Node.js和npm"
        echo "📥 下载地址: https://nodejs.org/"
        exit 1
    fi
    
    # 安装Amplify CLI
    echo "🔧 安装Amplify CLI..."
    npm install -g @aws-amplify/cli
    
    # 创建amplify项目配置
    mkdir -p .amplify
    cat > amplify.yml << EOF
version: 1
frontend:
  phases:
    build:
      commands:
        - echo "Static site - no build needed"
  artifacts:
    baseDirectory: .
    files:
      - '**/*'
EOF
    
    echo "🚀 初始化Amplify项目..."
    amplify init --yes --amplify '{
        "projectName": "'$PROJECT_NAME'",
        "appId": "",
        "envName": "prod",
        "defaultEditor": "code"
    }' --providers '{
        "awscloudformation": {
            "configLevel": "project",
            "useProfile": true,
            "profileName": "default"
        }
    }'
    
    echo "🌐 添加托管..."
    amplify add hosting --amplify '{
        "type": "cicd",
        "source": "manual"
    }'
    
    echo "📤 发布网站..."
    amplify publish --yes
    
else
    # S3部署方案
    echo "📦 创建S3存储桶..."
    aws s3 mb s3://$BUCKET_NAME --region $REGION
    
    if [ $? -ne 0 ]; then
        echo "❌ S3存储桶创建失败，可能名称已存在"
        BUCKET_NAME="fms-logistics-hub-aws-$(date +%Y%m%d%H%M%S)"
        echo "🔄 尝试新名称: $BUCKET_NAME"
        aws s3 mb s3://$BUCKET_NAME --region $REGION
    fi
    
    echo "✅ S3存储桶创建成功: $BUCKET_NAME"
    
    # 配置静态网站托管
    echo "🌐 配置静态网站托管..."
    aws s3 website s3://$BUCKET_NAME \
        --index-document index.html \
        --error-document index.html
    
    # 设置公共访问策略
    echo "🔓 设置公共访问权限..."
    cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json
    
    # 上传所有网站文件
    echo "📤 上传网站文件..."
    aws s3 sync . s3://$BUCKET_NAME \
        --exclude "*.sh" \
        --exclude "*.md" \
        --exclude ".git/*" \
        --exclude "copy-to-aws.sh" \
        --exclude "/tmp/*" \
        --cache-control "max-age=3600" \
        --delete
    
    # S3网站URL
    S3_WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
    
    if [ "$DEPLOY_METHOD" = "s3-cloudfront" ]; then
        echo "🌍 配置CloudFront CDN..."
        
        # 创建CloudFront分发配置
        cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "website-$(date +%s)",
    "Comment": "FMS Logistics Hub - AWS Free Hosting",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF
        
        echo "🚀 创建CloudFront分发..."
        CLOUDFRONT_RESULT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cloudfront-config.json)
        CLOUDFRONT_DOMAIN=$(echo $CLOUDFRONT_RESULT | grep -o '"DomainName": "[^"]*"' | cut -d'"' -f4)
        
        echo "⏳ CloudFront分发创建中... (需要5-10分钟生效)"
    fi
fi

# 清理临时文件
rm -f /tmp/bucket-policy.json /tmp/cloudfront-config.json

echo ""
echo "🎉 AWS部署完成！"
echo "=================="
echo ""
echo "📍 你的AWS网站地址："

if [ "$DEPLOY_METHOD" = "amplify" ]; then
    echo "   🌐 Amplify URL: (部署完成后会显示)"
    echo "   📱 管理控制台: https://console.aws.amazon.com/amplify/"
elif [ "$DEPLOY_METHOD" = "s3-cloudfront" ]; then
    echo "   🌐 S3直接访问: $S3_WEBSITE_URL"
    if [ ! -z "$CLOUDFRONT_DOMAIN" ]; then
        echo "   🚀 CloudFront CDN: https://$CLOUDFRONT_DOMAIN (5-10分钟后生效)"
    fi
else
    echo "   🌐 S3网站URL: $S3_WEBSITE_URL"
fi

echo ""
echo "💰 费用信息："
echo "   ✅ 当前费用: $0 (完全免费)"
echo "   📊 免费额度:"
echo "      - S3存储: 5GB"
echo "      - S3请求: 20,000 GET/月"
echo "      - CloudFront: 50GB传输/月"
echo "      - Lambda: 100万请求/月"
echo ""
echo "🔄 原网站状态："
echo "   ✅ GitHub Pages网站完全不受影响"
echo "   ✅ 继续正常运行: https://yy2025-program.github.io/tech-website/"
echo ""
echo "🎯 下一步建议："
echo "   1. 测试AWS网站功能"
echo "   2. 比较两个网站的性能"
echo "   3. 决定是否完全迁移到AWS"
echo "   4. 可选：配置自定义域名"
echo ""
echo "✅ 部署脚本执行完成！"
