// Amazon员工专用Amazon Q Business集成 - 修复版
class AmazonEmployeeQBusiness {
    constructor(config = {}) {
        this.config = {
            internalURL: 'https://ask.qbusiness.aws.dev',
            useSSO: true,
            employeeMode: true,
            ...config
        };
        
        this.isAmazonEmployee = true;
        this.initialized = false;
        console.log('🏢 Amazon员工模式已启用');
    }

    // 检查Amazon SSO状态
    async checkSSOStatus() {
        try {
            console.log('🔍 检查Amazon内部网络访问...');
            
            // 检查是否在Amazon内部网络
            const response = await fetch(this.config.internalURL, {
                method: 'HEAD',
                credentials: 'include',
                mode: 'no-cors' // 避免CORS问题
            });
            
            console.log('📡 网络检查响应:', response);
            return true; // 如果能发送请求就认为可能有访问权限
        } catch (error) {
            console.log('⚠️ 无法访问Amazon内部网络:', error);
            return false;
        }
    }

    // 创建内部聊天窗口
    async createInternalChatWindow() {
        console.log('🚀 尝试打开Amazon Q Business内部窗口...');
        
        // 直接尝试打开，让用户自己判断是否能访问
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
            console.log('✅ Amazon Q Business内部窗口已打开');
            
            // 显示使用提示
            setTimeout(() => {
                if (!chatWindow.closed) {
                    console.log('💡 如果页面要求登录，请使用您的Amazon SSO凭证');
                }
            }, 2000);
            
            return chatWindow;
        } else {
            alert('无法打开窗口，请检查浏览器弹窗设置');
            return null;
        }
    }

    // 替换现有聊天按钮
    replaceExistingChatButton() {
        console.log('🔄 替换聊天按钮为Amazon员工模式...');
        
        const chatButton = document.getElementById('chat-button');
        if (chatButton) {
            // 更新按钮样式和文本
            chatButton.innerHTML = '💬 Amazon Q Business (Internal)';
            chatButton.style.background = 'linear-gradient(45deg, #FF9500, #FF6B35)';
            chatButton.style.color = 'white';
            chatButton.title = 'Amazon Q Business - Employee Access';
            
            // 移除现有事件监听器
            const newButton = chatButton.cloneNode(true);
            chatButton.parentNode.replaceChild(newButton, chatButton);
            
            // 添加新的事件监听器
            newButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Amazon员工聊天按钮被点击');
                await this.createInternalChatWindow();
            });
            
            console.log('✅ 聊天按钮已更新为Amazon员工模式');
            
            // 禁用原有的聊天面板功能
            this.disableOriginalChatPanel();
            
            return true;
        } else {
            console.log('❌ 找不到聊天按钮元素');
            return false;
        }
    }

    // 禁用原有的聊天面板
    disableOriginalChatPanel() {
        console.log('🚫 禁用原有聊天面板...');
        
        // 查找并隐藏原有的聊天面板
        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.style.display = 'none';
            console.log('✅ 原有聊天面板已隐藏');
        }
        
        // 覆盖全局配置
        if (window.AMAZON_Q_CONFIG) {
            window.AMAZON_Q_CONFIG.useDemo = false;
            window.AMAZON_Q_CONFIG.employeeMode = true;
            console.log('✅ 已覆盖全局配置为员工模式');
        }
    }

    // 显示员工模式指示器
    showEmployeeModeIndicator() {
        console.log('📍 显示员工模式指示器...');
        
        // 检查是否已经存在指示器
        if (document.getElementById('employee-mode-indicator')) {
            return;
        }
        
        const indicator = document.createElement('div');
        indicator.id = 'employee-mode-indicator';
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
            animation: fadeIn 0.5s ease-in;
        `;
        
        // 添加CSS动画
        if (!document.getElementById('employee-mode-styles')) {
            const style = document.createElement('style');
            style.id = 'employee-mode-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(indicator);
        console.log('✅ 员工模式指示器已显示');
    }

    // 检查员工权限并初始化
    async initialize() {
        if (this.initialized) {
            console.log('⚠️ 已经初始化过了');
            return;
        }
        
        console.log('🔍 开始检查Amazon员工权限...');
        
        try {
            // 显示员工模式指示器（假设在内部网络）
            this.showEmployeeModeIndicator();
            
            // 替换聊天按钮
            const buttonReplaced = this.replaceExistingChatButton();
            
            if (buttonReplaced) {
                console.log('✅ Amazon员工模式初始化成功');
                
                // 显示初始化成功消息
                setTimeout(() => {
                    console.log('💡 Amazon员工模式已启用，点击聊天按钮将打开内部Amazon Q Business');
                }, 1000);
            } else {
                console.log('⚠️ 聊天按钮替换失败，可能页面还未完全加载');
                // 延迟重试
                setTimeout(() => this.initialize(), 1000);
                return;
            }
            
            this.initialized = true;
            
        } catch (error) {
            console.error('❌ Amazon员工模式初始化失败:', error);
            this.fallbackToFreeChatbot();
        }
    }

    // 回退到免费聊天机器人
    fallbackToFreeChatbot() {
        console.log('🔄 回退到免费聊天机器人模式');
        
        // 移除员工模式指示器
        const indicator = document.getElementById('employee-mode-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        // 恢复原始聊天按钮
        const chatButton = document.getElementById('chat-button');
        if (chatButton) {
            chatButton.innerHTML = '💬 AI Assistant';
            chatButton.style.background = '';
            chatButton.title = 'AI Assistant';
        }
        
        console.log('✅ 已回退到免费聊天机器人');
    }

    // 手动触发初始化（用于调试）
    static async manualInit() {
        console.log('🔧 手动初始化Amazon员工模式...');
        const instance = new AmazonEmployeeQBusiness();
        await instance.initialize();
        return instance;
    }
}

// 全局可用
window.AmazonEmployeeQBusiness = AmazonEmployeeQBusiness;

// 多种初始化方式
function initializeEmployeeMode() {
    console.log('🚀 初始化Amazon员工模式...');
    const employeeQBusiness = new AmazonEmployeeQBusiness();
    employeeQBusiness.initialize();
    
    // 保存到全局变量供调试使用
    window.employeeQBusiness = employeeQBusiness;
}

// 尝试多种初始化时机
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmployeeMode);
} else {
    // 如果DOM已经加载完成，立即初始化
    initializeEmployeeMode();
}

// 额外的延迟初始化，确保页面完全加载
setTimeout(initializeEmployeeMode, 2000);

console.log(`
🏢 Amazon员工Amazon Q Business集成已加载

调试命令:
- AmazonEmployeeQBusiness.manualInit() // 手动初始化
- window.employeeQBusiness.initialize() // 重新初始化

状态检查:
- 查看控制台日志了解初始化过程
- 应该看到员工模式指示器在右上角
- 聊天按钮应该变为橙色
`);
