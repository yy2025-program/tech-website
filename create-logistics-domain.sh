#!/bin/bash

echo "🚀 创建Logistics Programs相关域名的AWS网站"
echo "==========================================="

echo "💡 推荐的Logistics Programs相关域名："
echo "   1. logistics-programs-hub"
echo "   2. fms-logistics-programs"  
echo "   3. logistics-program-center"
echo "   4. supply-chain-programs"
echo "   5. logistics-training-hub"
echo "   6. fms-program-portal"
echo "   7. logistics-excellence-hub"
echo "   8. fms-learning-center"
echo ""
echo "💡 或者输入你自己的名称（只能包含小写字母、数字和连字符）"
echo ""
read -p "请选择数字(1-8)或输入自定义名称: " CHOICE

case $CHOICE in
    1) CUSTOM_NAME="logistics-programs-hub" ;;
    2) CUSTOM_NAME="fms-logistics-programs" ;;
    3) CUSTOM_NAME="logistics-program-center" ;;
    4) CUSTOM_NAME="supply-chain-programs" ;;
    5) CUSTOM_NAME="logistics-training-hub" ;;
    6) CUSTOM_NAME="fms-program-portal" ;;
    7) CUSTOM_NAME="logistics-excellence-hub" ;;
    8) CUSTOM_NAME="fms-learning-center" ;;
    *) CUSTOM_NAME="$CHOICE" ;;
esac

# 验证名称
if [[ ! "$CUSTOM_NAME" =~ ^[a-z0-9-]+$ ]]; then
    echo "❌ 名称只能包含小写字母、数字和连字符"
    exit 1
fi

BUCKET_NAME="$CUSTOM_NAME-$(date +%Y%m%d)"
REGION="us-east-1"

echo ""
echo "📋 新Logistics Programs网站配置："
echo "   存储桶名称: $BUCKET_NAME"
echo "   网站域名: $BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "   主题: Logistics Programs & Training"
echo "   费用: $0 (完全免费)"
echo ""

read -p "确认创建这个Logistics Programs网站吗？(y/n): " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "❌ 取消创建"
    exit 0
fi

echo ""
echo "🚀 开始创建Logistics Programs网站..."

# 创建新的S3存储桶
echo "📦 创建存储桶: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ 存储桶创建失败，可能名称已被使用"
    echo "💡 请尝试其他名称或添加更多数字"
    exit 1
fi

echo "✅ 存储桶创建成功"

# 禁用公共访问阻止
echo "🔓 配置公共访问权限..."
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if [ $? -eq 0 ]; then
    echo "✅ 公共访问权限配置成功"
else
    echo "⚠️ 公共访问权限配置可能需要手动设置"
fi

# 配置静态网站托管
echo "🌐 配置静态网站托管..."
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html

if [ $? -eq 0 ]; then
    echo "✅ 静态网站托管配置成功"
else
    echo "❌ 静态网站托管配置失败"
fi

# 设置存储桶策略
echo "📝 设置存储桶策略..."
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

if [ $? -eq 0 ]; then
    echo "✅ 存储桶策略设置成功"
else
    echo "⚠️ 存储桶策略可能需要手动设置"
fi

# 上传网站文件
echo "📤 上传网站文件..."
aws s3 sync . s3://$BUCKET_NAME \
    --exclude "*.sh" \
    --exclude ".git/*" \
    --exclude "*.md" \
    --exclude "README*" \
    --cache-control "max-age=3600"

if [ $? -eq 0 ]; then
    echo "✅ 网站文件上传成功"
else
    echo "❌ 网站文件上传失败"
fi

# 设置正确的内容类型
echo "🔧 设置文件内容类型..."
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
    --content-type "text/html" \
    --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/styles.css s3://$BUCKET_NAME/styles.css \
    --content-type "text/css" \
    --metadata-directive REPLACE 2>/dev/null

aws s3 cp s3://$BUCKET_NAME/script.js s3://$BUCKET_NAME/script.js \
    --content-type "application/javascript" \
    --metadata-directive REPLACE 2>/dev/null

NEW_WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "🎉 Logistics Programs网站创建完成！"
echo "===================================="
echo ""
echo "🌐 新网站地址: $NEW_WEBSITE_URL"
echo "🎯 网站主题: Logistics Programs & Training"
echo "💰 费用: $0 (完全免费)"
echo "⏱️  生效时间: 立即可访问"
echo ""
echo "🔗 你现在拥有的网站："
echo "   1. GitHub Pages: https://yy2025-program.github.io/tech-website/"
echo "   2. AWS原网站: http://fms-logistics-202508041704.s3-website-us-east-1.amazonaws.com"
echo "   3. AWS新网站: $NEW_WEBSITE_URL"
echo ""
echo "🧪 建议测试："
echo "   ✅ 访问新网站确认功能正常"
echo "   ✅ 测试聊天功能"
echo "   ✅ 测试智能两层聊天体验"
echo "   ✅ 对比三个网站的加载速度"
echo ""
echo "🗑️  清理旧资源（可选）："
echo "   如果新网站运行正常，可以删除旧的AWS网站："
echo "   aws s3 rb s3://fms-logistics-202508041704 --force"
echo ""
echo "🚀 下一步建议："
echo "   1. 测试新网站的所有功能"
echo "   2. 如果满意，可以将新域名设为主要网站"
echo "   3. 考虑配置CloudFront CDN进一步提升性能"
echo ""
echo "✅ Logistics Programs网站部署完成！"
