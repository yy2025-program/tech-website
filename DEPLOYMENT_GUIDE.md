# 🚀 GitHub Pages 部署指南

## 方法一：使用自动化脚本（推荐）

### 前提条件
- 已安装 Git
- 有 GitHub 账号
- 已在 GitHub 创建新仓库

### 快速部署步骤

1. **在 GitHub 创建仓库**
   ```
   访问: https://github.com/new
   仓库名: tech-website (或你喜欢的名字)
   设置为 Public
   不要初始化 README、.gitignore 或 license
   点击 "Create repository"
   ```

2. **运行部署脚本**
   ```bash
   cd /home/ste92/tech-website
   ./deploy.sh 你的GitHub用户名 tech-website
   ```

3. **启用 GitHub Pages**
   - 访问你的仓库页面
   - 点击 "Settings" 标签
   - 左侧菜单找到 "Pages"
   - Source 选择 "Deploy from a branch"
   - 选择 "main" 分支和 "/ (root)"
   - 点击 "Save"

4. **访问网站**
   ```
   https://你的用户名.github.io/tech-website
   ```

## 方法二：手动部署

### 步骤 1: 创建 GitHub 仓库
```bash
# 访问 GitHub 并创建新仓库
# 仓库名: tech-website
# 类型: Public
```

### 步骤 2: 初始化本地仓库
```bash
cd /home/ste92/tech-website
git init
git add .
git commit -m "Initial commit: Add tech website files"
git branch -M main
```

### 步骤 3: 连接远程仓库
```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/tech-website.git
git push -u origin main
```

### 步骤 4: 启用 GitHub Pages
1. 访问仓库设置页面
2. 找到 Pages 部分
3. 选择 main 分支作为源
4. 保存设置

## 方法三：GitHub CLI（如果已安装）

```bash
cd /home/ste92/tech-website

# 创建仓库并推送
gh repo create tech-website --public --push --source=.

# 启用 Pages
gh api repos/:owner/tech-website/pages -X POST -f source.branch=main -f source.path=/
```

## 🔧 故障排除

### 问题 1: 推送被拒绝
```bash
# 如果遇到认证问题，使用个人访问令牌
# 在 GitHub Settings > Developer settings > Personal access tokens 创建令牌
# 使用令牌作为密码
```

### 问题 2: 网站不显示
- 等待 5-10 分钟让 GitHub Pages 构建
- 检查仓库是否为 Public
- 确认 Pages 设置正确

### 问题 3: 样式不加载
- 确保所有文件都在仓库根目录
- 检查文件名大小写是否正确

## 📱 测试清单

部署完成后，测试以下功能：

- [ ] 网站正常加载
- [ ] 响应式设计在移动端正常
- [ ] 导航链接工作正常
- [ ] 聊天按钮可以点击
- [ ] 聊天窗口可以发送消息
- [ ] 动画效果正常显示

## 🎨 自定义建议

部署成功后，你可以：

1. **修改内容**: 编辑 `index.html` 中的文本
2. **更换颜色**: 修改 `styles.css` 中的颜色变量
3. **添加页面**: 创建新的 HTML 文件
4. **集成真实 API**: 替换模拟的聊天功能

## 📞 需要帮助？

如果遇到问题，可以：
1. 检查 GitHub Pages 构建状态
2. 查看浏览器开发者工具的错误信息
3. 确认所有文件路径正确

---

**提示**: 首次部署可能需要几分钟时间生效，请耐心等待！
