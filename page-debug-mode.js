// 页面调试版本 - 直接在页面上显示调试信息
console.log('📄 页面调试版本开始加载...');

// 创建调试信息显示面板
function createDebugPanel() {
    // 移除可能存在的旧面板
    const oldPanel = document.getElementById('debug-panel');
    if (oldPanel) {
        oldPanel.remove();
    }
    
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed !important;
        top: 50px !important;
        right: 10px !important;
        width: 300px !important;
        max-height: 400px !important;
        background: rgba(0, 0, 0, 0.9) !important;
        color: #00ff00 !important;
        padding: 15px !important;
        border-radius: 10px !important;
        font-family: monospace !important;
        font-size: 12px !important;
        z-index: 99999 !important;
        overflow-y: auto !important;
        border: 2px solid #00ff00 !important;
    `;
    
    debugPanel.innerHTML = `
        <div style="color: #ffff00; font-weight: bold; margin-bottom: 10px;">
            🔧 Amazon员工模式调试信息
        </div>
        <div id="debug-content">正在初始化...</div>
        <div style="margin-top: 10px;">
            <button onclick="window.forceInitEmployee()" style="background: #ff6600; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">强制初始化</button>
            <button onclick="document.getElementById('debug-panel').remove()" style="background: #ff0000; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 5px;">关闭</button>
        </div>
    `;
    
    document.body.appendChild(debugPanel);
    return debugPanel;
}

// 添加调试信息到面板
function addDebugInfo(message, type = 'info') {
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
        const colors = {
            info: '#00ff00',
            success: '#00ffff',
            error: '#ff0000',
            warning: '#ffff00'
        };
        
        const timestamp = new Date().toLocaleTimeString();
        debugContent.innerHTML += `
            <div style="color: ${colors[type]}; margin: 2px 0;">
                [${timestamp}] ${message}
            </div>
        `;
        
        // 滚动到底部
        debugContent.scrollTop = debugContent.scrollHeight;
    }
    
    // 同时输出到控制台
    console.log(message);
}

// 强制显示员工模式指示器
function forceShowEmployeeIndicator() {
    addDebugInfo('🏢 强制显示员工模式指示器...', 'info');
    
    // 移除可能存在的旧指示器
    const oldIndicator = document.getElementById('employee-mode-indicator');
    if (oldIndicator) {
        oldIndicator.remove();
    }
    
    // 创建新指示器
    const indicator = document.createElement('div');
    indicator.id = 'employee-mode-indicator';
    indicator.innerHTML = '🏢 Amazon Employee Mode';
    indicator.style.cssText = `
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        background: linear-gradient(45deg, #FF9500, #FF6B35) !important;
        color: white !important;
        padding: 8px 12px !important;
        border-radius: 20px !important;
        font-size: 12px !important;
        font-weight: bold !important;
        z-index: 99998 !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
        font-family: Arial, sans-serif !important;
    `;
    
    document.body.appendChild(indicator);
    addDebugInfo('✅ 员工模式指示器已显示', 'success');
}

// 强制替换聊天按钮
function forceReplaceButton() {
    addDebugInfo('🔄 查找聊天按钮...', 'info');
    
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
        addDebugInfo('✅ 找到聊天按钮，开始替换...', 'success');
        
        // 强制更新样式
        chatButton.innerHTML = '💬 Amazon Q Business (Internal)';
        chatButton.style.cssText = `
            background: linear-gradient(45deg, #FF9500, #FF6B35) !important;
            color: white !important;
            border: none !important;
            padding: 12px 24px !important;
            border-radius: 25px !important;
            font-weight: bold !important;
            cursor: pointer !important;
        `;
        chatButton.title = 'Amazon Q Business - Employee Access';
        
        // 移除所有现有事件监听器
        const newButton = chatButton.cloneNode(true);
        chatButton.parentNode.replaceChild(newButton, chatButton);
        
        // 添加新的点击事件
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addDebugInfo('🖱️ Amazon员工按钮被点击！', 'success');
            
            // 直接打开Amazon Q Business
            const chatWindow = window.open(
                'https://ask.qbusiness.aws.dev/#/chat',
                'amazon-q-internal',
                'width=500,height=700,left=' + (window.screen.width - 550) + ',top=50,scrollbars=yes,resizable=yes'
            );
            
            if (chatWindow) {
                addDebugInfo('✅ Amazon Q Business窗口已打开', 'success');
            } else {
                addDebugInfo('❌ 无法打开窗口，请检查浏览器弹窗设置', 'error');
            }
        });
        
        addDebugInfo('✅ 聊天按钮替换完成', 'success');
        return true;
    } else {
        addDebugInfo('❌ 未找到聊天按钮 (ID: chat-button)', 'error');
        
        // 列出页面上所有按钮
        const allButtons = document.querySelectorAll('button');
        addDebugInfo(`📋 页面上共有 ${allButtons.length} 个按钮`, 'info');
        
        return false;
    }
}

// 禁用原有聊天功能
function disableOriginalChat() {
    addDebugInfo('🚫 禁用原有聊天功能...', 'info');
    
    // 覆盖全局配置
    if (window.AMAZON_Q_CONFIG) {
        window.AMAZON_Q_CONFIG.useDemo = false;
        addDebugInfo('✅ 已禁用演示模式', 'success');
    } else {
        addDebugInfo('⚠️ 未找到AMAZON_Q_CONFIG', 'warning');
    }
    
    // 隐藏聊天面板
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) {
        chatPanel.style.display = 'none';
        addDebugInfo('✅ 已隐藏原有聊天面板', 'success');
    } else {
        addDebugInfo('⚠️ 未找到聊天面板', 'warning');
    }
}

// 主初始化函数
function forceInitEmployee() {
    addDebugInfo('🚀 开始强制初始化Amazon员工模式...', 'info');
    
    // 显示页面基本信息
    addDebugInfo(`📄 当前URL: ${window.location.href}`, 'info');
    addDebugInfo(`📄 页面标题: ${document.title}`, 'info');
    addDebugInfo(`📄 页面加载状态: ${document.readyState}`, 'info');
    
    forceShowEmployeeIndicator();
    disableOriginalChat();
    
    // 尝试替换按钮，如果失败则重试
    if (!forceReplaceButton()) {
        addDebugInfo('⏳ 按钮替换失败，1秒后重试...', 'warning');
        setTimeout(() => {
            if (!forceReplaceButton()) {
                addDebugInfo('⏳ 再次失败，3秒后最后重试...', 'warning');
                setTimeout(forceReplaceButton, 3000);
            }
        }, 1000);
    }
    
    addDebugInfo('🎉 Amazon员工模式初始化完成！', 'success');
}

// 页面加载完成后自动初始化
function initPageDebugMode() {
    // 创建调试面板
    createDebugPanel();
    addDebugInfo('📄 页面调试模式已启动', 'success');
    
    // 延迟初始化，确保页面完全加载
    setTimeout(() => {
        forceInitEmployee();
    }, 1000);
}

// 多种方式确保初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageDebugMode);
} else {
    initPageDebugMode();
}

// 额外的延迟初始化
setTimeout(initPageDebugMode, 2000);

// 全局函数
window.forceInitEmployee = forceInitEmployee;
window.createDebugPanel = createDebugPanel;

console.log('📄 页面调试版本加载完成！');
