// Language switching functionality
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en';
        this.langToggle = document.getElementById('lang-toggle');
        this.init();
    }
    
    init() {
        this.langToggle.addEventListener('click', () => this.toggleLanguage());
        this.updateContent();
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
                element.textContent = text;
            }
        });
    }
    
    updateToggleButton() {
        this.langToggle.textContent = this.currentLang === 'en' ? 'CN' : 'EN';
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

// Chat Widget Functionality
class ChatWidget {
    constructor() {
        this.chatButton = document.getElementById('chat-button');
        this.chatPanel = document.getElementById('chat-panel');
        this.chatClose = document.getElementById('chat-close');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.chatMessages = document.getElementById('chat-messages');
        
        this.isOpen = false;
        this.init();
    }
    
    init() {
        // Toggle chat panel
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatPanel.contains(e.target) && !this.chatButton.contains(e.target)) {
                this.closeChat();
            }
        });
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
    
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Simulate Amazon Q response
        setTimeout(() => {
            this.generateBotResponse(message);
        }, 1000);
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    generateBotResponse(userMessage) {
        const responses = {
            'hello': 'Hello! I\'m Amazon Q, your AI assistant. I can help you with FMS resources, data automation, and general technology inquiries.',
            '你好': '您好！我是Amazon Q，您的AI助手。我可以帮助您了解FMS资源、数据自动化和一般技术咨询。',
            'help': 'I can assist you with:\n• FMS Internal Resources\n• FMS Seller Facing Resources\n• Data and Automation tools\n• AI Amazon Q Web Assistant\n• Technical documentation',
            '帮助': '我可以为您提供以下帮助：\n• FMS内部资源\n• FMS卖家资源\n• 数据与自动化工具\n• AI Amazon Q网页助手\n• 技术文档',
            'fms': 'I can help you with FMS resources! We have both internal resources for team members and seller-facing resources. Which would you like to know more about?',
            'resources': 'Our main resource categories include:\n• FMS Internal Resources - for team members\n• FMS Seller Facing Resources - for sellers\n• Data and Automation - analytics tools\n• AI Amazon Q Web Assistant - intelligent support',
            '资源': '我们的主要资源类别包括：\n• FMS内部资源 - 面向团队成员\n• FMS卖家资源 - 面向卖家\n• 数据与自动化 - 分析工具\n• AI Amazon Q网页助手 - 智能支持',
            'automation': 'Our Data and Automation tools provide advanced analytics and process optimization. They help drive intelligent decision-making across FMS operations.',
            '自动化': '我们的数据与自动化工具提供先进的分析和流程优化功能，帮助推动FMS运营中的智能决策。',
            'documentation': 'We provide comprehensive documentation including:\n• API Documentation with examples\n• Training Resources and tutorials\n• Troubleshooting guides and FAQ',
            '文档': '我们提供全面的文档，包括：\n• 带示例的API文档\n• 培训资源和教程\n• 故障排除指南和常见问题解答',
            'amazon q': 'Amazon Q is an AI-powered assistant designed to help with FMS operations, providing intelligent responses and seamless integration with existing workflows.',
            'solutions': 'Our Amazon Q solutions include:\n• Intelligent Query Processing\n• Real-time Knowledge Base\n• Seamless Integration with existing systems'
        };
        
        let response = this.findBestResponse(userMessage.toLowerCase(), responses);
        
        if (!response) {
            response = 'I\'m Amazon Q, here to help with FMS resources and operations! Please let me know what specific area you\'d like assistance with - FMS resources, data automation, or technical documentation.';
        }
        
        this.addMessage(response, 'bot');
    }
    
    findBestResponse(message, responses) {
        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        return null;
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
    new ChatWidget();
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
