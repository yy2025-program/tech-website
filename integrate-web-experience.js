// Amazon Q Business Web Experience 快速集成

// 配置你的Amazon Q Business Web Experience URL
const AMAZON_Q_WEB_EXPERIENCE_URL = 'https://your-app-id.us-east-1.amazonqbusiness.aws/chat';

// 方式1: 替换现有聊天按钮功能
function integrateAmazonQWebExperience() {
    const chatButton = document.getElementById('chat-button');
    
    if (chatButton) {
        // 移除现有的事件监听器
        chatButton.replaceWith(chatButton.cloneNode(true));
        const newChatButton = document.getElementById('chat-button');
        
        // 添加新的功能：打开Amazon Q Business Web Experience
        newChatButton.addEventListener('click', () => {
            openAmazonQChat();
        });
        
        // 更新按钮提示
        newChatButton.title = 'Chat with Amazon Q Business Assistant';
        
        console.log('✅ Amazon Q Business Web Experience 集成完成');
    }
}

// 打开Amazon Q Business聊天窗口
function openAmazonQChat() {
    const chatWindow = window.open(
        AMAZON_Q_WEB_EXPERIENCE_URL,
        'amazonq-chat',
        `width=400,
         height=600,
         left=${window.screen.width - 450},
         top=100,
         scrollbars=yes,
         resizable=yes,
         location=no,
         menubar=no,
         toolbar=no,
         status=no`
    );
    
    if (!chatWindow) {
        alert('请允许弹窗以使用Amazon Q助手');
    }
}

// 方式2: 在页面中嵌入iframe
function embedAmazonQIframe() {
    const chatPanel = document.getElementById('chat-panel');
    
    if (chatPanel) {
        chatPanel.innerHTML = `
            <div class="chat-header">
                <h3>Amazon Q Business Assistant</h3>
                <button id="chat-close" class="chat-close">×</button>
            </div>
            <iframe 
                src="${AMAZON_Q_WEB_EXPERIENCE_URL}"
                width="100%" 
                height="500px"
                frameborder="0"
                allow="microphone; camera"
                style="border-radius: 8px;">
            </iframe>
        `;
        
        // 保持关闭功能
        document.getElementById('chat-close').addEventListener('click', () => {
            chatPanel.classList.remove('active');
        });
        
        console.log('✅ Amazon Q Business iframe 嵌入完成');
    }
}

// 页面加载完成后执行集成
document.addEventListener('DOMContentLoaded', () => {
    // 选择集成方式：
    // integrateAmazonQWebExperience(); // 弹窗方式
    // embedAmazonQIframe(); // iframe嵌入方式
    
    console.log('Amazon Q Business 集成脚本已加载');
    console.log('请在AWS控制台创建应用后，更新 AMAZON_Q_WEB_EXPERIENCE_URL');
});

// 导出函数供手动调用
window.AmazonQIntegration = {
    setWebExperienceUrl: (url) => {
        AMAZON_Q_WEB_EXPERIENCE_URL = url;
        console.log('✅ Amazon Q Web Experience URL 已更新:', url);
    },
    enablePopupMode: integrateAmazonQWebExperience,
    enableIframeMode: embedAmazonQIframe,
    openChat: openAmazonQChat
};
