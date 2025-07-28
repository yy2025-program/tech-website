#!/bin/bash

# GitHub Pages 自动部署脚本
# 使用方法: ./deploy.sh your-username repository-name

echo "🚀 GitHub Pages 自动部署脚本"
echo "================================"

# 检查参数
if [ $# -ne 2 ]; then
    echo "❌ 使用方法: ./deploy.sh <GitHub用户名> <仓库名>"
    echo "例如: ./deploy.sh myusername tech-website"
    exit 1
fi

USERNAME=$1
REPO_NAME=$2
REPO_URL="https://github.com/$USERNAME/$REPO_NAME.git"

echo "📋 部署信息:"
echo "   GitHub 用户名: $USERNAME"
echo "   仓库名: $REPO_NAME"
echo "   仓库地址: $REPO_URL"
echo ""

# 检查是否已经是git仓库
if [ -d ".git" ]; then
    echo "📁 检测到现有Git仓库，正在更新..."
    git add .
    git commit -m "Update website files - $(date)"
    git push origin main
else
    echo "🔧 初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit: Add tech website files"
    git branch -M main
    git remote add origin $REPO_URL
    
    echo "📤 推送到GitHub..."
    echo "⚠️  请确保你已经在GitHub上创建了仓库: $REPO_NAME"
    echo "⚠️  如果需要身份验证，请输入你的GitHub凭据"
    git push -u origin main
fi

echo ""
echo "✅ 部署完成！"
echo "🌐 你的网站将在几分钟后可用："
echo "   https://$USERNAME.github.io/$REPO_NAME"
echo ""
echo "📝 下一步："
echo "1. 访问 https://github.com/$USERNAME/$REPO_NAME"
echo "2. 点击 Settings 标签"
echo "3. 在左侧菜单找到 Pages"
echo "4. 在 Source 部分选择 'Deploy from a branch'"
echo "5. 选择 'main' 分支和 '/ (root)' 文件夹"
echo "6. 点击 Save"
echo ""
echo "🎉 完成后你的网站就会上线了！"
