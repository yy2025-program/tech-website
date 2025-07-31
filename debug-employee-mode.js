// 简化的Amazon员工模式调试版本
console.log('🔧 调试版Amazon员工模式开始加载...');

// 立即显示调试信息
function showDebugInfo() {
    console.log('📊 调试信息:');
    console.log('- 当前URL:', window.location.href);
    console.log('- 页面加载状态:', document.readyState);
    console.log('- 聊天按钮存在:', !!document.getElementById('chat-button'));
    console.log('- AMAZON_EMPLOYEE_MODE:', window.AMAZON_EMPLOYEE_MODE);
}

// 强制显示员工模式指示器
function forceShowEmployeeIndicator() {
    console.log('🏢 强制显示员工模式指示器...');
    
    // 移除可能存在的旧指示器
    const oldIndicator = document.getElementById('employee-mode-indicator');
    if (oldIndicator) {
        oldIndicator.remove();
    }
    
    // 创建新指示器
    const indicator = document.createElement('div');
    indicator.id = 'employee-mode-indicator';
    indicator.innerHTML = '🏢 Amazon Employee Mode (Debug)';
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
        z-index: 99999 !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
        font-family: Arial, sans-serif !important;
    `;
    
    document.body.appendChild(indicator);
    console.log('✅ 员工模式指示器已强制显示');
}

// 强制替换聊天按钮
function forceReplaceButton() {
    console.log('🔄 强制替换聊天按钮...');
    
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
        console.log('✅ 找到聊天按钮，开始替换...');
        
        // 保存原始样式以便调试
        console.log('原始按钮文本:', chatButton.innerHTML);
        console.log('原始按钮样式:', chatButton.style.cssText);
        
        // 强制更新样式
        chatButton.innerHTML = '💬 Amazon Q Business (Internal)';
        chatButton.style.cssText = `
            background: linear-gradient(45deg, #FF9500, #FF6B35) !important;
            color: white !important;
            border: none !important;
            padding: 12px 24px !important;
            border-radius: 25px !important;
            font-weight: bold !important;
        `;
        chatButton.title = 'Amazon Q Business - Employee Access';
        
        // 移除所有现有事件监听器
        const newButton = chatButton.cloneNode(true);
        chatButton.parentNode.replaceChild(newButton, chatButton);
        
        // 添加新的点击事件
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Amazon员工按钮被点击！');
            
            // 直接打开Amazon Q Business
            const chatWindow = window.open(
                'https://ask.qbusiness.aws.dev/#/chat',
                'amazon-q-internal',
                'width=500,height=700,left=' + (window.screen.width - 550) + ',top=50,scrollbars=yes,resizable=yes'
            );
            
            if (chatWindow) {
                console.log('✅ Amazon Q Business窗口已打开');
            } else {
                alert('无法打开窗口，请检查浏览器弹窗设置');
            }
        });
        
        console.log('✅ 聊天按钮替换完成');
        return true;
    } else {
        console.log('❌ 未找到聊天按钮');
        return false;
    }
}

// 禁用原有聊天功能
function disableOriginalChat() {
    console.log('🚫 禁用原有聊天功能...');
    
    // 覆盖全局配置
    if (window.AMAZON_Q_CONFIG) {
        window.AMAZON_Q_CONFIG.useDemo = false;
        console.log('✅ 已禁用演示模式');
    }
    
    // 隐藏聊天面板
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) {
        chatPanel.style.display = 'none';
        console.log('✅ 已隐藏原有聊天面板');
    }
}

// 主初始化函数
function initDebugEmployeeMode() {
    console.log('🚀 开始初始化调试版员工模式...');
    
    showDebugInfo();
    forceShowEmployeeIndicator();
    disableOriginalChat();
    
    // 尝试替换按钮，如果失败则重试
    if (!forceReplaceButton()) {
        console.log('⏳ 按钮替换失败，1秒后重试...');
        setTimeout(() => {
            if (!forceReplaceButton()) {
                console.log('⏳ 再次失败，3秒后最后重试...');
                setTimeout(forceReplaceButton, 3000);
            }
        }, 1000);
    }
    
    console.log('🎉 调试版员工模式初始化完成！');
}

// 多种方式确保初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebugEmployeeMode);
} else {
    initDebugEmployeeMode();
}

// 额外的延迟初始化
setTimeout(initDebugEmployeeMode, 1000);
setTimeout(initDebugEmployeeMode, 3000);

// 全局调试函数
window.debugEmployeeMode = initDebugEmployeeMode;
window.forceShowIndicator = forceShowEmployeeIndicator;
window.forceReplaceButton = forceReplaceButton;

console.log('🔧 调试版Amazon员工模式加载完成！');
console.log('💡 可以在控制台运行以下命令进行调试:');
console.log('- debugEmployeeMode() // 重新初始化');
console.log('- forceShowIndicator() // 强制显示指示器');
console.log('- forceReplaceButton() // 强制替换按钮');
