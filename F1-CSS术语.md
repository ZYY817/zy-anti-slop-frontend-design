# F1 · CSS 术语

> CSS 属性、选择器、函数、新特性的完整词库。含 2025-2026 最新原生能力。
> 用途：让 AI 生成的代码用上现代 CSS，少写 JS，更高性能。

---

## 一、布局属性

### Display
```
display: block / inline / inline-block
display: flex / inline-flex
display: grid / inline-grid
display: contents   (元素消失但子元素保留)
display: flow-root  (创建 BFC)
```

### Flexbox
```
flex-direction: row / column / row-reverse / column-reverse
flex-wrap: nowrap / wrap
justify-content: flex-start / center / space-between / space-around / space-evenly
align-items: stretch / center / flex-start / flex-end / baseline
align-content: (多行对齐)
gap: 16px / row-gap / column-gap
flex: 1 / flex-grow / flex-shrink / flex-basis
order: 调整顺序
align-self: 单个元素对齐
```

### Grid
```
grid-template-columns: repeat(12, 1fr)
grid-template-rows: auto
grid-template-areas: "header header" "sidebar main"
grid-column: span 3 / 1 / 4
grid-row: span 2
gap: 24px
place-items: center
place-content: center
grid-auto-flow: row / column / dense
minmax(200px, 1fr)
repeat(auto-fit, minmax(280px, 1fr))
repeat(auto-fill, ...)
subgrid   (子网格继承父网格轨道)
masonry   (瀑布流布局, 实验中 / Grid Lanes)
```

### Position
```
position: static / relative / absolute / fixed / sticky
inset: 0 (top/right/bottom/left 简写)
z-index
```

---

## 二、盒模型

```
box-sizing: border-box / content-box
width / height / min-* / max-*
padding / margin
border / border-radius
outline (不占空间)
aspect-ratio: 16 / 9
overflow: visible / hidden / scroll / auto / clip
overflow-clip-margin
object-fit: cover / contain / fill
object-position
```

### 逻辑属性（国际化友好）
```
margin-inline / margin-block
padding-inline-start / padding-inline-end
inset-inline / inset-block
border-inline / border-block
inline-size / block-size  (替代 width/height)
```

---

## 三、现代单位

```
px      绝对像素
rem     根字号倍数 (推荐)
em      当前字号倍数
%       百分比
vw/vh   视口宽/高 1%
vmin/vmax
dvh/dvw 动态视口 (移动端推荐)
svh/lvh 静态/大视口
ch      字符宽 (0 的宽度)
ex      x 高度
fr      grid 剩余空间比例
cqw/cqh 容器查询单位
cqi/cqb 容器 inline/block
```

---

## 四、选择器

### 基础
```
.class  #id  element  *
A B     (后代)
A > B   (直接子)
A + B   (相邻兄弟)
A ~ B   (后续兄弟)
[attr]  [attr="val"]  [attr^="pre"]  [attr$="suf"]  [attr*="sub"]
```

### 伪类
```
:hover :focus :active :visited
:focus-visible  (仅键盘焦点)
:focus-within   (子元素获焦时)
:first-child :last-child :nth-child(n) :nth-of-type()
:only-child :empty
:not(selector)
:is(a, b, c)    (任一匹配, 取最高优先级)
:where(a, b, c) (同 :is 但零优先级)
:has(> img)     (父选择器! 2025 主流)
:checked :disabled :required :invalid :valid
:default :placeholder-shown
:target
:root
```

### 伪元素
```
::before ::after
::first-line ::first-letter
::selection     (选中文字样式)
::placeholder
::marker        (列表符号)
::backdrop      (Modal/全屏背景)
::file-selector-button
```

---

## 五、排版属性

```
font-family / font-size / font-weight / font-style
line-height / letter-spacing / word-spacing
text-align: left/center/right/justify
text-decoration / text-transform / text-indent
text-overflow: ellipsis
white-space: nowrap / pre / pre-wrap
word-break / overflow-wrap: break-word
hyphens: auto
font-feature-settings: "tnum", "liga"
font-variant-numeric: tabular-nums
font-variation-settings: "wght" 500  (可变字体)
writing-mode: vertical-rl  (竖排)

/* 2025-2026 新增 */
text-wrap: balance   (标题自动平衡换行)
text-wrap: pretty    (正文避免孤字)
line-clamp: 3        (多行截断)
hanging-punctuation: first  (悬挂标点)
text-spacing-trim    (中日韩标点间距)
```

