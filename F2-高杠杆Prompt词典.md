# F2 · 高杠杆 Prompt 词典

> B61 做的是"**情绪/调性** → 整套 CSS 配方"（先定人格再展开参数）。
> 本文件做的是"**品质微词汇** → 英文触发词 → 具体技术实现"的三列速查——写一个词，触发一整组精工。
> 粒度不同：B61 是"整盘菜的调性"，这里是"单个佐料的配方"。

---

## 使用方式

prompt 里加一个"触发词"，就能带出对应的一组技术实现。例如：
```
"卡片设计要有 crafted 品质感"
```
AI 应该输出的不是一句"精致的设计"，而是：分层阴影 + 光学对齐 + 等宽数字 + 嵌套圆角公式 + 内部间距用比例阶梯。

---

## 一、精致与品质感

| 目标 | 触发词 | 具体实现 |
|---|---|---|
| 精致感 | crafted, polished, refined | 分层阴影（微阴影 + 扩散阴影）/ 光学居中而非数学居中 / 等宽数字 `font-variant-numeric: tabular-nums` / 嵌套圆角公式（外-padding≈内）/ 卡片间距用模块化比率 |
| 成品级 | production-ready, ship-ready | 所有交互有 `:focus-visible` / hover/active/disabled 四态完整 / 骨架屏加载 / 错误兜底 / 列表空态 / reduced-motion 降级 |
| 像素级精细 | pixel-perfect, surgical | 图标对齐到 4px 网格 / 文字基线对齐 / 阴影 y 偏移为 4 的倍数 / 排版用 `text-wrap: balance` / 标点悬挂 / 无孤字 `text-wrap: pretty` |
| 珠宝级 | jewel-like, gem-quality | 高光 1px 内边框 `inset 0 1px 0 rgba(255,255,255,0.1)` / 多层投影（面阴影+边阴影+环境阴影）/ 色彩用 oklch 高纯度小面积强调 / 微渐变（1% 明度差）替代纯色 |
| 手工感 | handcrafted, artisanal | 不规则手绘线条 SVG / 有机圆角（不对称 border-radius）/ 噪点纹理叠加 / 手写体点缀 / 颜色不用纯色用微偏暖 |
| 克制的 | restrained, understated | 色彩 ≤3 种 / 最大字重 ≤600 / 装饰元素 ≤2 / 动效 ≤250ms / 间距用大留白而非大色块 |

---

## 二、动效品质

| 目标 | 触发词 | 具体实现 |
|---|---|---|
| 编排感 | choreographed, orchestrated | 入场三层（结构→内容→装饰）/ stagger step 60ms / 总时长 ≤800ms / 有因果链（B71 第四节） |
| 弹性手感 | springy, bouncy, tactile | Spring stiffness 260 / damping 12 / 明显回弹 / 或 `cubic-bezier(0.34, 1.56, 0.64, 1)` 近似 |
| 顺滑 | buttery, silky, smooth | 只用 transform + opacity / 60fps 不丢帧 / `will-change` 在动画前加后删 / spring 临界阻尼无回弹 |
| 电影感 | cinematic, dramatic | 入场慢（800-1200ms）/ `cubic-bezier(0.16, 1, 0.3, 1)` / clip-path 揭示 / 暗背景 + 亮主体 / 大字号慢动 |
| 有呼吸 | breathing, alive, organic | 背景微浮动（`translateY ±4px / 4s infinite alternate`）/ 光球缓慢漂移 / 装饰元素随滚动轻微视差 |
| 干脆利落 | snappy, crisp, responsive | 时长 ≤180ms / ease-out / 按钮 scale 0.97→1 / 无回弹 / 即时反馈 |
| 级联式 | cascading, staggered, waterfall | Stagger 递减步长（长列表）/ 网格对角线延迟 / 中心扩散（底部 Tab）/ 总时长 ≤800ms |

---

## 三、布局与空间

| 目标 | 触发词 | 具体实现 |
|---|---|---|
| 呼吸感 | spacious, breathing, generous | 段落 margin = 字号 × 1.5 / section gap ≥ 80px / 版面率 ≤ 55% / 文字区 max-width 65ch |
| 信息密集 | dense, data-rich, compact | 行高 1.3 / 间距 4-8px / 紧凑 padding（12px）/ 表格化排布 / 小字号 13px / 等宽数字 |
| 模块化 | modular, bento, compartmentalized | CSS Grid / grid-template-areas 命名区域 / 不等分卡片（span 2）/ gap 统一 16px / 圆角统一 |
| 流体的 | fluid, intrinsic, content-aware | 全用 clamp()/ auto-fit+minmax / 无媒体查询断点 / 容器查询 / 间距跟随视口 |
| 构图感 | composed, editorial, art-directed | 非对称分栏（38:62 黄金比）/ 图文错位 offset / z-index 层叠穿插 / 大留白制造焦点 |
| 全屏沉浸 | immersive, fullscreen, hero-takeover | height: 100dvh / 背景铺满 / 文字居中叠加 / 暗色蒙层 / 滚动指示 |

---

## 四、色彩与视觉风格

