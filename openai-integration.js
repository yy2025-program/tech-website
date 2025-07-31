// OpenAI API 集成方案 - 真正的AI对话
class OpenAIChatBot {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo'; // 最便宜的模型
        this.conversationHistory = [];
        this.systemPrompt = this.createSystemPrompt();
        console.log('🤖 OpenAI ChatBot 已初始化');
    }

    createSystemPrompt() {
        return `你是一个专业的FMS物流AI助手，具有以下特点：

1. 专业知识：深度了解亚马逊FMS物流运营、供应链管理、库存优化、配送网络等
2. 技术能力：熟悉AI、机器学习、自动化、数据分析在物流中的应用
3. 语言能力：能够流畅地使用中文和英文进行专业对话
4. 回复风格：专业、详细、有条理，提供实用的建议和解决方案

请根据用户的问题提供专业、准确、有价值的回复。如果用户使用中文提问，请用中文回复；如果使用英文，请用英文回复。`;
    }

    async generateResponse(message) {
        try {
            console.log('🚀 调用OpenAI API:', message);

            // 构建对话历史
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...this.conversationHistory,
                { role: 'user', content: message }
            ];

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // 更新对话历史
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            );

            // 保持对话历史在合理长度
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-8);
            }

            console.log('✅ OpenAI 回复:', aiResponse);
            return aiResponse;

        } catch (error) {
            console.error('❌ OpenAI API 错误:', error);
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const language = /[\u4e00-\u9fff]/.test(message) ? 'cn' : 'en';
        
        if (language === 'cn') {
            return '抱歉，我暂时无法连接到AI服务。不过我仍然可以为您提供FMS物流方面的基础帮助。请告诉我您的具体问题，我会尽力协助您。';
        } else {
            return 'Sorry, I temporarily cannot connect to the AI service. However, I can still provide basic help with FMS logistics. Please tell me your specific question and I\'ll do my best to assist you.';
        }
    }
}

// 使用说明
console.log(`
🤖 OpenAI ChatBot 使用说明:

1. 获取OpenAI API Key:
   - 访问: https://platform.openai.com/api-keys
   - 创建新的API Key
   - 注意: 新用户有$5免费额度

2. 初始化:
   const chatBot = new OpenAIChatBot('your-api-key');

3. 使用:
   const response = await chatBot.generateResponse('你的问题');

💰 费用说明:
- GPT-3.5-turbo: $0.002/1K tokens
- 新用户免费额度: $5
- 大约可以进行2500次对话
`);

window.OpenAIChatBot = OpenAIChatBot;
