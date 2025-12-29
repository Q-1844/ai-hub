# AI Hub

现代化的AI聊天界面，支持多种AI模型，提供流畅的聊天体验。

## 🚀 功能特性

### 多模型AI对话
- 支持15个不同的AI模型
- 包括DeepSeek V3.2、通义千问3系列、Kimi、智谱GLM-4.6等
- 模型分类：综合AI、代码AI、视觉AI、推理AI

### 智能对话体验
- 流式回复，实现流畅的打字机效果
- 独立对话历史，每个模型拥有独立记录
- 数据持久化，使用localStorage保存对话历史
- 支持查看、删除、导出对话历史

### 现代化用户界面
- 深色主题设计，霓虹粉渐变风格
- 响应式布局，适配多种屏幕尺寸
- 标题动画效果，扫描光动画
- 流畅的过渡和动画效果

### 个性化设置
- 主色调选择器，可调整网站主色调
- 界面亮度调节，从深黑到柔和的亮度滑块
- 自动保存开关，控制对话历史自动保存
- 历史保存期限设置，支持永久、30天、7天、1天

## 🔧 技术栈

- **前端框架**：纯HTML + Tailwind CSS + Vanilla JavaScript
- **API集成**：iFlow API，支持流式和非流式响应
- **数据存储**：localStorage
- **流式处理**：Server-Sent Events (SSE)
- **部署方式**：静态网站，支持GitHub Pages、Vercel、Netlify等

## 📦 部署指南

请参考 [DEPLOYMENT.md](DEPLOYMENT.md) 文件获取详细部署说明。

### 本地测试

```bash
# Windows
.deploy-windows.ps1

# Linux/macOS
chmod +x deploy-linux.sh && ./deploy-linux.sh
```

访问：http://localhost:8000

## 🎯 使用指南

1. **选择模型**：从左侧选择一个AI模型
2. **发送消息**：在底部输入框输入问题，按Enter发送
3. **查看历史**：点击历史图标查看对话历史
4. **调整设置**：点击设置图标调整网站主题和历史设置
5. **新对话**：点击"新对话"按钮开始新的聊天

## 📝 许可证

MIT License