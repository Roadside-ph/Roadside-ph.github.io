import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '我的学习空间',     // 站点标题（浏览器标签页显示）
  description: '个人主页 · 学习日记 · 项目记录',

  // 顶部导航栏：以后要加新分区，在 themeConfig.nav 里加一项即可
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '学习日记', link: '/diary/' },
      { text: '个人学习项目', link: '/projects/' },
    ],
    // 右上角外链（改/删随意）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Roadside-ph' },
    ],
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' },
  },
})
