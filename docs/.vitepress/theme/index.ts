import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useRoute } from 'vitepress'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/700.css'
import '@fontsource/spectral/400.css'
import '@fontsource/spectral/600.css'
import '@fontsource/spectral/700.css'
import './custom.css'

// Mermaid 图表渲染：从源 .md 重新读取图代码（规避 hydration 折叠换行问题）
if (typeof window !== 'undefined') {
  let mermaidReady: any = null
  const loadMermaid = async () => {
    if (!mermaidReady) {
      const m = await import('mermaid')
      mermaidReady = m.default
      const dark = document.documentElement.classList.contains('dark')
      mermaidReady.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default' })
    }
    return mermaidReady
  }

  const renderAll = async (attempt = 0) => {
    try {
      const blocks = Array.from(document.querySelectorAll('.mermaid')).filter(
        (el) => !el.querySelector('svg')
      )
      if (!blocks.length) return
      const mermaid = await loadMermaid()
      const mdUrl = location.pathname.replace(/\.html$/, '.md')
      const mdText = await (await fetch(mdUrl)).text()
      const sources = Array.from(mdText.matchAll(/<div class="mermaid">\n([\s\S]*?)\n<\/div>/g)).map(m => m[1])
      for (let i = 0; i < blocks.length; i++) {
        const code = sources[i]
        if (!code) continue
        const { svg } = await mermaid.render('mmd-' + i + '-' + Date.now(), code)
        blocks[i].innerHTML = svg
      }
    } catch (e: any) {
      if (attempt < 3) setTimeout(() => renderAll(attempt + 1), 1500)
    }
  }

  window.addEventListener('load', () => renderAll())
  setTimeout(() => renderAll(), 2000)
}

// 页面切换过渡：按路由路径 key 化的容器，路径变化时重新挂载触发 CSS 入场动画
export default {
  extends: DefaultTheme,
  Layout: () => {
    const route = useRoute()
    return h('div', { class: 'page-transition-wrap', key: route.path }, [
      h(DefaultTheme.Layout),
    ])
  },
}
