// 增强版免费聊天机器人 - 完全基于前端，无服务器成本
class EnhancedFreeChatBot {
    constructor() {
        this.conversationHistory = [];
        this.userPreferences = this.loadUserPreferences();
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.contextMemory = new Map();
        this.learningData = this.loadLearningData();
    }

    // 初始化知识库
    initializeKnowledgeBase() {
        return {
            // FMS物流专业知识
            logistics: {
                keywords: ['物流', 'logistics', 'fms', '配送', 'shipping', '运输'],
                responses: {
                    en: [
                        'FMS (Fulfillment by Amazon) is our comprehensive logistics solution. I can help you with inventory management, shipping processes, seller resources, and operational best practices.',
                        'Our logistics network spans globally with advanced automation and AI-driven optimization. What specific logistics challenge can I help you with?',
                        'FMS logistics includes warehousing, inventory management, order fulfillment, and last-mile delivery. Which area interests you most?'
                    ],
                    cn: [
                        'FMS（亚马逊物流）是我们的综合物流解决方案。我可以帮助您了解库存管理、配送流程、卖家资源和运营最佳实践。',
                        '我们的物流网络遍布全球，采用先进的自动化和AI驱动的优化技术。我可以帮您解决什么具体的物流挑战？',
                        'FMS物流包括仓储、库存管理、订单履行和最后一公里配送。您对哪个领域最感兴趣？'
                    ]
                }
            },
            
            inventory: {
                keywords: ['库存', 'inventory', '仓储', 'warehouse', '存货'],
                responses: {
                    en: [
                        'Our inventory management system uses AI-powered demand forecasting and automated replenishment. We can help optimize your inventory levels and reduce carrying costs.',
                        'Key inventory metrics include turnover rate, carrying costs, stockout frequency, and demand variability. Which metric would you like to improve?',
                        'Our SCA Central VoS Bank provides real-time inventory insights and optimization recommendations. Would you like me to guide you through the key features?'
                    ],
                    cn: [
                        '我们的库存管理系统使用AI驱动的需求预测和自动补货。我们可以帮助优化您的库存水平并降低持有成本。',
                        '关键库存指标包括周转率、持有成本、缺货频率和需求变异性。您希望改善哪个指标？',
                        '我们的SCA中央VoS银行提供实时库存洞察和优化建议。您希望我为您介绍主要功能吗？'
                    ]
                }
            },

            automation: {
                keywords: ['自动化', 'automation', 'ai', '人工智能', 'artificial intelligence'],
                responses: {
                    en: [
                        'Our automation solutions include robotic process automation (RPA), AI-powered decision making, and predictive analytics. These tools help reduce manual work and improve accuracy.',
                        'AI agents in our system handle routine tasks, predict demand patterns, and provide real-time recommendations. What automation challenge are you facing?',
                        'We use machine learning for demand forecasting, route optimization, and quality control. Which area would benefit most from automation in your operations?'
                    ],
                    cn: [
                        '我们的自动化解决方案包括机器人流程自动化(RPA)、AI驱动的决策制定和预测分析。这些工具有助于减少手工工作并提高准确性。',
                        '我们系统中的AI代理处理日常任务、预测需求模式并提供实时建议。您面临什么自动化挑战？',
                        '我们使用机器学习进行需求预测、路线优化和质量控制。您的运营中哪个领域最能从自动化中受益？'
                    ]
                }
            }
        };
    }

    // 智能回复生成
    async generateResponse(message) {
        const language = this.detectLanguage(message);
        const context = this.analyzeContext(message);
        const intent = this.detectIntent(message, context);
        
        // 记录对话历史
        this.conversationHistory.push({
            message: message,
            timestamp: new Date(),
            language: language,
            intent: intent
        });

        // 生成个性化回复
        let response = this.generatePersonalizedResponse(intent, language, context);
        
        // 学习用户偏好
        this.updateLearningData(message, intent, language);
        
        return response;
    }

    // 检测语言
    detectLanguage(message) {
        const chinesePattern = /[\u4e00-\u9fff]/;
        return chinesePattern.test(message) ? 'cn' : 'en';
    }

    // 分析上下文
    analyzeContext(message) {
        const recentHistory = this.conversationHistory.slice(-3);
        return {
            recentTopics: recentHistory.map(h => h.intent),
            messageLength: message.length,
            questionType: this.detectQuestionType(message),
            urgency: this.detectUrgency(message)
        };
    }

