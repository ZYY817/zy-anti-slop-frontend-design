# F3 · 性能与 Core Web Vitals

> 代码生成得再好看，如果 LCP 5 秒、CLS 抖动、点击卡顿——用户直接走人。
> 本文件让 AI 在生成代码时**主动内置**性能优化，而非事后修补。
> 数据基于 2026 年标准（INP 已取代 FID）。

---

## 一、2026 三大指标与阈值

| 指标 | 全称 | 衡量什么 | Good | Needs Improvement | Poor |
|---|---|---|---|---|---|
| **LCP** | Largest Contentful Paint | 最大内容绘制速度 | < 2.5s | 2.5 – 4.0s | > 4.0s |
| **INP** | Interaction to Next Paint | 交互响应速度 | < 200ms | 200 – 500ms | > 500ms |
| **CLS** | Cumulative Layout Shift | 视觉稳定性 | < 0.1 | 0.1 – 0.25 | > 0.25 |

**关键**：Google 用**真实用户数据**（CrUX）的 **75th 百分位**评分，不是你本地 Lighthouse 跑的分。

---

## 二、LCP 优化（让页面快速出内容）

### LCP 元素通常是什么
- Hero 图片 / 背景图
- 首屏大标题文本块
- 首屏视频封面

### 核心技术

```html
<!-- 1. 预加载 LCP 图片 -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high">

<!-- 2. 响应式 + 现代格式 -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" width="1200" height="600" alt="..." fetchpriority="high" decoding="async">
</picture>
```

```css
/* 3. 关键 CSS 内联（首屏样式直接放 <head>） */
/* 4. 字体不阻塞 */
@font-face {
  font-family: 'Brand';
  src: url('/brand.woff2') format('woff2');
  font-display: swap;          /* 先用系统字体，加载完替换 */
}
```

### LCP Checklist（检验项）
- [ ] LCP 图片用 `fetchpriority="high"` + `<link rel="preload">`
- [ ] 图片格式：AVIF > WebP > JPEG
- [ ] 图片有明确 `width/height`（防 CLS）
- [ ] 首屏 CSS 内联或 `<link rel="preload" as="style">`
- [ ] 字体用 `font-display: swap` 或 `optional`
- [ ] 服务端响应 < 600ms（TTFB）
- [ ] 无 render-blocking JS 在 `<head>`

### TTFB 优化手段
- CDN 边缘缓存静态资源与 HTML
- Streaming SSR（先发 `<head>` + 首屏骨架，数据到了再流式补）
- Edge rendering（Vercel Edge / Cloudflare Workers）
- 数据库查询加索引 + 结果缓存
- `<link rel="preconnect">` 提前建立第三方连接

### 预渲染（Speculation Rules API）
```html
<script type="speculationrules">
{
  "prerender": [{ "where": { "href_matches": "/products/*" }, "eagerness": "moderate" }]
}
</script>
```
用户 hover/即将点击时提前渲染下一页 → 点击后 LCP 近乎 0。

---

## 三、INP 优化（让交互不卡顿）

### INP 衡量全程
```
用户点击/按键
  → Input Delay（主线程被占）
  → Processing Time（事件处理）
  → Presentation Delay（下一帧渲染）
= 总交互延迟
```

### 核心技术

```js
// 1. 拆长任务（> 50ms 的任务会阻塞交互）
async function processItems(items) {
  for (const item of items) {
    process(item);
    // scheduler.yield() 是 Chrome 129+ 稳定 API
    // Safari/Firefox 2026 中支持度有限，可 fallback 到 setTimeout(0)
    if ('scheduler' in window && 'yield' in scheduler) {
      await scheduler.yield();
    } else {
      await new Promise(r => setTimeout(r, 0));
    }
  }
}

// 2. 非关键 JS 延迟加载
<script src="/analytics.js" defer></script>
<script src="/chat-widget.js" type="module" async></script>
```

```css
/* 3. 动画只用 transform + opacity（不触发 Layout/Paint） */
.card:hover { transform: translateY(-4px); }  /* ✅ 合成层 */
/* ❌ .card:hover { margin-top: -4px; } ← 触发 Layout 重排 */
```

### INP Checklist（检验项）
- [ ] 无 > 50ms 的长任务阻塞主线程
- [ ] 第三方脚本全部 `defer` 或 `async`
- [ ] DOM 节点 < 1500（大列表用虚拟滚动）
- [ ] 事件处理器用 `debounce`/`throttle`（输入搜索 300ms）
- [ ] 动画只走合成层（transform/opacity/filter）
- [ ] 重计算用 Web Worker 或 `scheduler.yield()`
- [ ] `content-visibility: auto` 跳过屏幕外渲染

