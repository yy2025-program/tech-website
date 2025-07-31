// 修复版智能聊天机器人 - 确保中文支持和智能回复
class FixedSmartChatBot {
    constructor() {
        this.conversationHistory = [];
        this.userPreferences = this.loadUserPreferences();
        this.initializeKnowledgeBase();
        console.log('✅ 修复版智能聊天机器人已初始化');
    }

    initializeKnowledgeBase() {
        this.knowledgeBase = {
            // 问候语
            greetings: {
                keywords: ['你好', '您好', 'hello', 'hi', '嗨', '早上好', '下午好', '晚上好'],
                responses: {
                    cn: [
                        '您好！我是您的AI物流助手，专门协助FMS物流运营。我可以帮助您了解库存管理、配送优化、自动化解决方案等。请问有什么可以为您服务的？',
                        '您好！欢迎使用智能物流助手。我具备深度学习能力，可以为您提供个性化的物流解决方案。今天想了解哪方面的内容？',
                        '您好！我是专业的FMS物流AI顾问。无论是供应链优化、仓储管理还是配送策略，我都能为您提供专业建议。请告诉我您的需求。'
                    ],
                    en: [
                        'Hello! I\'m your AI logistics assistant, specialized in FMS operations. I can help you with inventory management, delivery optimization, automation solutions, and more. How can I assist you today?',
                        'Hello! Welcome to the intelligent logistics assistant. I have deep learning capabilities and can provide personalized logistics solutions. What would you like to learn about today?',
                        'Hello! I\'m a professional FMS logistics AI consultant. Whether it\'s supply chain optimization, warehouse management, or delivery strategies, I can provide expert advice. Please tell me your needs.'
                    ]
                }
            },

            // 物流相关
            logistics: {
                keywords: ['物流', 'logistics', 'fms', '供应链', 'supply chain', '配送', 'delivery'],
                responses: {
                    cn: [
                        'FMS物流是亚马逊的核心竞争力之一。我们的系统每天处理数百万订单，使用AI驱动的需求预测、智能库存分配和动态路线优化。具体您想了解哪个环节？',
                        '现代物流依靠数据驱动的决策。我们的FMS系统集成了机器学习算法，可以预测需求波动、优化库存水位、减少配送成本。您对哪个方面最感兴趣？',
                        '物流优化是一个系统工程，涉及预测、计划、执行和监控。我们使用先进的算法来平衡成本、速度和服务质量。您希望深入了解哪个具体领域？'
                    ],
                    en: [
                        'FMS logistics is one of Amazon\'s core competitive advantages. Our system processes millions of orders daily, using AI-driven demand forecasting, intelligent inventory allocation, and dynamic route optimization. Which aspect would you like to explore?',
                        'Modern logistics relies on data-driven decisions. Our FMS system integrates machine learning algorithms to predict demand fluctuations, optimize inventory levels, and reduce delivery costs. What aspect interests you most?',
                        'Logistics optimization is a systematic engineering process involving forecasting, planning, execution, and monitoring. We use advanced algorithms to balance cost, speed, and service quality. Which specific area would you like to dive into?'
                    ]
                }
            },

            // 库存管理
            inventory: {
                keywords: ['库存', 'inventory', '仓储', 'warehouse', '存货', 'stock'],
                responses: {
                    cn: [
                        '智能库存管理是FMS的核心功能。我们使用机器学习预测需求，动态调整安全库存，实现99.5%的库存准确率。系统可以自动识别滞销品、快销品，并提供补货建议。您想了解哪个具体功能？',
                        '我们的库存优化算法考虑了季节性、促销活动、供应商交期等100多个变量。通过实时数据分析，可以将库存周转率提升30%，同时保持高服务水平。需要我详细介绍某个方面吗？',
                        '现代仓储管理结合了RFID、IoT传感器和AI算法。我们可以实时跟踪每件商品的位置、状态和移动轨迹，实现零差错的库存管理。您对哪种技术最感兴趣？'
                    ],
                    en: [
                        'Intelligent inventory management is a core FMS function. We use machine learning to predict demand, dynamically adjust safety stock, and achieve 99.5% inventory accuracy. The system automatically identifies slow-moving and fast-moving items and provides replenishment recommendations. Which specific function would you like to learn about?',
                        'Our inventory optimization algorithms consider over 100 variables including seasonality, promotions, and supplier lead times. Through real-time data analysis, we can improve inventory turnover by 30% while maintaining high service levels. Would you like me to detail any specific aspect?',
                        'Modern warehouse management combines RFID, IoT sensors, and AI algorithms. We can track the location, status, and movement trajectory of every item in real-time, achieving zero-error inventory management. Which technology interests you most?'
                    ]
                }
            },

            // 自动化
            automation: {
                keywords: ['自动化', 'automation', 'ai', '人工智能', 'artificial intelligence', '机器人', 'robot'],
                responses: {
                    cn: [
                        '我们的自动化解决方案涵盖整个物流链条：从智能分拣机器人到无人配送车，从AI客服到预测性维护。这些技术帮助我们提高效率40%，降低错误率90%。您对哪种自动化技术最感兴趣？',
                        'AI在物流中的应用非常广泛：需求预测、路径优化、异常检测、质量控制等。我们的机器学习模型每天处理TB级数据，不断优化决策。想了解具体的AI应用场景吗？',
                        '自动化不仅仅是机器替代人工，更重要的是智能决策。我们的系统可以自主学习、适应变化、优化流程。这种认知自动化正在重塑整个物流行业。您希望深入了解哪个方面？'
                    ],
                    en: [
                        'Our automation solutions cover the entire logistics chain: from intelligent sorting robots to autonomous delivery vehicles, from AI customer service to predictive maintenance. These technologies help us improve efficiency by 40% and reduce error rates by 90%. Which automation technology interests you most?',
                        'AI applications in logistics are extensive: demand forecasting, route optimization, anomaly detection, quality control, etc. Our machine learning models process terabytes of data daily, continuously optimizing decisions. Would you like to learn about specific AI application scenarios?',
                        'Automation is not just about machines replacing humans, but more importantly about intelligent decision-making. Our systems can learn autonomously, adapt to changes, and optimize processes. This cognitive automation is reshaping the entire logistics industry. Which aspect would you like to explore in depth?'
                    ]
                }
            },

            // 帮助
            help: {
                keywords: ['帮助', 'help', '功能', 'function', '能做什么', 'what can you do'],
                responses: {
                    cn: [
                        '我是专业的FMS物流AI助手，可以为您提供以下服务：\n📦 库存管理优化建议\n🚚 配送路线规划\n🤖 自动化解决方案\n📊 数据分析和预测\n💡 最佳实践分享\n🔧 问题诊断和解决\n\n请告诉我您具体需要什么帮助？',
                        '我具备以下核心能力：\n🧠 智能对话和理解\n📈 数据分析和洞察\n🎯 个性化建议生成\n🔄 持续学习优化\n🌐 多语言支持\n⚡ 实时响应\n\n您可以向我咨询任何物流相关的问题！',
                        '作为您的AI物流顾问，我可以：\n✅ 分析您的物流挑战\n✅ 提供定制化解决方案\n✅ 分享行业最佳实践\n✅ 协助决策制定\n✅ 持续优化建议\n\n请描述您遇到的具体问题或需求。'
                    ],
                    en: [
                        'I\'m a professional FMS logistics AI assistant that can provide the following services:\n📦 Inventory management optimization advice\n🚚 Delivery route planning\n🤖 Automation solutions\n📊 Data analysis and forecasting\n💡 Best practice sharing\n🔧 Problem diagnosis and resolution\n\nPlease tell me what specific help you need?',
                        'I have the following core capabilities:\n🧠 Intelligent dialogue and understanding\n📈 Data analysis and insights\n🎯 Personalized recommendation generation\n🔄 Continuous learning optimization\n🌐 Multi-language support\n⚡ Real-time response\n\nYou can consult me about any logistics-related questions!',
                        'As your AI logistics consultant, I can:\n✅ Analyze your logistics challenges\n✅ Provide customized solutions\n✅ Share industry best practices\n✅ Assist in decision-making\n✅ Provide continuous optimization suggestions\n\nPlease describe the specific problems or needs you encounter.'
                    ]
                }
            }
        };
    }