---

## 六、颜色与背景

```
color / background-color
background-image / background-size / background-position
background-repeat / background-attachment
background: linear-gradient() / radial-gradient() / conic-gradient()
background-clip: text  (文字渐变)
background-blend-mode
mix-blend-mode: multiply / screen / overlay
opacity

/* 现代色彩 (2025-2026) */
oklch(70% 0.15 250)      感知均匀
oklab()
color-mix(in oklch, red 40%, blue)  混色
light-dark(#fff, #000)   浅深自动切换
color(display-p3 ...)    广色域
相对颜色: rgb(from var(--c) r g b / 50%)
currentColor
accent-color: (表单控件主色)
```

---

## 七、视觉效果

```
box-shadow: 0 4px 6px rgba(0,0,0,0.1)
text-shadow
filter: blur() brightness() contrast() grayscale() saturate() drop-shadow() hue-rotate()
backdrop-filter: blur(12px) saturate(180%)  (毛玻璃!)
clip-path: circle() / polygon() / inset()
mask / mask-image
transform: translate() rotate() scale() skew() matrix()
transform-style: preserve-3d
perspective
transform-origin
will-change: transform
```

---

## 八、动画与过渡

```
transition: all 200ms ease
transition-property / duration / timing-function / delay

animation: name 1s ease infinite
@keyframes name { from {} to {} / 0% 50% 100% }
animation-fill-mode: forwards / backwards / both
animation-play-state: paused / running
animation-direction: alternate / reverse

/* 缓动 */
ease / ease-in / ease-out / ease-in-out / linear
cubic-bezier(0.4, 0, 0.2, 1)
steps(4, end)
linear(0, 0.5, 1)  (自定义缓动点)

/* 2025-2026 新增 */
@starting-style { }        进入动画不闪烁
transition-behavior: allow-discrete  (display 也能过渡)
animation-timeline: scroll()  滚动驱动
animation-timeline: view()    视口驱动
scroll-timeline / view-timeline
animation-range: entry / exit / cover
```

---

## 九、2025-2026 重磅新特性

### Container Queries 容器查询
```css
.container { container-type: inline-size; container-name: card; }
@container card (min-width: 400px) {
  .item { display: flex; }
}
/* 容器查询单位 */
width: 50cqw;
```

### :has() 父选择器
```css
.card:has(img) { padding: 0; }
.form:has(:invalid) button { opacity: 0.5; }
label:has(+ input:focus) { color: blue; }
```

### @scope 样式作用域
```css
@scope (.card) to (.content) {
  p { color: gray; }  /* 只在 .card 内, .content 外 */
}
```

### @layer 级联层
```css
@layer reset, base, components, utilities;
@layer components { .btn { ... } }
/* 控制优先级顺序, 告别 !important 战争 */
```

### 原生嵌套 (Nesting)
```css
.card {
  color: black;
  & .title { font-weight: bold; }
  &:hover { background: gray; }
}
```

### Anchor Positioning 锚点定位
```css
.anchor { anchor-name: --trigger; }
.tooltip {
  position: absolute;
  position-anchor: --trigger;
  top: anchor(bottom);
  left: anchor(center);
}
/* 替代大量 tooltip/popover 的 JS */
```

### Scroll-driven Animations 滚动驱动动画
```css
@keyframes reveal { from { opacity: 0; } to { opacity: 1; } }
.el {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
/* 替代 IntersectionObserver + scroll listener */
```

### View Transitions API 视图过渡
```css
::view-transition-old(root) { animation: fade-out 0.2s; }
::view-transition-new(root) { animation: fade-in 0.3s; }
/* JS: document.startViewTransition(() => updateDOM()) */
```

### @starting-style 进入动画
```css
dialog {
  opacity: 1;
  transition: opacity 0.3s;
  @starting-style { opacity: 0; }
}
/* Modal/Popover 出现不再闪烁 */
```

### CSS if() 与条件（早期）
```css
/* 值层面的条件逻辑, 2026 早期 */
width: if(style(--wide): 800px; else: 400px);
```

