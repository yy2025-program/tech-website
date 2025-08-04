#!/bin/bash

echo "🌐 创建简洁域名的Logistics Programs网站"
echo "========================================"

echo "💡 推荐的简洁域名选项："
echo "   1. logistics-hub"
echo "   2. fms-programs"  
echo "   3. logistics-center"
echo "   4. supply-programs"
echo "   5. fms-hub"
echo "   6. logistics-pro"
echo ""
echo "🎯 最终域名格式: [你的选择].s3-website-us-east-1.amazonaws.com"
echo "📏 域名长度对比:"
echo "   旧版: logistics-programs-hub-20250804.s3-website-us-east-1.amazonaws.com (67字符)"
echo "   新版: logistics-hub.s3-website-us-east-1.amazonaws.com (48字符)"
echo ""
read -p "请选择数字(1-6)或输入自定义简短名称: " CHOICE

case $CHOICE in
    1) BUCKET_NAME="logistics-hub" ;;
    2) BUCKET_NAME="fms-programs" ;;
    3) BUCKET_NAME="logistics-center" ;;
    4) BUCKET_NAME="supply-programs" ;;
    5) BUCKET_NAME="fms-hub" ;;
    6) BUCKET_NAME="logistics-pro" ;;
    *) BUCKET_NAME="$CHOICE" ;;
esac

# 验证名称
if [[ ! "$BUCKET_NAME" =~ ^[a-z0-9-]+$ ]]; then
    echo "❌ 名称只能包含小写字母、数字和连字符"
    exit 1
fi

# 检查名称长度
if [ ${#BUCKET_NAME} -gt 20 ]; then
    echo "⚠️ 建议使用更短的名称（20字符以内）以获得更简洁的域名"
    read -p "继续使用这个名称吗？(y/n): " CONTINUE
    if [[ "$CONTINUE" != "y" && "$CONTINUE" != "Y" ]]; then
        exit 0
    fi
fi

REGION="us-east-1"
FINAL_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "📋 简洁域名网站配置："
echo "   存储桶名称: $BUCKET_NAME"
echo "   最终域名: $FINAL_URL"
echo "   域名长度: ${#FINAL_URL} 字符"
echo "   主题: Logistics Programs"
echo "   费用: $0 (完全免费)"
echo ""

read -p "确认创建这个简洁域名网站吗？(y/n): " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "❌ 取消创建"
    exit 0
fi

echo ""
echo "🚀 开始创建简洁域名网站..."

# 尝试创建存储桶
echo "📦 尝试创建存储桶: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ 存储桶名称 '$BUCKET_NAME' 已被使用"
    echo "💡 尝试添加后缀..."
    
    # 尝试添加数字后缀
    for i in {1..99}; do
        NEW_BUCKET_NAME="$BUCKET_NAME$i"
        echo "🔄 尝试: $NEW_BUCKET_NAME"
        aws s3 mb s3://$NEW_BUCKET_NAME --region $REGION
        if [ $? -eq 0 ]; then
            BUCKET_NAME=$NEW_BUCKET_NAME
            FINAL_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
            echo "✅ 成功创建存储桶: $BUCKET_NAME"
            break
        fi
    done
    
    if [ $? -ne 0 ]; then
        echo "❌ 无法创建存储桶，请尝试其他名称"
        exit 1
    fi
else
    echo "✅ 存储桶创建成功: $BUCKET_NAME"
fi

# 禁用公共访问阻止
echo "🔓 配置公共访问权限..."
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 配置静态网站托管
echo "🌐 配置静态网站托管..."
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html

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

# 上传网站文件
echo "📤 上传网站文件..."
aws s3 sync . s3://$BUCKET_NAME \
    --exclude "*.sh" \
    --exclude ".git/*" \
    --exclude "*.md" \
    --exclude "README*" \
    --cache-control "max-age=3600"

# 设置正确的内容类型
echo "🔧 优化文件类型..."
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
    --content-type "text/html" \
    --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/styles.css s3://$BUCKET_NAME/styles.css \
    --content-type "text/css" \
    --metadata-directive REPLACE 2>/dev/null

aws s3 cp s3://$BUCKET_NAME/script.js s3://$BUCKET_NAME/script.js \
    --content-type "application/javascript" \
    --metadata-directive REPLACE 2>/dev/null

echo ""
echo "🎉 简洁域名网站创建完成！"
echo "=========================="
echo ""
echo "🌐 新网站地址: $FINAL_URL"
echo "📏 域名长度: ${#FINAL_URL} 字符 (比之前短了 $((67 - ${#FINAL_URL})) 字符)"
echo "🎯 网站主题: Logistics Programs"
echo "💰 费用: $0 (完全免费)"
echo "⏱️  生效时间: 立即可访问"
echo ""
echo "🔗 你的网站集合："
echo "   1. GitHub Pages: https://yy2025-program.github.io/tech-website/"
echo "   2. AWS原网站: http://fms-logistics-202508041704.s3-website-us-east-1.amazonaws.com"
echo "   3. AWS简洁域名: $FINAL_URL ⭐ (新建)"
echo ""
echo "🚀 进一步优化建议："
echo "   💡 如果想要更短的域名，可以配置CloudFront CDN"
echo "   💡 CloudFront域名格式: d1234567890.cloudfront.net (约30字符)"
echo ""
echo "🧪 立即测试:"
echo "   ✅ 访问: $FINAL_URL"
echo "   ✅ 测试聊天功能"
echo "   ✅ 测试智能两层聊天体验"
echo ""
echo "✅ 简洁域名网站部署完成！"