    // 检测语言
    detectLanguage(message) {
        const chinesePattern = /[\u4e00-\u9fff]/;
        const hasChinese = chinesePattern.test(message);
        console.log(`语言检测: "${message}" -> ${hasChinese ? '中文' : '英文'}`);
        return hasChinese ? 'cn' : 'en';
    }

    // 智能回复生成
    async generateResponse(message) {
        console.log('🤖 开始生成智能回复:', message);
        
        // 检测语言
        const language = this.detectLanguage(message);
        console.log('🌐 检测到语言:', language);
        
        // 记录对话历史
        this.conversationHistory.push({
            message: message,
            timestamp: new Date(),
            language: language
        });

        // 模拟思考时间
        await this.delay(800 + Math.random() * 1200);

        // 查找匹配的知识库
        const lowerMessage = message.toLowerCase();
        
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            console.log(`🔍 检查分类: ${category}`);
            
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                console.log(`✅ 匹配到分类: ${category}`);
                const responses = data.responses[language];
                const response = responses[Math.floor(Math.random() * responses.length)];
                console.log('📤 返回回复:', response);
                return response;
            }
        }

        // 默认智能回复
        console.log('🔄 使用默认回复');
        const defaultResponses = {
            cn: [
                '这是一个很有意思的问题！基于我对FMS物流的深度理解，我建议我们可以从多个角度来分析这个问题。您能提供更多具体的背景信息吗？这样我可以给出更精准的建议。',
                '我正在分析您的问题。根据我的专业知识，这个问题涉及到物流运营的多个层面。为了给您最有价值的建议，请告诉我您最关心的是哪个方面？',
                '非常好的问题！我的AI分析显示这个话题有很多值得探讨的角度。基于我在FMS物流领域的专业知识，我可以为您提供详细的分析和建议。您希望我从哪个角度开始？'
            ],
            en: [
                'That\'s a very interesting question! Based on my deep understanding of FMS logistics, I suggest we can analyze this issue from multiple perspectives. Could you provide more specific background information? This way I can give more precise recommendations.',
                'I\'m analyzing your question. According to my professional knowledge, this issue involves multiple levels of logistics operations. To give you the most valuable advice, please tell me which aspect you\'re most concerned about?',
                'Excellent question! My AI analysis shows this topic has many angles worth exploring. Based on my expertise in FMS logistics, I can provide detailed analysis and recommendations. Which angle would you like me to start with?'
            ]
        };

        const response = defaultResponses[language][Math.floor(Math.random() * defaultResponses[language].length)];
        console.log('📤 返回默认回复:', response);
        return response;
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 加载用户偏好
    loadUserPreferences() {
        const saved = localStorage.getItem('chatbot_preferences');
        return saved ? JSON.parse(saved) : {
            preferredLanguage: 'auto',
            interactionCount: 0
        };
    }
}

// 确保全局可用
window.FixedSmartChatBot = FixedSmartChatBot;
console.log('✅ FixedSmartChatBot 类已加载');