### sibling-index() / sibling-count()
```css
/* 自动 stagger, 无需手写 nth-child 延迟 */
.item { animation-delay: calc(sibling-index() * 50ms); }
```

### Grid Lanes / Masonry 原生瀑布流
```css
grid-template-rows: masonry;  /* 实验中 */
```

### field-sizing 输入框自适应
```css
textarea { field-sizing: content; }  /* 随内容自动伸缩 */
```

### Popover API
```html
<button popovertarget="menu">打开</button>
<div id="menu" popover>内容</div>
```

### typed attr()
```css
div { width: attr(data-width px); }  /* HTML 属性作为 CSS 值 */
```

---

## 十、响应式与适配

```
@media (min-width: 768px) { }
@media (prefers-color-scheme: dark) { }
@media (prefers-reduced-motion: reduce) { }
@media (prefers-contrast: more) { }
@media (hover: hover) { }        (区分触屏)
@media (pointer: fine / coarse)
@media (orientation: portrait)
@media (display-mode: standalone)  (PWA)
@supports (backdrop-filter: blur()) { }
@container (min-width: 400px) { }
```

---

## 十一、性能相关

```
content-visibility: auto     (跳过屏幕外渲染)
contain: layout paint        (限制重排范围)
will-change: transform       (提前优化, 用完删)
contain-intrinsic-size       (占位尺寸)
loading="lazy" (HTML)        (图片懒加载)
fetchpriority="high"
```

---

## 十二、常用工具类思维（Utility-first）

Tailwind 风格的原子类（即使不用 Tailwind 也是好的心智模型）：
```
布局: flex grid block hidden
间距: p-4 px-6 m-2 gap-4 space-y-4
尺寸: w-full h-screen max-w-7xl
排版: text-lg font-bold leading-tight tracking-tight
颜色: text-slate-900 bg-white border-slate-200
圆角: rounded-lg rounded-full
阴影: shadow-sm shadow-lg
效果: opacity-50 blur-sm backdrop-blur-xl
状态: hover:bg-slate-100 focus:ring-2 disabled:opacity-50
响应: md:flex lg:grid-cols-3
暗色: dark:bg-slate-900
动画: transition-all duration-200 animate-pulse
```

---

## 十三、常见错误

- ❌ 用 `px` 定义字号（无法响应用户缩放）→ 用 `rem`
- ❌ 用 `left/top` 做动画（触发回流）→ 用 `transform`
- ❌ `outline: none` 去掉焦点环 → 用 `:focus-visible` 定制
- ❌ 用 `vh` 做移动端全屏 → 用 `dvh`
- ❌ 大量 `!important` → 用 `@layer` 管理优先级
- ❌ JS 写 tooltip 定位 → 用 anchor positioning
- ❌ IntersectionObserver 做入场 → 用 scroll-driven animations
- ❌ 用 `width/height` 定义比例 → 用 `aspect-ratio`
- ❌ 硬编码颜色 → 用 CSS variables / tokens

---

## 十四、Prompt 表达模板

```
【CSS 实现要求】：
- 布局：CSS Grid + Flexbox，容器用 container queries 做组件响应式
- 单位：字号用 rem，间距用 rem/px tokens，移动端全屏用 dvh
- 颜色：CSS variables + oklch，深浅用 light-dark()
- 现代特性优先：
  - tooltip/popover 用 anchor positioning（不用 JS）
  - 滚动入场用 scroll-driven animations（不用 IntersectionObserver）
  - 页面过渡用 View Transitions API
  - Modal 进入用 @starting-style（不闪烁）
  - 优先级管理用 @layer
  - 父级条件用 :has()
- 排版：标题 text-wrap: balance，正文 text-wrap: pretty
- 性能：屏幕外用 content-visibility: auto
- 动画只用 transform + opacity
- 尊重 prefers-reduced-motion / prefers-color-scheme
```

---

## 检验清单

- [ ] 字号用 rem，颜色用 variables
- [ ] 动画只用 transform/opacity
- [ ] 用 :focus-visible 而非去掉 outline
- [ ] 移动端全屏用 dvh
- [ ] 组件响应式用 container queries
- [ ] tooltip 用 anchor positioning
- [ ] 入场动画用 scroll-driven
- [ ] 优先级用 @layer 管理
- [ ] 标题 text-wrap: balance
- [ ] 尊重 reduced-motion 和 color-scheme
