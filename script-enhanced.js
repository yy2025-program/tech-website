// 在原有script.js基础上增强getDemoResponse方法

// 增强的Amazon Q Chat Widget
class AmazonQChatWidget {
    constructor() {
        this.chatButton = document.getElementById('chat-button');
        this.chatPanel = document.getElementById('chat-panel');
        this.chatClose = document.getElementById('chat-close');
        this.chatInput = document.getElementById('chat-input');
        this.chatSend = document.getElementById('chat-send');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatStatus = document.getElementById('chat-status');
        
        this.isOpen = false;
        this.conversationId = this.generateConversationId();
        this.config = window.AMAZON_Q_CONFIG || {};
        
        // 初始化增强聊天机器人
        this.enhancedBot = window.USE_ENHANCED_CHAT ? new window.EnhancedChatBot() : null;
        
        this.init();
    }
    
    // ... 保持其他方法不变 ...
    
    async getDemoResponse(message) {
        // 如果启用了增强聊天，使用增强机器人
        if (this.enhancedBot) {
            return await this.enhancedBot.generateResponse(message);
        }
        
        // 否则使用原有的演示响应
        await this.delay(1000 + Math.random() * 2000);
        
        const responses = {
            // 原有的响应保持不变
            'fms': 'FMS (Fulfillment by Amazon) is our comprehensive logistics solution...',
            // ... 其他响应
        };
        
        // 原有的响应逻辑
        const msg = message.toLowerCase();
        for (const [keyword, response] of Object.entries(responses)) {
            if (msg.includes(keyword)) {
                return response;
            }
        }
        
        const defaultResponses = [
            "I'm here to help with FMS logistics operations. Could you please provide more specific details about what you're looking for?",
            "That's an interesting question about our logistics operations. Let me help you find the right resources or information.",
            "I'd be happy to assist you with FMS-related queries. Could you clarify what specific area you'd like to explore?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // ... 保持其他方法不变 ...
}
