// Language switching functionality
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en';
        this.langToggle = document.getElementById('lang-toggle');
        this.init();
    }
    
    init() {
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        this.updateContent();
        this.updateToggleButton();
    }
    
    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'cn' : 'en';
        this.updateContent();
        this.updateToggleButton();
    }
    
    updateContent() {
        const elements = document.querySelectorAll('[data-en][data-cn]');
        elements.forEach(element => {
            const text = this.currentLang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-cn');
            if (text) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }
    
    updateToggleButton() {
        if (this.langToggle) {
            this.langToggle.textContent = this.currentLang === 'en' ? 'CN' : 'EN';
        }
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close dropdown menus after clicking
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
});

// Dropdown menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const content = dropdown.querySelector('.dropdown-content');
        
        // Mobile touch support
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.dropdown-content').style.display = 'none';
                }
            });
            
            // Toggle current dropdown
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                content.style.display = 'none';
            }
        });
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
});

// Amazon Q Chat Widget with API Integration
class AmazonQChatWidget {
    constructor() {
        this.chatButton = document.getElementById('chat-button');
        this.chatPanel = document.getElementById('chat-panel');
        this.chatClose = document.getElementById('chat-close');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatStatus = document.getElementById('chat-status');
        this.scrollToBottomBtn = document.getElementById('scroll-to-bottom');
        
        this.isOpen = false;
        this.conversationId = this.generateConversationId();
        this.config = window.AMAZON_Q_CONFIG || {};
        
        // 初始化增强聊天机器人
        this.enhancedBot = (window.USE_ENHANCED_CHAT && window.EnhancedChatBot) ? 
            new window.EnhancedChatBot() : null;
        
        this.init();
    }
    
