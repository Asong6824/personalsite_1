# GitHub Pages 部署指南

本项目已经配置好了 GitHub Pages 部署，按照以下步骤即可完成部署：

## 1. 在 GitHub 上创建新仓库

1. 登录 GitHub
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `personalsite` (或你喜欢的名字)
   - Description: "My personal website"
   - 选择 Public
   - 不要勾选 "Add a README file"、"Add .gitignore"、"Choose a license"
4. 点击 "Create repository"

## 2. 更新配置文件

在推送代码之前，需要更新 `package.json` 中的 homepage 字段：

```json
"homepage": "https://你的GitHub用户名.github.io/仓库名"
```

例如：
```json
"homepage": "https://johndoe.github.io/personalsite"
```

## 3. 推送代码到 GitHub

在项目根目录执行以下命令：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送代码
git branch -M main
git push -u origin main
```

## 4. 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "GitHub Actions"
4. 保存设置

## 5. 等待部署完成

- 推送代码后，GitHub Actions 会自动开始构建和部署
- 可以在 "Actions" 标签页查看部署进度
- 部署完成后，网站将在 `https://你的用户名.github.io/仓库名` 可访问

## 项目特性

本项目已经配置了以下功能：

- ✅ 静态导出配置 (`output: 'export'`)
- ✅ 图片优化禁用 (适配静态部署)
- ✅ GitHub Actions 自动部署
- ✅ 响应式设计
- ✅ MDX 博客支持
- ✅ 深色模式

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 本地预览构建结果
npm run start
```

## 注意事项

1. 确保所有图片路径使用相对路径
2. 避免使用 Next.js 的服务端功能 (API Routes, SSR 等)
3. 如果有自定义域名，在 `.github/workflows/deploy.yml` 中添加 CNAME 配置
4. 首次部署可能需要几分钟时间

## 故障排除

如果部署失败，请检查：

1. GitHub Actions 日志中的错误信息
2. `package.json` 中的 homepage 字段是否正确
3. 是否有使用了不支持静态导出的 Next.js 功能
4. 图片和资源文件路径是否正确