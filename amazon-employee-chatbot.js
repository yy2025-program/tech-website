// Amazon员工专用Amazon Q Business集成
class AmazonEmployeeQBusiness {
    constructor(config = {}) {
        this.config = {
            internalURL: 'https://ask.qbusiness.aws.dev',
            useSSO: true,
            employeeMode: true,
            ...config
        };
        
        this.isAmazonEmployee = true;
        console.log('🏢 Amazon员工模式已启用');
    }

    // 检查Amazon SSO状态
    async checkSSOStatus() {
        try {
            // 检查是否在Amazon内部网络
            const response = await fetch(this.config.internalURL, {
                method: 'HEAD',
                credentials: 'include'
            });
            
            return response.status !== 403;
        } catch (error) {
            console.log('⚠️ 无法访问Amazon内部网络');
            return false;
        }
    }

    // 创建内部聊天窗口
    async createInternalChatWindow() {
        const ssoAvailable = await this.checkSSOStatus();
        
        if (!ssoAvailable) {
            alert('请确保您已连接到Amazon内部网络并完成SSO登录');
            return null;
        }

        // 打开Amazon Q Business内部页面
        const chatWindow = window.open(
            `${this.config.internalURL}/#/chat`,
            'amazon-q-internal',
            `width=500,
             height=700,
             left=${window.screen.width - 550},
             top=50,
             scrollbars=yes,
             resizable=yes,
             location=yes,
             menubar=no,
             toolbar=yes,
             status=yes`
        );

        if (chatWindow) {
            console.log('🚀 Amazon Q Business内部窗口已打开');
            this.setupWindowCommunication(chatWindow);
        }

        return chatWindow;
    }

    // 设置窗口通信（如果支持）
    setupWindowCommunication(chatWindow) {
        // 监听来自Amazon Q Business的消息
        window.addEventListener('message', (event) => {
            if (event.origin === 'https://ask.qbusiness.aws.dev') {
                console.log('📨 收到Amazon Q Business消息:', event.data);
                this.handleInternalMessage(event.data);
            }
        });
    }

    // 处理内部消息
    handleInternalMessage(data) {
        // 根据Amazon Q Business的消息格式处理
        // 这需要根据实际的内部API来实现
        console.log('处理内部消息:', data);
    }

    // 替换现有聊天按钮
    replaceExistingChatButton() {
        const chatButton = document.getElementById('chat-button');
        if (chatButton) {
            // 更新按钮样式和文本
            chatButton.innerHTML = '💬 Amazon Q Business (Internal)';
            chatButton.style.background = 'linear-gradient(45deg, #FF9500, #FF6B35)';
            chatButton.title = 'Amazon Q Business - Employee Access';
            
            // 移除现有事件监听器
            chatButton.replaceWith(chatButton.cloneNode(true));
            const newButton = document.getElementById('chat-button');
            
            // 添加新的事件监听器
            newButton.addEventListener('click', async () => {
                await this.createInternalChatWindow();
            });
            
            console.log('✅ 已启用Amazon员工内部访问模式');
        }
    }

    // 检查员工权限并初始化
    async initialize() {
        console.log('🔍 检查Amazon员工权限...');
        
        const hasAccess = await this.checkSSOStatus();
        
        if (hasAccess) {
            console.log('✅ Amazon员工权限验证成功');
            this.replaceExistingChatButton();
            
            // 显示员工模式指示器
            this.showEmployeeModeIndicator();
        } else {
            console.log('⚠️ 无法验证Amazon员工权限');
            console.log('请确保：');
            console.log('1. 已连接Amazon VPN');
            console.log('2. 已完成Amazon SSO登录');
            console.log('3. 有权限访问ask.qbusiness.aws.dev');
            
            // 回退到免费聊天机器人
            this.fallbackToFreeChatbot();
        }
    }

    // 显示员工模式指示器
    showEmployeeModeIndicator() {
        const indicator = document.createElement('div');
        indicator.innerHTML = '🏢 Amazon Employee Mode';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(45deg, #FF9500, #FF6B35);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(indicator);
    }

    // 回退到免费聊天机器人
    fallbackToFreeChatbot() {
        console.log('🔄 回退到免费聊天机器人模式');
        // 这里可以初始化我们之前创建的免费聊天机器人
        if (window.TrulySmartChatBot) {
            const freeChatbot = new window.TrulySmartChatBot();
            console.log('✅ 免费聊天机器人已启用作为备用方案');
        }
    }
}

// 自动检测和初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 检查是否为Amazon员工环境
    const employeeQBusiness = new AmazonEmployeeQBusiness();
    await employeeQBusiness.initialize();
});

// 全局可用
window.AmazonEmployeeQBusiness = AmazonEmployeeQBusiness;

console.log(`
🏢 Amazon员工Amazon Q Business集成已加载

使用说明:
1. 确保已连接Amazon VPN
2. 完成Amazon SSO登录
3. 系统会自动检测权限并启用相应模式

如果无法访问内部服务，系统会自动回退到免费聊天机器人。
`);
