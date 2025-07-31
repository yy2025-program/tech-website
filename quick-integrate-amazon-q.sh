#!/bin/bash

echo "🚀 Amazon Q Business Web Experience 快速集成"
echo "============================================"

# 检查权限
echo "📋 检查Amazon Q Business权限..."
if aws qbusiness list-applications --region us-east-1 > /dev/null 2>&1; then
    echo "✅ 权限正常"
else
    echo "❌ 需要先添加Amazon Q Business权限"
    echo "请在AWS控制台添加权限后重新运行此脚本"
    echo ""
    echo "权限策略文件: amazon-q-business-policy.json"
    exit 1
fi

# 提示用户创建应用
echo ""
echo "📱 请在AWS控制台完成以下步骤："
echo "1. 访问: https://console.aws.amazon.com/amazonq/business"
echo "2. 点击 'Create application'"
echo "3. 填写应用信息:"
echo "   - Name: Logistics Hub Assistant"
echo "   - Description: AI assistant for FMS logistics operations"
echo "4. 创建 Web Experience"
echo "5. 复制 Web Experience URL"
echo ""

# 等待用户输入URL
read -p "请输入你的Amazon Q Business Web Experience URL: " WEB_EXPERIENCE_URL

if [ -z "$WEB_EXPERIENCE_URL" ]; then
    echo "❌ URL不能为空"
    exit 1
fi

echo "✅ 收到URL: $WEB_EXPERIENCE_URL"

# 创建集成版本的HTML
echo "📝 创建集成版本..."

# 备份原文件
cp index.html index.html.backup

# 创建新的集成版本
cat > index-with-amazonq.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logistics Hub - Building the Future with AI</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- 保持原有HTML结构，只修改聊天功能 -->
    
    <!-- 在body结束前添加Amazon Q集成脚本 -->
    <script>
        // Amazon Q Business Web Experience 集成
        const AMAZON_Q_URL = '$WEB_EXPERIENCE_URL';
        
        document.addEventListener('DOMContentLoaded', () => {
            const chatButton = document.getElementById('chat-button');
            
            if (chatButton) {
                // 替换聊天按钮功能
                chatButton.addEventListener('click', () => {
                    const chatWindow = window.open(
                        AMAZON_Q_URL,
                        'amazonq-chat',
                        'width=400,height=600,left=' + (window.screen.width - 450) + ',top=100,scrollbars=yes,resizable=yes'
                    );
                    
                    if (!chatWindow) {
                        alert('请允许弹窗以使用Amazon Q助手');
                    }
                });
                
                console.log('✅ Amazon Q Business 集成完成');
            }
        });
    </script>
</body>
</html>
EOF

# 复制原文件内容（除了script部分）
sed '/<script>/,/<\/script>/d' index.html | sed '$d' >> temp.html
cat >> temp.html << EOF
    
    <!-- Amazon Q Business 集成 -->
    <script>
        const AMAZON_Q_URL = '$WEB_EXPERIENCE_URL';
        
        document.addEventListener('DOMContentLoaded', () => {
            const chatButton = document.getElementById('chat-button');
            
            if (chatButton) {
                // 移除原有事件监听器
                chatButton.replaceWith(chatButton.cloneNode(true));
                const newChatButton = document.getElementById('chat-button');
                
                // 添加Amazon Q功能
                newChatButton.addEventListener('click', () => {
                    const chatWindow = window.open(
                        AMAZON_Q_URL,
                        'amazonq-chat',
                        'width=400,height=600,left=' + (window.screen.width - 450) + ',top=100,scrollbars=yes,resizable=yes'
                    );
                    
                    if (!chatWindow) {
                        alert('请允许弹窗以使用Amazon Q助手');
                    }
                });
                
                console.log('✅ Amazon Q Business 集成完成');
            }
        });
    </script>
</body>
</html>
EOF

mv temp.html index.html

echo "✅ 集成完成！"
echo ""
echo "📋 更新内容："
echo "- 聊天按钮现在会打开Amazon Q Business Web Experience"
echo "- 原始文件备份为: index.html.backup"
echo ""
echo "🚀 部署更新："
echo "git add . && git commit -m '集成Amazon Q Business Web Experience' && git push origin main"
echo ""
echo "🧪 测试："
echo "访问网站并点击右下角聊天按钮"
