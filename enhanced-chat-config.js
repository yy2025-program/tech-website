// Enhanced Chat Configuration for Logistics Hub
window.ENHANCED_CHAT_CONFIG = {
    // 当前使用演示模式，但为真实API做好准备
    useDemo: true,
    
    // Amazon Q Business配置（为将来使用）
    amazonQ: {
        region: 'us-east-1',
        applicationId: 'your-amazon-q-app-id',
        apiEndpoint: 'http://localhost:3000/api/amazon-q/chat'
    },
    
    // 增强的演示响应系统
    enhancedDemo: {
        // 使用更智能的关键词匹配
        useSmartMatching: true,
        
        // 支持多轮对话
        conversationMemory: true,
        
        // 个性化回复
        personalizedResponses: true,
        
        // FMS专业知识库
        knowledgeBase: {
            // 物流相关
            logistics: [
                'inventory management',
                'shipping optimization', 
                'warehouse operations',
                'supply chain',
                'fulfillment'
            ],
            
            // FMS工具
            tools: [
                'seller learning intake',
                'esm fba sca',
                'vos bank',
                'awd pilot',
                'gemba walk'
            ],
            
            // 自动化相关
            automation: [
                'ai agents',
                'data automation',
                'process optimization',
                'workflow automation'
            ]
        }
    },
    
    // 用户体验增强
    ui: {
        typingSpeed: 50, // 打字效果速度
        showThinking: true, // 显示"思考中"状态
        smartSuggestions: true, // 智能建议
        quickReplies: [
            "Tell me about FMS resources",
            "How can AI help with logistics?",
            "Show me automation tools",
            "What is Gemba Walk?"
        ]
    }
};

// 智能回复生成器
class EnhancedChatBot {
    constructor() {
        this.conversationHistory = [];
        this.userContext = {};
        this.knowledgeBase = window.ENHANCED_CHAT_CONFIG.enhancedDemo.knowledgeBase;
    }
    
    async generateResponse(message) {
        // 添加到对话历史
        this.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date()
        });
        
        // 分析消息意图
        const intent = this.analyzeIntent(message);
        
        // 生成个性化回复
        const response = await this.generatePersonalizedResponse(message, intent);
        
        // 添加回复到历史
        this.conversationHistory.push({
            type: 'bot',
            message: response,
            timestamp: new Date()
        });
        
        return response;
    }
    
    analyzeIntent(message) {
        const msg = message.toLowerCase();
        
        // 检查物流相关关键词
        if (this.knowledgeBase.logistics.some(keyword => msg.includes(keyword))) {
            return 'logistics';
        }
        
        // 检查工具相关关键词
        if (this.knowledgeBase.tools.some(keyword => msg.includes(keyword))) {
            return 'tools';
        }
        
        // 检查自动化相关关键词
        if (this.knowledgeBase.automation.some(keyword => msg.includes(keyword))) {
            return 'automation';
        }
        
        // 问候语
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('你好')) {
            return 'greeting';
        }
        
        // 帮助请求
        if (msg.includes('help') || msg.includes('帮助')) {
            return 'help';
        }
        
        return 'general';
    }
    
    async generatePersonalizedResponse(message, intent) {
        // 模拟思考时间
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const responses = {
            logistics: [
                "🚚 FMS物流系统专注于优化整个供应链流程。我可以帮您了解库存管理、配送优化、仓储运营等方面。您想深入了解哪个领域？",
                "📦 在FMS物流中，我们使用先进的AI技术来预测需求、优化路线和管理库存。有什么具体的物流挑战需要解决吗？",
                "🔄 供应链优化是我们的核心优势。通过数据分析和机器学习，我们可以显著提高效率。您目前面临什么物流难题？"
            ],
            
            tools: [
                "🛠️ 我们的FMS工具套件包括卖家学习表单、ESM FBA SCA工作计划、SCA中央VoS银行等。您想了解哪个工具的具体功能？",
                "📊 这些内部工具都是为了提高运营效率而设计的。比如VoS银行收集卖家反馈，AWD试点项目探索新的配送模式。需要详细介绍吗？",
                "⚡ 我们的工具都集成了AI功能，可以自动化许多重复性任务。您希望了解哪个工具的自动化特性？"
            ],
            
            automation: [
                "🤖 AI代理是我们自动化战略的核心。它们可以处理客户查询、优化库存、预测需求等。您对哪种AI应用最感兴趣？",
                "⚙️ 数据自动化帮助我们实时处理大量物流信息，从订单处理到配送跟踪。想了解具体的自动化流程吗？",
                "🎯 流程优化通过AI分析找出瓶颈并提供解决方案。我们已经在多个环节实现了显著改进。需要案例分析吗？"
            ],
            
            greeting: [
                "👋 您好！我是Amazon Q，专门为FMS物流团队服务的AI助手。我可以帮您了解我们的内部资源、工具和最佳实践。今天想探讨什么话题？",
                "🌟 欢迎来到Logistics Hub！我是您的AI助手，熟悉所有FMS运营流程。无论是库存管理、配送优化还是AI自动化，我都能为您提供专业建议。",
                "🚀 很高兴为您服务！作为FMS物流专家，我可以帮您导航我们的资源库、解答运营问题、分享最佳实践。您想从哪里开始？"
            ],
            
            help: [
                "💡 我可以协助您处理以下方面：\n• 📋 FMS内部资源导航\n• 🛠️ 工具使用指导\n• 📊 数据分析和自动化\n• 🎯 最佳实践分享\n• 🔍 Gemba Walk方法论\n\n请告诉我您最感兴趣的领域！",
                "🎯 作为您的FMS助手，我的专长包括：\n• 物流流程优化\n• AI代理应用\n• 卖家支持工具\n• 运营效率提升\n• 问题诊断和解决\n\n有什么具体问题需要帮助吗？"
            ],
            
            general: [
                "🤔 这是个有趣的问题！基于我对FMS物流的了解，我建议我们可以从几个角度来分析这个问题。您能提供更多背景信息吗？",
                "💭 让我想想如何最好地回答您的问题。在FMS的运营经验中，我们通常会考虑效率、成本和客户满意度这三个维度。您的关注点是什么？",
                "🔍 这个话题很值得深入探讨。根据我们的最佳实践，我可以为您提供一些相关的见解和建议。您希望从哪个方面开始？"
            ]
        };
        
        const intentResponses = responses[intent] || responses.general;
        return intentResponses[Math.floor(Math.random() * intentResponses.length)];
    }
}

// 导出增强聊天机器人
window.EnhancedChatBot = EnhancedChatBot;
