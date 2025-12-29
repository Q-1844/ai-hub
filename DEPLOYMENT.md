# AI Hub 部署指南

本指南将帮助你部署AI Hub网站到互联网，支持以下部署方式：

1. **GitHub Pages**（推荐，免费）
2. **本地测试部署**
3. **其他静态网站托管服务**

## 🚀 1. GitHub Pages 部署

GitHub Pages是GitHub提供的免费静态网站托管服务，适合部署AI Hub这样的静态网站。

### 已配置的文件

我已经为你创建了GitHub Pages部署配置文件：
- `.github/workflows/deploy.yml` - GitHub Actions自动部署配置

### 部署步骤

1. **创建GitHub仓库**
   - 登录GitHub，创建一个新仓库（建议命名为 `ai-hub`）
   - 仓库可以是公开的（免费）或私有的（需要GitHub Pro）

2. **上传代码到GitHub**
   ```bash
   # 初始化git仓库（如果尚未初始化）
   git init
   
   # 添加所有文件
   git add .
   
   # 提交代码
   git commit -m "Initial commit"
   
   # 添加远程仓库（替换为你的GitHub仓库URL）
   git remote add origin https://github.com/你的用户名/ai-hub.git
   
   # 推送到GitHub
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入GitHub仓库页面
   - 点击「Settings」→「Pages」
   - 在「Build and deployment」→「Source」中选择「GitHub Actions」
   - 保存设置

4. **等待自动部署**
   - GitHub Actions会自动运行部署工作流
   - 部署完成后，你可以在「Settings」→「Pages」中看到部署状态和访问URL
   - 访问地址格式：`https://你的用户名.github.io/ai-hub/`

## 🔧 2. 本地测试部署

### 已创建的脚本

我已经为你创建了本地部署脚本：
- `deploy-windows.ps1` - Windows PowerShell脚本
- `deploy-linux.sh` - Linux/macOS Bash脚本

### 使用方法

#### Windows用户
1. **打开PowerShell**
2. **运行脚本**
   ```powershell
   .\deploy-windows.ps1
   ```
3. **访问网站**
   - 打开浏览器，访问 `http://localhost:8000`

#### Linux/macOS用户
1. **赋予脚本执行权限**
   ```bash
   chmod +x deploy-linux.sh
   ```
2. **运行脚本**
   ```bash
   ./deploy-linux.sh
   ```
3. **访问网站**
   - 打开浏览器，访问 `http://localhost:8000`

### 手动本地部署

如果你不想使用脚本，也可以手动启动本地服务器：

```bash
# 使用Python 3
python3 -m http.server 8000 --bind 127.0.0.1

# 或使用Python 2
python -m SimpleHTTPServer 8000
```

## 🌐 3. 其他部署选项

### Vercel 部署

1. **访问Vercel官网**：https://vercel.com
2. **导入GitHub仓库**
3. **配置部署设置**
   - Framework Preset: 选择「Other」
   - Root Directory: 保持默认（`./`）
4. **点击Deploy**
5. **访问部署后的网站**

### Netlify 部署

1. **访问Netlify官网**：https://www.netlify.com
2. **导入GitHub仓库**
3. **配置部署设置**
   - Build command: 留空
   - Publish directory: 保持默认（`/`）
4. **点击Deploy Site**
5. **访问部署后的网站**

### Cloudflare Pages 部署

1. **访问Cloudflare Pages**：https://pages.cloudflare.com
2. **导入GitHub仓库**
3. **配置部署设置**
   - Framework preset: 选择「None」
   - Build command: 留空
   - Build output directory: 保持默认（`/`）
4. **点击Save and Deploy**
5. **访问部署后的网站**

## 📝 配置说明

### API配置

AI Hub使用iFlow API获取AI响应。API配置位于 `index.html` 中的 `API_CONFIG` 对象：

```javascript
const API_CONFIG = {
    iflow: {
        key: 'sk-568e97a528aed87ecf6bcb7ef608663f',
        url: 'https://apis.iflow.cn/v1/chat/completions'
    }
};
```

### 自定义域名

如果你想使用自定义域名，可以在GitHub Pages、Vercel、Netlify等服务的设置中配置。

## 🤖 AI API说明

AI Hub使用的是**iFlow API**，这是一个提供多种AI模型的对话API。当前配置使用的API密钥是公开的，仅供测试使用。

**注意**：对于生产部署，建议使用自己的API密钥，你可以：
1. 访问iFlow官网获取自己的API密钥
2. 替换 `index.html` 中的 `API_CONFIG.iflow.key`

## 📌 注意事项

1. **静态网站限制**
   - AI Hub是纯静态网站，所有数据存储在浏览器本地存储（localStorage）
   - 每次部署后，网站访问者的本地数据不会丢失（存储在浏览器中）

2. **API使用限制**
   - 免费API密钥可能有调用次数限制
   - 生产部署建议使用付费API密钥

3. **HTTPS要求**
   - 所有现代浏览器要求AI API调用必须通过HTTPS进行
   - 所有推荐的部署服务都提供HTTPS支持

## 📞 支持

如果遇到部署问题，可以：
- 检查部署日志（GitHub Actions、Vercel等服务提供）
- 查看浏览器控制台的错误信息
- 确保API配置正确

## 🎉 部署成功

部署成功后，你可以：
- 访问你的AI Hub网站
- 与各种AI模型进行对话
- 自定义网站主题和设置
- 分享你的AI Hub网站给其他人使用

祝你部署成功！🚀
