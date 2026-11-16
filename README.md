# Roadside-ph.github.io

个人主页与学习空间，基于 [VitePress](https://vitepress.dev/) 构建，通过 GitHub Actions 自动部署到 GitHub Pages。

**线上地址：** https://roadside-ph.github.io

[![Deploy](https://github.com/Roadside-ph/Roadside-ph.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Roadside-ph/Roadside-ph.github.io/actions/workflows/deploy.yml)

## 内容板块

| 板块 | 路径 | 说明 |
|---|---|---|
| 首页 | `docs/index.md` | 门厅式 Hero + 三个入口卡片 |
| 学习日记 | `docs/diary/` | 按时间倒序的学习笔记与踩坑记录 |
| 个人学习项目 | `docs/projects/` | VLA 机械臂抓取、LLM+RAG 门店导购等项目详情 |

## 技术栈

- **VitePress 1.6** + Vue 3（Markdown 驱动，自带本地搜索、暗色模式、响应式）
- 自定义主题：页面切换过渡、衬线标题排版（Spectral + Noto Serif SC）、深藏青配色
- **GitHub Actions → GitHub Pages**：推送 `main` 即自动构建发布

## 目录结构

```
docs/
├── index.md                    首页（layout: home）
├── diary/                      学习日记
│   ├── index.md                日记索引
│   └── YYYY-MM-DD.md           单篇日记
├── projects/                   项目展示
│   ├── index.md                项目索引
│   └── <slug>.md               单个项目详情
└── .vitepress/
    ├── config.mts              站点配置：标题、导航、主题选项
    └── theme/
        ├── index.ts            主题入口：页面过渡、图表渲染
        └── custom.css          样式定制：配色、字体、排版、动画
.github/workflows/deploy.yml    构建与部署流水线
```

## 本地开发

需要 Node.js 22 及以上。

```bash
npm install        # 安装依赖（首次或 package.json 变更后）
npm run dev        # 本地预览，默认 http://localhost:5173
npm run build      # 构建到 docs/.vitepress/dist
npm run preview    # 预览构建产物
```

## 怎么写新内容

**加一篇日记**

1. 新建 `docs/diary/YYYY-MM-DD.md`，首行写 `# 标题`
2. 在 `docs/diary/index.md` 对应月份下加一条链接：`- [标题](./YYYY-MM-DD.md) —— 一句话摘要`

**加一个项目**

1. 新建 `docs/projects/<slug>.md`（英文短横线命名，如 `so-arm101-vla.md`）
2. 在 `docs/projects/index.md` 加卡片：标题、技术栈、两行简介、`[查看详情 →](./<slug>.md)`
3. 图片放 `docs/public/images/`，正文用 `![说明](/images/xxx.png)` 引用

**加一个新板块**

1. 新建 `docs/<name>/index.md`
2. 在 `docs/.vitepress/config.mts` 的 `themeConfig.nav` 里加一项 `{ text: '...', link: '/<name>/' }`

**改样式**

统一改 `docs/.vitepress/theme/custom.css`，优先复用 VitePress 变量（`--vp-c-brand-1`、`--vp-c-text-2`、`--vp-c-divider` 等），这样暗色模式自动适配。

## 部署

推送到 `main` 即自动触发构建与发布，无需手动操作：

```bash
git add -A
git commit -m "docs: 更新内容"
git push
```

- 部署流水线：`.github/workflows/deploy.yml`
- 查看进度：仓库 **Actions** 页 → `Deploy VitePress site to Pages`
- 需要重跑时：Actions 页右上角 **Run workflow**（支持手动触发）

## 许可

个人站点，内容版权归作者所有，代码部分可自由参考。
