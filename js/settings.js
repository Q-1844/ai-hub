// 默认设置值
const DEFAULT_SETTINGS = {
    theme: {
        primaryColor: '#ff00ff',
        brightness: 0 // 0: 深黑 (#0a0a0f), 100: 柔和 (#1a1a2e)
    },
    history: {
        autoSave: true,
        retentionDays: 'permanent' // permanent, 30, 7, 1
    }
};

// 设置管理器类
class SettingsManager {
    constructor() {
        this.settings = {};
        this.modal = null;
        this.init();
    }

    // 初始化
    init() {
        // 读取设置
        this.loadSettings();
        // 应用初始设置
        this.applySettings();
        // 延迟创建弹窗元素，确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createModal();
                this.bindEvents();
            });
        } else {
            this.createModal();
            this.bindEvents();
        }
    }

    // 从localStorage加载设置
    loadSettings() {
        try {
            const saved = localStorage.getItem('aiHubSettings');
            if (saved) {
                this.settings = JSON.parse(saved);
            } else {
                this.settings = { ...DEFAULT_SETTINGS };
            }
        } catch (error) {
            console.error('加载设置失败:', error);
            this.settings = { ...DEFAULT_SETTINGS };
        }
    }

    // 保存设置到localStorage
    saveSettings() {
        try {
            localStorage.setItem('aiHubSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('保存设置失败:', error);
        }
    }

    // 应用所有设置
    applySettings() {
        this.applyThemeSettings();
        // 历史设置在需要时应用
    }

    // 应用主题设置
    applyThemeSettings() {
        const { primaryColor, brightness } = this.settings.theme;
        
        // 设置主色调CSS变量
        document.documentElement.style.setProperty('--primary', primaryColor);
        
        // 计算secondary颜色（基于primary的变体）
        const secondaryColor = this.calculateSecondaryColor(primaryColor);
        document.documentElement.style.setProperty('--secondary', secondaryColor);
        
        // 计算并设置背景色
        const darkBg = '#0a0a0f';
        const lightBg = '#2d2d44'; // 更亮的背景色，增大调节跨度
        const bgColor = this.interpolateColor(darkBg, lightBg, brightness / 100);
        
        // 更新CSS变量（可能被其他元素使用）
        document.body.style.setProperty('--bg-dark-400', bgColor);
        
        // 创建渐变背景：从计算的颜色到更亮的颜色，增大亮度跨度
        const gradientEndColor = this.interpolateColor(bgColor, '#3a3a55', 0.5);
        document.body.style.background = `linear-gradient(to bottom, ${bgColor}, ${gradientEndColor})`;
        document.body.style.backgroundAttachment = 'fixed';
    }

    // 颜色插值函数
    interpolateColor(color1, color2, factor) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        
        return this.rgbToHex(r, g, b);
    }

    // 计算secondary颜色（基于primary颜色）
    calculateSecondaryColor(primaryColor) {
        // 混合primary颜色和原secondary颜色(#ff2a6d)，保持协调的渐变
        // 因子0.6表示60%原secondary颜色，40%primary颜色
        return this.interpolateColor(primaryColor, '#ff2a6d', 0.6);
    }

    // 十六进制颜色转RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // RGB转十六进制颜色
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // 创建设置弹窗
    createModal() {
        if (this.modal) return;
        
        const modalHTML = `
            <div id="settings-modal" class="fixed inset-0 bg-black/50 hidden z-50">
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-dark-200 rounded-lg p-6 border border-primary/30 shadow-lg shadow-primary/20 backdrop-blur-sm">
                    <!-- 弹窗头部 -->
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gradient">设置</h3>
                        <button id="close-settings" class="p-2 hover:bg-white/10 rounded transition-colors">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- 主题与色彩设置 -->
                    <div class="mb-8">
                        <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                            <i class="fa fa-paint-brush"></i>
                            <span>🎨 主题与色彩</span>
                        </h4>
                        
                        <!-- 主色调选择器 -->
                        <div class="mb-6">
                            <label class="block text-light-200 text-sm mb-2">主色调</label>
                            <div class="flex items-center gap-4">
                                <input 
                                    type="color" 
                                    id="primary-color-picker" 
                                    class="w-12 h-12 rounded cursor-pointer border-2 border-white/20" 
                                    value="${this.settings.theme.primaryColor}"
                                >
                                <div 
                                    id="color-preview" 
                                    class="flex-1 py-2 px-4 bg-dark-100 rounded-lg border border-primary/30 text-center"
                                    style="color: ${this.settings.theme.primaryColor};"
                                >
                                    预览新颜色
                                </div>
                            </div>
                        </div>
                        
                        <!-- 界面亮度调节器 -->
                        <div>
                            <label class="block text-light-200 text-sm mb-2">界面亮度</label>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-light-300">暗黑</span>
                                <input 
                                    type="range" 
                                    id="brightness-slider" 
                                    class="flex-1 h-2 bg-dark-100 rounded-lg appearance-none cursor-pointer" 
                                    min="0" 
                                    max="100" 
                                    value="${this.settings.theme.brightness}"
                                >
                                <span class="text-xs text-light-300">柔和</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 历史与数据设置 -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                            <i class="fa fa-database"></i>
                            <span>🗃️ 历史与数据</span>
                        </h4>
                        
                        <!-- 自动保存开关 -->
                        <div class="mb-6">
                            <div class="flex justify-between items-center mb-2">
                                <label class="block text-light-200 text-sm">自动保存</label>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        id="auto-save-toggle" 
                                        class="sr-only peer" 
                                        ${this.settings.history.autoSave ? 'checked' : ''}
                                    >
                                    <div class="w-11 h-6 bg-dark-100 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/50"></div>
                                </label>
                            </div>
                            <p class="text-xs text-light-300">启用后，您的对话将自动保存</p>
                        </div>
                        
                        <!-- 历史保存期限 -->
                        <div>
                            <label class="block text-light-200 text-sm mb-2">历史保存期限</label>
                            <div class="flex items-center gap-3">
                                <select 
                                    id="retention-period" 
                                    class="flex-1 py-2 px-3 bg-dark-100 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-light-100"
                                    value="${this.settings.history.retentionDays}"
                                >
                                    <option value="permanent" ${this.settings.history.retentionDays === 'permanent' ? 'selected' : ''}>永久</option>
                                    <option value="30" ${this.settings.history.retentionDays === '30' ? 'selected' : ''}>30天</option>
                                    <option value="7" ${this.settings.history.retentionDays === '7' ? 'selected' : ''}>7天</option>
                                    <option value="1" ${this.settings.history.retentionDays === '1' ? 'selected' : ''}>1天</option>
                                </select>
                                ${this.settings.history.retentionDays !== 'permanent' ? `
                                    <button 
                                        id="clear-history-now" 
                                        class="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded hover:bg-red-500/30 text-sm transition-colors"
                                    >
                                        立即清理
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('settings-modal');
        
        // 绑定弹窗内部事件
        this.bindModalEvents();
    }

    // 绑定设置项事件
    bindModalEvents() {
        // 关闭按钮
        document.getElementById('close-settings').addEventListener('click', () => {
            this.hideModal();
        });
        
        // 点击弹窗外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
        
        // 主色调选择器
        document.getElementById('primary-color-picker').addEventListener('input', (e) => {
            const color = e.target.value;
            this.settings.theme.primaryColor = color;
            this.applyThemeSettings();
            this.saveSettings();
            
            // 更新预览
            document.getElementById('color-preview').style.color = color;
        });
        
        // 亮度滑块
        document.getElementById('brightness-slider').addEventListener('input', (e) => {
            const brightness = parseInt(e.target.value);
            this.settings.theme.brightness = brightness;
            this.applyThemeSettings();
            this.saveSettings();
        });
        
        // 自动保存开关
        document.getElementById('auto-save-toggle').addEventListener('change', (e) => {
            this.settings.history.autoSave = e.target.checked;
            this.saveSettings();
        });
        
        // 历史保存期限
        document.getElementById('retention-period').addEventListener('change', (e) => {
            const retention = e.target.value;
            this.settings.history.retentionDays = retention;
            this.saveSettings();
            
            // 更新清理按钮
            this.updateClearHistoryButton();
        });
        
        // 立即清理按钮
        this.updateClearHistoryButton();
    }
    
    // 更新清理按钮显示
    updateClearHistoryButton() {
        const container = document.querySelector('#retention-period').parentElement;
        const existingButton = container.querySelector('#clear-history-now');
        
        // 移除现有按钮
        if (existingButton) {
            existingButton.remove();
        }
        
        // 添加新按钮（如果需要）
        if (this.settings.history.retentionDays !== 'permanent') {
            const button = document.createElement('button');
            button.id = 'clear-history-now';
            button.className = 'px-3 py-1 bg-red-500/20 border border-red-500/30 rounded hover:bg-red-500/30 text-sm transition-colors';
            button.textContent = '立即清理';
            button.addEventListener('click', () => {
                this.clearExpiredHistory();
            });
            container.appendChild(button);
        }
    }
    
    // 清理过期历史
    clearExpiredHistory() {
        const retentionDays = this.settings.history.retentionDays;
        if (retentionDays === 'permanent') return;
        
        const now = Date.now();
        const retentionMs = parseInt(retentionDays) * 24 * 60 * 60 * 1000;
        
        try {
            // 获取当前聊天历史
            const chatHistories = JSON.parse(localStorage.getItem('aiHubChatHistories') || '{}');
            
            // 清理每个模型的过期对话
            for (const modelId in chatHistories) {
                if (chatHistories[modelId]?.conversations) {
                    chatHistories[modelId].conversations = chatHistories[modelId].conversations.filter(conv => {
                        return (now - conv.timestamp) <= retentionMs;
                    });
                    
                    // 如果当前对话被删除，切换到最新的对话
                    if (chatHistories[modelId].currentIndex >= chatHistories[modelId].conversations.length) {
                        chatHistories[modelId].currentIndex = Math.max(0, chatHistories[modelId].conversations.length - 1);
                    }
                }
            }
            
            // 保存清理后的历史
            localStorage.setItem('aiHubChatHistories', JSON.stringify(chatHistories));
            
            // 显示成功提示
            this.showNotification('历史记录清理完成');
        } catch (error) {
            console.error('清理历史记录失败:', error);
            this.showNotification('清理历史记录失败', 'error');
        }
    }
    
    // 显示通知
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in ${type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'} text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // 绑定外部事件
    bindEvents() {
        // 可以在这里绑定外部元素的事件
    }
    
    // 显示设置弹窗
    showModal() {
        if (!this.modal) {
            this.createModal();
        }
        this.modal.classList.remove('hidden');
    }
    
    // 隐藏设置弹窗
    hideModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }
    
    // 获取当前设置
    getSettings() {
        return { ...this.settings };
    }
}

// 初始化设置管理器（延迟到DOM加载完成后）
let settingsManager = null;

// 创建全局函数，用于打开设置弹窗
window.openSettingsModal = function() {
    if (settingsManager) {
        settingsManager.showModal();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        settingsManager = new SettingsManager();
        window.SettingsManager = settingsManager;
    });
} else {
    settingsManager = new SettingsManager();
    window.SettingsManager = settingsManager;
}