    init() {
        // Toggle chat panel
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Scroll to bottom button
        if (this.scrollToBottomBtn) {
            this.scrollToBottomBtn.addEventListener('click', () => this.scrollToBottom());
        }
        
        // Monitor scroll position to show/hide scroll button
        this.chatMessages.addEventListener('scroll', () => this.handleScroll());
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatPanel.contains(e.target) && !this.chatButton.contains(e.target)) {
                this.closeChat();
            }
        });
        
        // Initialize welcome message
        this.updateWelcomeMessage();
    }
    
    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.chatPanel.classList.add('active');
        this.isOpen = true;
        this.chatInput.focus();
    }
    
    closeChat() {
        this.chatPanel.classList.remove('active');
        this.isOpen = false;
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Call Amazon Q API or demo response
            const response = await this.callAmazonQAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot', true);
            console.error('Amazon Q API Error:', error);
        }
    }
    
    async callAmazonQAPI(message) {
        // Check if using demo mode or real API
        if (this.config.useDemo) {
            return await this.getDemoResponse(message);
        } else {
            return await this.getRealAmazonQResponse(message);
        }
    }
    
    async getRealAmazonQResponse(message) {
        // Real Amazon Q API integration
        try {
            const apiEndpoint = this.config.apiEndpoint || '/api/amazon-q/chat';
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: this.conversationId,
                    userId: 'logistics-hub-user'
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update conversation ID if provided
            if (data.conversationId) {
                this.conversationId = data.conversationId;
            }
            
            return data.message || 'I apologize, but I couldn\'t process your request right now.';
            
        } catch (error) {
            console.error('Amazon Q API call failed:', error);
            
            // Provide user-friendly error messages
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Unable to connect to Amazon Q service. Please check your internet connection.');
            } else if (error.message.includes('Access denied')) {
                throw new Error('Access denied to Amazon Q service. Please contact your administrator.');
            } else {
                throw new Error(`Amazon Q service error: ${error.message}`);
            }
        }
    }
    
    async getDemoResponse(message) {
        // Enhanced demo responses for FMS logistics with Chinese support
        await this.delay(1000 + Math.random() * 2000); // Simulate API delay
        
        // Check current language
        const langSwitcher = document.querySelector('.lang-btn');
        const isEnglish = !langSwitcher || langSwitcher.textContent === 'CN';
        
        const responses = {
            // FMS specific responses - English & Chinese
            'fms|物流': isEnglish ? 
                'FMS (Fulfillment by Amazon) is our comprehensive logistics solution. I can help you with inventory management, shipping processes, seller resources, and operational best practices. What specific area would you like to explore?' :
                'FMS（亚马逊物流）是我们的综合物流解决方案。我可以帮助您了解库存管理、配送流程、卖家资源和运营最佳实践。您想探索哪个具体领域？',
            
            'inventory|库存': isEnglish ?
                'For inventory management in FMS, I recommend checking our SCA Central VoS Bank for the latest inventory optimization strategies. You can also access real-time inventory tracking through our internal dashboards. Would you like me to guide you to specific resources?' :
                '对于FMS的库存管理，我建议查看我们的SCA中央VoS银行以获取最新的库存优化策略。您还可以通过我们的内部仪表板访问实时库存跟踪。您希望我为您指导具体资源吗？',
            
            'shipping|配送|运输': isEnglish ?
                'Our shipping processes are optimized for efficiency and cost-effectiveness. Key areas include: 1) Inbound shipping protocols, 2) Outbound delivery optimization, 3) Cross-docking procedures. Which shipping aspect interests you most?' :
                '我们的配送流程经过优化，注重效率和成本效益。关键领域包括：1）入库配送协议，2）出库配送优化，3）交叉转运程序。您对哪个配送方面最感兴趣？',
            
            'seller|卖家': isEnglish ?
                'For seller-facing resources, we have comprehensive support materials including: seller learning intake forms, work plans, and troubleshooting guides. You can access these through the FMS Seller Facing Resources menu. Need help with a specific seller issue?' :
                '对于面向卖家的资源，我们有全面的支持材料，包括：卖家学习表单、工作计划和故障排除指南。您可以通过FMS卖家资源菜单访问这些资源。需要帮助解决特定的卖家问题吗？',
            
            'automation|自动化': isEnglish ?
                'Our data and automation tools include advanced analytics for demand forecasting, automated inventory replenishment, and process optimization algorithms. These tools help reduce manual work and improve accuracy. What automation challenge are you facing?' :
                '我们的数据和自动化工具包括需求预测的高级分析、自动库存补充和流程优化算法。这些工具有助于减少手工工作并提高准确性。您面临什么自动化挑战？',
            
            'ai agent|ai代理|人工智能': isEnglish ?
                'Our AI Agent solutions focus on intelligent automation, predictive analytics, and smart decision support. These AI-powered systems help optimize logistics operations, predict demand patterns, and provide real-time recommendations. Which AI capability interests you most?' :
                '我们的AI代理解决方案专注于智能自动化、预测分析和智能决策支持。这些AI驱动的系统有助于优化物流运营、预测需求模式并提供实时建议。您对哪种AI能力最感兴趣？',
            
            'gemba walk|现场走访': isEnglish ?
                'Gemba walks are essential for understanding actual processes. Our methodology includes: 1) Structured observation techniques, 2) Systematic data collection, 3) Action planning based on findings. Would you like guidance on conducting effective gemba walks?' :
                'Gemba走访对于理解实际流程至关重要。我们的方法包括：1）结构化观察技术，2）系统性数据收集，3）基于发现的行动计划。您希望获得进行有效gemba走访的指导吗？',
            
            'help|帮助': isEnglish ?
                'I can assist you with FMS logistics operations including: inventory management, shipping processes, seller support, automation tools, AI agents, gemba walk methodology, and domain expertise. What would you like to explore?' :
                '我可以协助您处理FMS物流运营，包括：库存管理、配送流程、卖家支持、自动化工具、AI代理、gemba走访方法和领域专业知识。您想探索什么？',
            
            'hello|你好|您好|hi': isEnglish ?
                'Hello! I\'m Amazon Q, specialized in FMS logistics operations. I can help you navigate our internal resources, understand AI agents, and solve operational challenges. What brings you here today?' :
                '您好！我是Amazon Q，专门从事FMS物流运营。我可以帮助您导航我们的内部资源、了解AI代理并解决运营挑战。今天是什么带您来这里的？',
            
            'thank|谢谢|感谢': isEnglish ?
                'You\'re welcome! I\'m here to help with any FMS logistics questions or challenges you might have. Feel free to ask about our resources, processes, or AI agents anytime.' :
                '不客气！我在这里帮助您解决任何FMS物流问题或挑战。随时可以询问我们的资源、流程或AI代理。',
            
            // Default responses
            'default': isEnglish ? [
                'That\'s an interesting question about FMS operations. Based on our logistics expertise, I\'d recommend checking our internal resources or consulting with domain experts. Could you provide more specific details about your challenge?',
                'I understand you\'re looking for information related to FMS logistics. Our comprehensive resources include operational guides, AI agents, and expert insights. What specific aspect would you like me to help you with?',
                'For complex FMS logistics questions like this, I suggest reviewing our work plans and AI agent documentation. Our domain members have extensive experience with similar challenges. Would you like me to direct you to specific resources?'
            ] : [
                '这是一个关于FMS运营的有趣问题。基于我们的物流专业知识，我建议查看我们的内部资源或咨询领域专家。您能提供更多关于您挑战的具体细节吗？',
                '我理解您正在寻找与FMS物流相关的信息。我们的综合资源包括运营指南、AI代理和专家见解。您希望我在哪个具体方面帮助您？',
                '对于这样复杂的FMS物流问题，我建议查看我们的工作计划和AI代理文档。我们的领域成员在类似挑战方面有丰富经验。您希望我为您指向特定资源吗？'
            ]
        };
        
        // Find best matching response with Chinese keyword support
        const lowerMessage = message.toLowerCase();
        let response = null;
        
        for (const [key, value] of Object.entries(responses)) {
            if (key !== 'default') {
                // Split key by | to support multiple keywords (English|Chinese)
                const keywords = key.split('|');
                if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                    response = value;
                    break;
                }
            }
        }
        
        // Use default response if no match found
        if (!response) {
            const defaultResponses = responses.default;
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        return response;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showTypingIndicator() {
        this.chatStatus.innerHTML = `
            <div class="typing-indicator">
                Amazon Q is typing
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.chatStatus.className = 'chat-status show typing';
    }
    
    hideTypingIndicator() {
        this.chatStatus.classList.remove('show', 'typing');
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `message-content ${isError ? 'error-message' : ''}`;
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // Enhanced scroll to bottom with smooth animation
        this.scrollToBottom();
        
        // Add fade-in animation for new messages
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }
    
    scrollToBottom() {
        // Smooth scroll to bottom
        this.chatMessages.scrollTo({
            top: this.chatMessages.scrollHeight,
            behavior: 'smooth'
        });
        
        // Fallback for browsers that don't support smooth scrolling
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    handleScroll() {
        if (!this.scrollToBottomBtn) return;
        
        const { scrollTop, scrollHeight, clientHeight } = this.chatMessages;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        // Show button when not at bottom, hide when at bottom
        if (isNearBottom) {
            this.scrollToBottomBtn.style.display = 'none';
        } else {
            this.scrollToBottomBtn.style.display = 'block';
        }
    }
    
    updateWelcomeMessage() {
        // Update welcome message based on current language
        const welcomeMessage = document.querySelector('.bot-message .message-content p');
        if (welcomeMessage) {
            const langSwitcher = document.querySelector('.lang-btn');
            const isEnglish = !langSwitcher || langSwitcher.textContent === 'CN';
            
            if (isEnglish) {
                welcomeMessage.textContent = '👋 Hello! I\'m Amazon Q, your AI assistant. How can I help you with FMS logistics today?';
            } else {
                welcomeMessage.textContent = '👋 您好！我是Amazon Q，您的AI助手。今天我可以如何帮助您处理FMS物流问题？';
            }
        }
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .service-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize chat widget
    new AmazonQChatWidget();
});

// Particle effect for hero section
class ParticleEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }
    
    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        const hero = document.querySelector('.hero');
        hero.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const hero = document.querySelector('.hero');
        this.canvas.width = hero.offsetWidth;
        this.canvas.height = hero.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleEffect();
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Add hover effects to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add breadcrumb navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item:not(.active)');
    
    breadcrumbItems.forEach(item => {
        item.addEventListener('click', () => {
            // Simulate navigation - in a real app, this would navigate to different pages
            console.log(`Navigating to: ${item.textContent}`);
            
            // Add visual feedback
            item.style.color = '#667eea';
            setTimeout(() => {
                item.style.color = '#cccccc';
            }, 200);
        });
    });
});
