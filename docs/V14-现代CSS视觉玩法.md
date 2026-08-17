# V14 · 现代 CSS 的视觉玩法

> F1 讲的是这些新特性的**语法**。本文讲它们的**视觉配方**——同一个特性能做出什么设计效果。
> 用途：让 AI 用原生 CSS 做出以前要靠 JS 库才有的高级效果，更少代码、更高性能。

---

## 一、Scroll-driven Animations（滚动驱动的视觉）

纯 CSS 把动画进度绑定到滚动位置，替代 `IntersectionObserver` + scroll 监听。

### 阅读进度条
```css
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.progress-bar {
  transform-origin: left;
  animation: grow linear;
  animation-timeline: scroll(root block);
}
```

### 入场揭示（元素进入视口时）
```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 35%;  /* 进入视口就播完 */
}
```

### 视差层（背景比前景慢）
```css
.parallax-bg {
  animation: drift linear;
  animation-timeline: scroll();
}
@keyframes drift { to { transform: translateY(-15%); } }
```

- **感觉**：流畅、有深度、专业
- **场景**：长落地页、文章阅读、图片墙渐显
- **prompt 措辞**："滚动入场用 scroll-driven animations（animation-timeline: view()），不用 JS 监听"
- **降级**：`@supports (animation-timeline: view())` 包裹，不支持时元素默认可见

---

## 二、View Transitions API（视图过渡）

DOM 更新时自动做形变过渡，实现"卡片放大成详情页"这类电影级切换。

### 基础淡入淡出（整页）
```css
::view-transition-old(root) { animation: fade 200ms ease both reverse; }
::view-transition-new(root) { animation: fade 300ms ease both; }
@keyframes fade { from { opacity: 0; } }
```
```js
document.startViewTransition(() => updateDOM());
```

### 共享元素（列表项 → 详情页放大）
```css
/* 列表页 */
.thumb { view-transition-name: hero-image; }
/* 点击后 DOM 切换到详情页 */
.detail-image { view-transition-name: hero-image; }
/* 两者不同时存在于 DOM——列表消失后详情才出现，浏览器自动补间 */
```

- **感觉**：连续、有因果、iOS 级顺滑
- **场景**：列表→详情、相册放大、路由切换、Tab 重排
- **prompt 措辞**："列表点击进详情用 View Transitions 共享元素，缩略图放大成主图"
- **注意**：同一时刻每个 `view-transition-name` 必须唯一

---

## 三、Anchor Positioning（锚点定位）

元素相对另一个元素定位，替代 tooltip/popover 的 JS 定位计算。

```css
.trigger { anchor-name: --btn; }
.tooltip {
  position: absolute;
  position-anchor: --btn;
  top: anchor(bottom);
  justify-self: anchor-center;
  margin-top: 8px;
  position-try-fallbacks: flip-block;   /* 空间不够自动翻到上方 */
}
```

- **感觉**：精准、不抖动、贴合
- **场景**：tooltip、下拉菜单、popover、高亮引导框追踪目标
- **prompt 措辞**："tooltip/下拉用 anchor positioning 定位，含 position-try 自动翻转，不用 JS 计算坐标"

---

## 四、`:has()`（父级条件视觉）

根据子元素/状态改变父容器样式，做出"内容自适应"的排版。

```css
/* 卡片有图 vs 无图，用不同布局 */
.card:has(img) { grid-template-columns: 120px 1fr; }
.card:not(:has(img)) { grid-template-columns: 1fr; }

/* 表单有错误时，提交按钮变灰 */
.form:has(:invalid) .submit { opacity: 0.5; pointer-events: none; }

/* 某项被选中，整行高亮 */
.row:has(:checked) { background: var(--accent-soft); }

/* 悬停某卡片，其余卡片变暗（聚焦效果） */
.grid:has(.card:hover) .card:not(:hover) { opacity: 0.6; }
```