    // 检测意图
    detectIntent(message, context) {
        const lowerMessage = message.toLowerCase();
        
        // 检查知识库匹配
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return category;
            }
        }

        // 基于上下文推断意图
        if (context.recentTopics.length > 0) {
            return context.recentTopics[context.recentTopics.length - 1];
        }

        return 'general';
    }

    // 生成个性化回复
    generatePersonalizedResponse(intent, language, context) {
        if (this.knowledgeBase[intent]) {
            const responses = this.knowledgeBase[intent].responses[language];
            let response = responses[Math.floor(Math.random() * responses.length)];
            
            // 根据用户偏好调整回复
            if (this.userPreferences.preferDetailed && Math.random() > 0.5) {
                response += this.getDetailedAddition(intent, language);
            }
            
            return response;
        }

        // 默认智能回复
        return this.getDefaultResponse(language, context);
    }

    // 获取详细补充信息
    getDetailedAddition(intent, language) {
        const additions = {
            logistics: {
                en: ' Our logistics network processes over 1 billion packages annually with 99.9% accuracy.',
                cn: ' 我们的物流网络每年处理超过10亿个包裹，准确率达99.9%。'
            },
            inventory: {
                en: ' Our AI models can predict demand with 95% accuracy up to 6 months in advance.',
                cn: ' 我们的AI模型可以提前6个月预测需求，准确率达95%。'
            },
            automation: {
                en: ' Our automation solutions have helped clients reduce operational costs by up to 40%.',
                cn: ' 我们的自动化解决方案帮助客户降低运营成本高达40%。'
            }
        };
        
        return additions[intent] ? additions[intent][language] : '';
    }

    // 默认智能回复
    getDefaultResponse(language, context) {
        const defaultResponses = {
            en: [
                "That's an interesting question about our logistics operations. Based on our expertise, I'd recommend exploring our comprehensive resources. Could you provide more specific details about your challenge?",
                "I understand you're looking for information related to our services. Our platform offers extensive capabilities in logistics, automation, and AI solutions. What specific aspect interests you most?",
                "Great question! Our team has extensive experience with similar challenges. Let me help you find the most relevant solution. What's your primary objective?"
            ],
            cn: [
                "这是一个关于我们物流运营的有趣问题。基于我们的专业知识，我建议探索我们的综合资源。您能提供更多关于您挑战的具体细节吗？",
                "我理解您正在寻找与我们服务相关的信息。我们的平台在物流、自动化和AI解决方案方面提供广泛的功能。您对哪个具体方面最感兴趣？",
                "很好的问题！我们的团队在类似挑战方面有丰富经验。让我帮您找到最相关的解决方案。您的主要目标是什么？"
            ]
        };
        
        return defaultResponses[language][Math.floor(Math.random() * defaultResponses[language].length)];
    }

    // 保存用户偏好
    saveUserPreferences() {
        localStorage.setItem('chatbot_preferences', JSON.stringify(this.userPreferences));
    }

    // 加载用户偏好
    loadUserPreferences() {
        const saved = localStorage.getItem('chatbot_preferences');
        return saved ? JSON.parse(saved) : {
            preferDetailed: false,
            preferredLanguage: 'auto',
            interactionCount: 0
        };
    }

    // 更新学习数据
    updateLearningData(message, intent, language) {
        this.userPreferences.interactionCount++;
        
        // 学习用户偏好
        if (message.length > 50) {
            this.userPreferences.preferDetailed = true;
        }
        
        this.saveUserPreferences();
    }

    // 检测问题类型
    detectQuestionType(message) {
        if (message.includes('?') || message.includes('？')) return 'question';
        if (message.includes('help') || message.includes('帮助')) return 'help_request';
        if (message.includes('how') || message.includes('怎么')) return 'how_to';
        return 'statement';
    }

    // 检测紧急程度
    detectUrgency(message) {
        const urgentWords = ['urgent', '紧急', 'asap', '立即', 'immediately', '马上'];
        return urgentWords.some(word => message.toLowerCase().includes(word));
    }
}

// 导出增强聊天机器人
window.EnhancedFreeChatBot = EnhancedFreeChatBot;