| 目标 | 触发词 | 具体实现 |
|---|---|---|
| 高端深色 | dark luxury, obsidian, premium dark | 背景 oklch(15% 0.01 250) / 表面层 +3%明度 / 微光边框 `border: 1px solid rgba(255,255,255,0.06)` / 金色/铜色点缀 |
| 温暖亲切 | warm, friendly, approachable | 色温偏暖（oklch hue 50-80）/ 圆角 ≥12px / 字重 ≤500 / 插画 / 行高 1.6+ |
| 冷峻专业 | cold, clinical, professional | 色温偏冷（hue 220-260）/ 圆角 4-6px / 字重 500-600 / 无装饰 / 对比分明 |
| 霓虹酸性 | neon, acid, cyberpunk | `color(display-p3 ...)` 广色域 / 黑底 / 纯度拉满 / 发光 `text-shadow: 0 0 8px` / 无圆角 |
| 柔和中性 | muted, neutral, earthy | 饱和度 ≤0.06 / 明度 50-70% / 暖灰基调 / 自然色点缀 / 无纯色 |
| 渐变质感 | gradient-rich, aurora, iridescent | mesh gradient 或 conic-gradient + blur / 噪点叠加 / oklch 渐变避免灰带 / 微动态 |

---

## 五、响应式与工程

| 目标 | 触发词 | 具体实现 |
|---|---|---|
| 真正响应式 | fluid, container-aware, intrinsic | 容器查询（组件级）/ clamp()（字号间距）/ auto-fit+minmax / 逻辑属性（RTL）/ dvh（移动端） |
| 无障碍完整 | accessible, a11y-complete, WCAG-ready | 语义 HTML / ARIA 模式 / `:focus-visible` / 对比度 ≥4.5:1 / reduced-motion / 最小触控 44px |
| 性能优先 | performant, lightweight, fast | `content-visibility: auto` / 图片 lazy+srcset / 关键 CSS 内联 / 动画只用 transform+opacity / 字体 `font-display: swap` |
| 主题化 | themeable, token-driven, skinnable | CSS 变量三层（semantic→reference→primitive）/ `light-dark()` / `prefers-color-scheme` / 一键换肤 |
| 语义化 | semantic, well-structured | `<article><section><aside><nav>` / heading 层级正确 / landmark 齐全 / 列表用 `<ul/ol>` |

---

## 六、反面触发词（让 AI 不要做的）

| 触发词 | 效果 | 替代说法 |
|---|---|---|
| "好看一点" | AI 加一堆渐变阴影 → 过度设计 | "干净克制，一处高光" |
| "modern" | 全站蓝色渐变 + 圆角 16px → 通用 | 指定风格："Stripe-like / Linear-like" |
| "make it pop" | 加大加粗加鲜艳 → 对比失控 | "增强标题与正文的跳跃率（1.5+）" |
| "add some animations" | 全部 fade in → 无编排 | "入场编排：标题先 → 副标200ms后 → 卡片 stagger 60ms" |
| "responsive" | 加几个断点 → 断裂 | "fluid intrinsic，用 clamp() + auto-fit，无硬断点" |
| "user-friendly" | 加大按钮加引导 → 幼稚 | "affordance 清晰 + progressive disclosure" |
| "professional" | Inter + 蓝灰 + 无个性 → 统计平均 | 给具体参考："Linear 式暗色 + 一处品牌色 accent" |

---

## 七、组合使用（风格包）

### 高端 SaaS 暗色
```
crafted + dark luxury + snappy + dense + container-aware + semantic
```
→ 精致阴影、深色表面分层、临界阻尼无回弹、紧凑布局、容器查询响应式

### 温暖社交产品
```
warm + friendly + springy + spacious + a11y-complete + breathing
```
→ 暖色大圆角、弹性微交互、大留白、动效有呼吸、无障碍完善

### 极简编辑感
```
restrained + editorial + composed + pixel-perfect + cinematic
```
→ ≤3色、不对称构图、大字号慢入场、像素级排版细节

### 活力消费品
```
bouncy + cascading + neon + modular + fluid
```
→ Spring 回弹、stagger 级联、高纯度霓虹、Bento 网格、全流体

---

## 八、Prompt 模板

```
【品质触发词】
请以 {crafted / dark luxury / choreographed / container-aware} 品质生成界面。
具体含义参照：
- crafted = 分层阴影 + 光学对齐 + 嵌套圆角公式 + 等宽数字
- dark luxury = oklch(15%) 背景 + 表面分层 + 微光边框 + 金铜点缀
- choreographed = 三层入场 + stagger 60ms + 退场0.6× + 重叠编排
- container-aware = 容器查询 + clamp() + 逻辑属性

不要做的（反面）：
- 不要 "make it pop"（对比失控），要"一处高光"
- 不要全站相同 fade-in，要按层级编排
- 不要硬编码断点，要 fluid intrinsic
```

---

## 九、检验清单

- [ ] 使用了明确的品质触发词而非模糊词（"好看"/"modern"）
- [ ] 每个触发词后面有具体的技术约束
- [ ] 避免了反面触发词（"pop" / "add animations" / "responsive" 等万金油词）
- [ ] 风格包内的词不冲突（不同时要"dense"和"spacious"）
- [ ] 触发词的组合能回溯到具体 CSS 属性/值