---

## 四、CLS 优化（不要让界面抖动）

### 常见 CLS 元凶
- 图片/视频没有 `width/height`
- 字体加载完闪烁（FOUT）
- 广告/嵌入内容动态插入
- 懒加载内容把下方顶走

### 核心技术

```html
<!-- 1. 所有图片/视频必须有尺寸 -->
<img src="..." width="800" height="450" loading="lazy" alt="...">

<!-- 2. 嵌入内容预留空间 -->
<div style="aspect-ratio: 16/9; background: var(--skeleton-base);">
  <iframe loading="lazy" ...></iframe>
</div>
```

```css
/* 3. 动态内容用 min-height 占位 */
.ad-slot { min-height: 250px; contain: layout; }

/* 4. 字体回退尺寸匹配 */
@font-face {
  font-family: 'Brand';
  src: url('/brand.woff2');
  font-display: swap;
  size-adjust: 105%;      /* 让回退字体与目标字体尺寸接近 */
  ascent-override: 90%;
}
```

### CLS Checklist（检验项）
- [ ] 所有 `<img>` / `<video>` 有 `width` + `height`
- [ ] iframe/嵌入用 `aspect-ratio` 占位
- [ ] 不在现有内容上方动态插入新内容
- [ ] 字体用 `size-adjust` 或 `font-display: optional`
- [ ] 动态加载内容有 `min-height` 预留
- [ ] `contain: layout` 限制重排范围
- [ ] 骨架屏尺寸与真实内容匹配

---

## 五、AI 生成代码时的性能 Prompt 约束

```
【性能要求（嵌入每个 prompt）】
- 图片：LCP 图片 fetchpriority="high" + preload；其余 loading="lazy"
- 图片格式：<picture> 提供 AVIF/WebP 降级
- 所有 <img>/<video> 必须有 width + height
- 字体：font-display: swap，最多 2 个字体文件
- CSS：首屏关键样式 < 14KB 内联
- JS：第三方全部 defer/async，无 render-blocking
- 动画：只用 transform + opacity，不用 margin/top/left/width
- 长列表（>50 项）：虚拟滚动
- 屏幕外内容：content-visibility: auto
- 不在已有内容上方插入新元素
- 嵌入/广告/动态内容用 min-height 或 aspect-ratio 占位
```

---

## 六、性能预算（参考值）

| 维度 | 预算 |
|---|---|
| 首屏 HTML + 关键 CSS | < 14 KB（一个 TCP 包） |
| 首次加载总 JS | < 200 KB（gzip） |
| LCP 图片 | < 200 KB |
| 字体文件总量 | < 100 KB（2 文件以内） |
| DOM 节点 | < 1500 |
| 首屏请求数 | < 25 |
| 总页面大小 | < 2 MB |

---

## 七、工具速查

| 工具 | 用途 |
|---|---|
| **Lighthouse** | 本地 lab 测试（开发用） |
| **PageSpeed Insights** | 真实用户数据（CrUX）+ lab |
| **Web Vitals JS** | 代码中监测 LCP/INP/CLS |
| **Chrome DevTools Performance** | 长任务/Layout Shift 定位 |
| **Bundlephobia** | 检查 npm 包大小 |
| **Squoosh** | 图片压缩/格式转换 |

---

## 八、常见错误

| ❌ 错误 | ✅ 正确 |
|---|---|
| Hero 图片用 `loading="lazy"` | LCP 图片用 `fetchpriority="high"` |
| 用 JPEG 2MB 大图 | 用 AVIF < 200KB |
| JS 全打一个 bundle | Code splitting + 按路由懒加载 |
| `will-change: transform` 全局加 | 只在动画前加、动画后移除 |
| 字体用 5 个 weight | 用可变字体 1 个文件 |
| spinner + 全屏白屏等待 | 骨架屏 + 流式渲染 |
| 图片无尺寸 → CLS | 所有图片有 width/height |
| 第三方脚本同步加载 | 全部 defer + 首屏后加载 |

---

## 九、检验清单（生成代码后扫）

- [ ] LCP 图片有 fetchpriority="high" + preload
- [ ] 所有图片有 width/height + lazy（非 LCP）
- [ ] 字体 ≤ 2 文件，font-display: swap
- [ ] 首屏无 render-blocking JS
- [ ] 动画全走合成层（transform/opacity/filter）
- [ ] 长列表有虚拟滚动
- [ ] 屏幕外用 content-visibility: auto
- [ ] 动态内容有预留空间（min-height / aspect-ratio）
- [ ] 无 > 50ms 的主线程长任务
- [ ] 总 JS < 200KB gzip
