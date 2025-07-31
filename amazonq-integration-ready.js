// Amazon Q Business 集成代码 - 准备就绪
class AmazonQBusinessIntegration {
    constructor(webExperienceUrl) {
        this.webExperienceUrl = webExperienceUrl;
        this.isTestMode = true; // 测试模式，有预算限制
        this.budgetLimit = 5; // $5预算限制
        console.log('🚀 Amazon Q Business 集成已准备就绪');
    }

    // 替换现有聊天功能
    replaceExistingChat() {
        const chatButton = document.getElementById('chat-button');
        if (chatButton) {
            // 移除现有事件监听器
            chatButton.replaceWith(chatButton.cloneNode(true));
            const newChatButton = document.getElementById('chat-button');
            
            // 添加Amazon Q Business功能
            newChatButton.addEventListener('click', () => {
                this.openAmazonQChat();
            });
            
            // 更新按钮样式，显示这是真正的Amazon Q
            newChatButton.innerHTML = '💬 Amazon Q Business (Test)';
            newChatButton.style.background = 'linear-gradient(45deg, #FF6B35, #F7931E)';
            newChatButton.title = 'Real Amazon Q Business - $5 Budget Test';
            
            console.log('✅ 已替换为真正的Amazon Q Business');
        }
    }

    // 打开Amazon Q Business聊天
    openAmazonQChat() {
        if (!this.webExperienceUrl) {
            alert('请先配置Amazon Q Business Web Experience URL');
            return;
        }

        // 显示预算提醒
        if (this.isTestMode) {
            const proceed = confirm(
                `⚠️ 预算提醒：\n` +
                `这是真正的Amazon Q Business测试\n` +
                `预算限制：$${this.budgetLimit}/月\n` +
                `继续使用吗？`
            );
            
            if (!proceed) return;
        }

        // 打开Amazon Q Business Web Experience
        const chatWindow = window.open(
            this.webExperienceUrl,
            'amazonq-business',
            `width=450,
             height=650,
             left=${window.screen.width - 500},
             top=50,
             scrollbars=yes,
             resizable=yes,
             location=no,
             menubar=no,
             toolbar=no,
             status=no`
        );
        
        if (!chatWindow) {
            alert('请允许弹窗以使用Amazon Q Business');
        } else {
            console.log('🚀 Amazon Q Business 聊天窗口已打开');
            
            // 记录使用情况（用于预算跟踪）
            this.logUsage();
        }
    }

    // 记录使用情况
    logUsage() {
        const usage = JSON.parse(localStorage.getItem('amazonq_usage') || '{"count": 0, "date": ""}');
        const today = new Date().toDateString();
        
        if (usage.date !== today) {
            usage.count = 1;
            usage.date = today;
        } else {
            usage.count++;
        }
        
        localStorage.setItem('amazonq_usage', JSON.stringify(usage));
        console.log(`📊 今日使用次数: ${usage.count}`);
        
        // 使用量提醒
        if (usage.count > 10) {
            console.warn('⚠️ 今日使用次数较多，请注意预算');
        }
    }

    // 设置Web Experience URL
    setWebExperienceUrl(url) {
        this.webExperienceUrl = url;
        console.log('✅ Amazon Q Business Web Experience URL 已设置');
        
        // 自动替换聊天功能
        this.replaceExistingChat();
    }

    // 显示预算状态
    showBudgetStatus() {
        const usage = JSON.parse(localStorage.getItem('amazonq_usage') || '{"count": 0}');
        console.log(`📊 预算状态: $${this.budgetLimit} 限制, 今日使用 ${usage.count} 次`);
    }
}

// 全局可用
window.AmazonQBusinessIntegration = AmazonQBusinessIntegration;

// 使用说明
console.log(`
🚀 Amazon Q Business 集成使用说明:

1. 创建应用并获取Web Experience URL后:
   const integration = new AmazonQBusinessIntegration();
   integration.setWebExperienceUrl('你的URL');

2. 或者直接设置:
   window.amazonQIntegration = new AmazonQBusinessIntegration('你的URL');

3. 查看预算状态:
   integration.showBudgetStatus();
`);
