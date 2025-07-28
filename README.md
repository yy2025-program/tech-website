# Advanced Technology Platform

一个具有高级科技感的现代网站，灵感来源于Tech 的设计风格，集成了 Amazon Q 聊天功能。

## 功能特点

- 🚀 现代科技感设计
- 📱 完全响应式布局
- 🤖 集成 Amazon Q 聊天助手
- ✨ 流畅的动画效果
- 🎨 渐变色彩和玻璃态效果
- 📊 Amazon 风格的面包屑导航
- 💫 粒子动画背景

## 技术栈

- HTML5
- CSS3 (Grid, Flexbox, 动画)
- Vanilla JavaScript
- 响应式设计
- 现代浏览器兼容

## 部署到 GitHub Pages

### 步骤 1: 创建 GitHub 仓库

1. 登录到 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 输入仓库名称（例如：`tech-website`）
4. 确保仓库是 Public
5. 点击 "Create repository"

### 步骤 2: 上传文件

有两种方式上传文件：

#### 方式 A: 通过 GitHub 网页界面
1. 在新创建的仓库页面，点击 "uploading an existing file"
2. 拖拽或选择以下文件：
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. 添加提交信息，点击 "Commit changes"

#### 方式 B: 通过 Git 命令行
```bash
git clone https://github.com/你的用户名/tech-website.git
cd tech-website
# 复制所有文件到这个目录
git add .
git commit -m "Initial commit: Add tech website files"
git push origin main
```

### 步骤 3: 启用 GitHub Pages

1. 在仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分，选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 文件夹
5. 点击 "Save"

### 步骤 4: 访问网站

几分钟后，你的网站将在以下地址可用：
```
https://你的用户名.github.io/tech-website
```

## 自定义配置

### 修改网站内容

- **标题和描述**: 编辑 `index.html` 中的文本内容
- **颜色主题**: 修改 `styles.css` 中的 CSS 变量
- **聊天响应**: 更新 `script.js` 中的 `responses` 对象

### 添加自定义域名

1. 在仓库根目录创建 `CNAME` 文件
2. 在文件中添加你的域名（例如：`www.yoursite.com`）
3. 在域名提供商处配置 DNS 记录

## 聊天功能

网站右下角的聊天图标可以打开 Amazon Q 助手，支持以下功能：

- AWS 服务咨询
- 编程问题解答
- 技术文档帮助
- 网站相关问题

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 性能优化

- 使用了 CSS Grid 和 Flexbox 进行布局
- 优化的动画性能
- 响应式图片和媒体查询
- 最小化的 JavaScript 代码

## 许可证

MIT License - 可自由使用和修改

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**注意**: 这是一个静态网站模板，Amazon Q 聊天功能是模拟实现。如需真实的 AI 聊天功能，需要集成实际的 API 服务。