- **感觉**：智能、响应内容、克制
- **场景**：卡片变体、表单联动、选中态、悬停聚焦
- **prompt 措辞**："用 :has() 做内容感知排版——有图无图不同布局、hover 时其余卡片降透明度"

---

## 五、`@starting-style`（优雅出入场）

让 `display: none` ↔ 显示的切换有过渡，Modal/Popover 出现不再闪烁。

```css
dialog {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 250ms, transform 250ms, overlay 250ms allow-discrete, display 250ms allow-discrete;
}
/* 进入前的初始态 */
@starting-style {
  dialog[open] { opacity: 0; transform: translateY(16px); }
}
/* 离开态 */
dialog:not([open]) { opacity: 0; transform: translateY(16px); }
```

- **感觉**：顺滑、无闪烁、完整
- **场景**：Modal、Popover、Toast、下拉菜单的进出
- **prompt 措辞**："Modal 进出用 @starting-style + allow-discrete，进场退场都有动画不闪烁"
- **关键**：`transition-behavior: allow-discrete` 让 `display` 也能参与过渡

---

## 六、Container Queries（组件级变形）

同一个组件在不同宽度容器里呈现不同布局——比媒体查询更适合可复用组件。

```css
.card-wrap { container-type: inline-size; }

.card { display: grid; gap: 12px; }              /* 窄：竖排 */
@container (min-width: 380px) {
  .card { grid-template-columns: 140px 1fr; }    /* 宽：图文横排 */
}
@container (min-width: 600px) {
  .card { grid-template-columns: 200px 1fr auto; } /* 更宽：加操作区 */
}
```

- **感觉**：真正模块化、放哪都合适
- **场景**：卡片、侧栏组件、可拖拽面板、设计系统组件
- **prompt 措辞**："卡片组件用 container queries 响应容器宽度，同一组件在主区/侧栏自动切换横竖排版"

---

## 七、`sibling-index()`（自动 Stagger）

无需 JS 或手写 `nth-child`，让列表项自动依次入场（新特性，注意支持度）。

```css
.item {
  animation: reveal 400ms ease both;
  animation-delay: calc(sibling-index() * 60ms);
}
```
兼容写法（用 CSS 变量，广泛支持）：
```css
.item { animation-delay: calc(var(--i) * 60ms); }
/* HTML: <li style="--i:0">…<li style="--i:1">… */
```

- **场景**：列表、菜单、网格入场级联
- 详细编排数学见 **B71 动效编排进阶**

---

## 八、Prompt 模板

```
【现代 CSS 视觉组合】
- 落地页滚动：section 用 scroll-driven 依次揭示 + 阅读进度条
- 列表→详情：View Transitions 共享元素，缩略图放大成主图
- 卡片：container queries 响应容器，:has(img) 切换图文布局
- 交互提示：tooltip/菜单用 anchor positioning + position-try 翻转
- 弹层：Modal/Toast 用 @starting-style，进出都有动画不闪烁
- 全部特性用 @supports 包裹，不支持时优雅降级为静态/可见
```

**浏览器支持提醒**（2026）：scroll-driven / View Transitions / container queries 主流浏览器已支持；anchor positioning 仍 Chromium only（Safari/Firefox 部分支持），生产环境需用 JS polyfill 或纯 CSS 兜底。

---

## 九、检验清单

- [ ] 滚动入场用 scroll-driven，没再引 IntersectionObserver
- [ ] 详情页切换用 View Transitions 共享元素（有放大连续感）
- [ ] tooltip/菜单用 anchor positioning，含 position-try 翻转
- [ ] 用 :has() 做了至少一处内容感知排版
- [ ] Modal/Popover 用 @starting-style，进出不闪烁
- [ ] 可复用组件用 container queries 而非媒体查询
- [ ] 所有新特性有 @supports 降级
- [ ] 尊重 prefers-reduced-motion（关掉大位移动画）
