# R9 · CSS能力与UI材质（提示词库 H 组）

> **定位**：不写一行 shader，纯 CSS 也能做出高级视觉——这一组是 UI 视觉的主战场，也是最多人只用了 20% 能力的地方。
> **覆盖层**：L3 肉 + L5 髓（L3 = 材质与光学质感层，L5 = 精致度与收尾层）。
> **条目卡格式**：`名称（英文）· L层级 · 档位（基础 / 进阶 / 电影级）· 成本（低 / 中 / 高）`，其下依次给出「视觉收益 / 实现路径 / 关键约束 / 强度档位 / 同族拓展 / 提示词片段」（按条目实际需要出现，非全部必填）。提示词片段可直接粘进生成指令。
> **来源**：融合自外部「视觉提示词库」H 组（v1.x，2026-08-16），已按本库命名规则改写全部交叉引用；组间引用统一写作 `R{n}·{原编号}`，本组自引用写作 `R9·H{n}`。总索引见 `R0`。
> **关键判断**：**能用 CSS 做的，不要用 canvas 做。** canvas 只留给真正需要逐像素计算的那一处峰值。

---

## 使用说明

`R3` 几何与光线、`R4` 体积与介质、`R5` 光照与色彩管线、`R6` 后期与镜头这几组是 GPU 里的图形学；本组是**浏览器免费给你的图形学**。现代 CSS 的合成能力已经能做到过去必须用 canvas 的效果，而且：可访问、可选中、SEO 友好、性能更好。

一个判断：**能用 CSS 做的，不要用 canvas 做**。canvas 只留给真正需要逐像素计算的那一处峰值。

```
H1 现代 CSS 能力白名单       H6 边框描边与 1px 极致
H2 混合模式与图层            H7 系统件定制（最被忽视）
H3 滤镜与材质隐喻            H8 CSS 动画与 Houdini
H4 遮罩与形状裁切            H9 布局能力
H5 渐变的高级用法
```

---

## H1 现代 CSS 能力白名单（2026）

**先知道有什么，才谈得上用。** 这些都已是 Baseline 或接近 Baseline。视觉维度的全量清单另见 `B15`。

- **布局类**：`subgrid`｜`container queries (@container / cqw)`｜`anchor positioning`｜`aspect-ratio`｜`gap` 全面支持｜`place-items`
- **选择器类**：`:has()`（父选择器，改变游戏规则）｜`:is()/:where()`｜`:focus-visible`｜`::marker`｜`::backdrop`｜`:nth-child(an+b of S)`
- **色彩类**：`oklch()/oklab()`｜`color-mix()`｜`color(display-p3)`｜相对颜色语法 `oklch(from var(--c) l c h)`｜`light-dark()`｜`currentColor`
- **排印类**：`text-wrap: balance / pretty`｜`text-box-trim / text-box-edge`（真正解决垂直居中）｜`hanging-punctuation`｜`font-variation-settings`｜`size-adjust`｜`field-sizing: content`
- **视觉类**：`backdrop-filter`｜`mix-blend-mode`｜`mask`｜`clip-path`｜`filter` 链｜`conic-gradient`｜`@property`
- **动画类**：`animation-timeline: scroll() / view()`｜`View Transitions API`｜`@starting-style`（进场动画不用 JS）｜`transition-behavior: allow-discrete`（可动画 display）｜`linear()` 缓动函数
- **组件类**：`<dialog>`｜`popover` 属性｜`:popover-open`｜`details/summary` 手风琴｜`inert`
- **单位类**：`dvh/svh/lvh`（移动端视口）｜`clamp()`｜`cqw/cqi`｜`rem` + `rlh`
- **函数类**：`round()/mod()/rem()`｜`calc-size()`（可动画 auto 高度）｜`attr()` 扩展

  - 提示词片段：`优先用现代 CSS 实现视觉：oklch 色彩、container query 响应、:has() 状态联动、@starting-style 进场、animation-timeline 滚动驱动、text-wrap:balance 标题；只在真正需要逐像素计算处才上 canvas`

> **升级心法**：每次想写 JS 实现某个视觉效果时，先问一句"CSS 现在能做吗"。2026 年的答案越来越经常是"能"。

---

## H2 混合模式与图层（Blend Modes & Layering）

**最被低估的 CSS 视觉工具。** 一个 `mix-blend-mode` 能替代一整套图层处理。

- **混合模式（mix-blend-mode）** · L3 · 进阶 · 成本:低
  - 视觉收益：图层之间产生"光学关系"而非简单遮挡，立刻有印刷/摄影的质感
  - 常用选型：
    - `multiply` — 叠印、阴影、油墨（暗化）
    - `screen` — 发光、加光、星空叠加（亮化）
    - `overlay / soft-light` — 加对比且保留底层材质（最常用于纹理叠加）
    - `difference / exclusion` — 反相效果，做**自适应文字/光标**（在任何背景上都可见）
    - `color-dodge` — 强发光核心
    - `hue / color / luminosity` — 只取某一属性，做单色化与调色
  - 同族拓展：`background-blend-mode`（同元素内多背景混合）、`isolation: isolate`（限制混合范围）、blend 与 opacity 的叠加顺序
  - 提示词片段：`文字用 mix-blend-mode: difference 保证在任何背景上都可读；纹理层用 overlay 叠加；发光元素用 screen`

- **自适应反色元素（Difference Blend Trick）** · L5 · 进阶 · 成本:低
  - 视觉收益：自定义光标/标题在浅底变深、深底变浅，**零 JS 实现内容感知**
  - 关键约束：`difference` 会产生鲜艳的反色，纯灰底才得到干净的黑白反转
  - 提示词片段：`自定义光标用 background:white + mix-blend-mode:difference，自动适配任何底色`

- **图层隔离与层叠上下文（Isolation & Stacking）** · L3 · 基础 · 成本:低
  - 视觉收益：混合模式不"漏"到不该影响的层
  - 同族拓展：`isolation: isolate`、`z-index` 层级令牌化、`transform` 创建层叠上下文的副作用
  - 提示词片段：`混合层的父容器加 isolation:isolate；z-index 用令牌（--z-base/-overlay/-modal）不用魔法数字`

- **多重背景（Multiple Backgrounds）** · L3 · 基础 · 成本:低
  - 视觉收益：一个元素叠加渐变 + 噪点 + 图案 + 高光，无需多层 DOM
  - 同族拓展：`background-blend-mode` 组合、background 层顺序（先写的在上）
  - 提示词片段：`卡片背景叠 3 层：顶层微噪点(overlay) + 中层斜向高光渐变 + 底层主色，用 background-blend-mode 组合`

- **加性发光层（Additive Glow Layer）** · L3 · 进阶 · 成本:低
  - 视觉收益：纯 CSS 的"Bloom"——一个模糊放大的副本用 screen 叠在下面
  - 同族拓展：伪元素复制 + blur + screen、`filter: blur()` + `opacity`
  - 提示词片段：`发光元素加 ::before 副本，scale 1.15 + blur 24px + mix-blend-mode:screen，模拟 Bloom`

---

## H3 滤镜与材质隐喻（Filters & Material Metaphors）

**UI 的"材质"决定气质。** 每种材质隐喻都有正确做法和廉价做法。材质与风格的谱系定位见 `B16` 与 `E1`。

- **毛玻璃（Glassmorphism / backdrop-filter）** · L3 · 进阶 · 成本:中
  - 视觉收益：半透明模糊背景，层次分明且现代
  - **取舍提示**：`B82` 与 `B44` 把"毛玻璃 / 玻璃拟态"列为**高风险默认值**（容易撞脸），建议主动偏离或加入属于本项目的额外约束（专属底色、非常规描边、材质噪点、异形裁切）；但这是**参考清单，不是硬性铁律**，按项目自行取舍——用得对的毛玻璃依然是好设计。
  - **正确做法（缺一项就廉价）**：
    1. `backdrop-filter: blur(20px) saturate(160%)` — **必须加饱和度提升**，否则发灰
    2. 半透明白/黑底色（`rgba` 或 `color-mix`），不是纯透明
    3. **1px 内描边高光**（顶部亮、底部暗）模拟玻璃厚度
    4. 极细噪点打破纯净感
    5. 轻微外阴影建立悬浮
  - 关键约束：背景必须**有内容可模糊**（渐变/图片/色块），纯色背景上的毛玻璃等于半透明块
  - 同族拓展：`backdrop-filter: brightness()` 调整、`@supports` 回退、性能（大面积 backdrop-filter 很贵）
  - 提示词片段：`毛玻璃五件套：blur(20px) saturate(160%) + rgba 底色 + 顶部 1px 白色内高光渐变 + 2% 噪点 + 柔和外阴影；背景必须有可模糊的内容`

- **新拟态（Neumorphism）** · L3 · 进阶 · 成本:低
  - 视觉收益：柔和的凸起/凹陷，像从同色背景挤压出来
  - 关键约束：**对比度极差**，只能用于装饰不能用于关键交互；必须配合其他手段区分可点击性
  - 同族拓展：双向 box-shadow（亮/暗）、inset shadow 做凹陷、`--shadow-light/-dark` 令牌
  - 提示词片段：`新拟态用双向阴影（左上亮 + 右下暗，同色系）；仅用于装饰元素，关键按钮必须另加边框或色彩区分`

- **黏土拟物（Claymorphism）** · L3 · 进阶 · 成本:低
  - 视觉收益：厚圆角 + 内高光 + 大柔和阴影，可爱蓬松
  - 同族拓展：大 border-radius、内 inset 白色高光、双层柔和阴影、高明度低饱和配色
  - 提示词片段：`黏土风：border-radius 32px + 内顶部白色 inset 高光 + 两层柔和彩色阴影`

- **CSS 滤镜链（Filter Chain）** · L3 · 进阶 · 成本:中
  - 视觉收益：`blur/brightness/contrast/saturate/hue-rotate/sepia/invert/drop-shadow` 组合出丰富效果
  - 高级技巧：`blur() + contrast()` 组合可做**液态融合（gooey effect）**——模糊后拉对比，边缘重新锐化并粘连
  - 同族拓展：`drop-shadow`（跟随 alpha 形状，比 box-shadow 强）、SVG filter（`feTurbulence` 做扭曲/噪声）、`filter` 顺序影响结果
  - 提示词片段：`液态融合效果：容器 filter: blur(10px) contrast(20)，子元素靠近时自动粘连；文字阴影用 drop-shadow 跟随字形`

- **SVG 滤镜（SVG Filters）** · L3 · 电影级 · 成本:中
  - 视觉收益：CSS filter 做不到的——程序化噪声、置换扭曲、光照浮雕
  - 同族拓展：`feTurbulence`（Perlin 噪声）、`feDisplacementMap`（扭曲）、`feDiffuseLighting/feSpecularLighting`（浮雕/金属）、`feMorphology`（膨胀腐蚀）、`feComposite`
  - 提示词片段：`用 SVG feTurbulence + feDisplacementMap 做纸张/水面扭曲；用 feSpecularLighting 做金属浮雕文字`

- **噪点纹理（Noise Overlay）** · L3 · 基础 · 成本:低
  - 视觉收益：**成本最低的"去 AI 味"手段**（判定口径参考 `B82` / `B44`，按项目取舍）。任何纯色/渐变面加 2–4% 噪点立刻有物质感
  - 实现路径：SVG `feTurbulence` 内联 data-URI（推荐，无请求）/ 小 PNG 平铺 / CSS 渐变技巧
  - 同族拓展：见 `R6·D3` 胶片颗粒、`R7·E2` 纸纹、动态噪点（会呼吸）vs 静态
  - 提示词片段：`全站叠一层 SVG feTurbulence 噪点（baseFrequency 0.8，opacity 3%，mix-blend-mode:overlay），data-URI 内联`

---

## H4 遮罩与形状裁切（Mask & Clip）

**让方形的 DOM 不再是方形。** 这是打破"卡片堆砌"最直接的手段。

- **CSS 遮罩（mask-image）** · L3 · 进阶 · 成本:低
  - 视觉收益：用渐变/图形/文字做遮罩，实现柔和淡出、形状裁切、局部显现
  - 高频用法：
    - 渐变遮罩做**边缘淡出**（列表滚动的软边、长文渐隐）
    - 径向遮罩做**聚光揭示**（跟随鼠标的探照灯）
    - 双重遮罩做**镂空描边**（`mask-composite: exclude`）
  - 同族拓展：`mask-composite`、`-webkit-mask` 前缀、SVG mask、`mask-type: luminance/alpha`
  - 提示词片段：`横向滚动列表两端用 mask-image 线性渐变淡出 48px；hover 时用径向遮罩做跟随鼠标的聚光揭示`

- **形状裁切（clip-path）** · L3 · 进阶 · 成本:低
  - 视觉收益：多边形/圆形/自定义路径裁切，画面有"被剪出来"的现代感
  - 强度档位：轻微斜切（一角 24px）/ 明显多边形 / 复杂路径
  - 同族拓展：`polygon()/circle()/inset()/path()`、`shape()` 函数（新，可用相对单位）、clip-path 动画（顶点数需一致）、见 `R11·F3` 遮罩擦除
  - 提示词片段：`区块用 clip-path polygon 做单角斜切（不是四角圆角），制造现代印刷感；转场用 clip-path 动画`

- **文字遮罩填图（Text as Mask）** · L3 · 进阶 · 成本:低
  - 视觉收益：巨型文字里填充图片/视频/渐变/shader，极高视觉冲击
  - 同族拓展：`background-clip: text` + `color: transparent`、`mask` 用文字、见 `R10·I4` 文字作为图形
  - 提示词片段：`巨型标题用 background-clip:text 填充动态渐变或 canvas 内容；保留可选中与可访问性`

- **形状环绕（shape-outside）** · L3 · 进阶 · 成本:低
  - 视觉收益：文字沿非矩形形状环绕，杂志排版感
  - 同族拓展：`shape-outside: circle()/polygon()/url()`、`shape-margin`
  - 提示词片段：`正文沿主图轮廓环绕（shape-outside 用图片 alpha），shape-margin 16px，杂志式排版`

- **滚动软边与溢出提示（Scroll Fade）** · L5 · 基础 · 成本:低
  - 视觉收益：告诉用户"还有内容"，同时视觉更柔和
  - 同族拓展：`mask` 渐变、`scroll-timeline` 驱动的动态淡出（只在可滚动时出现）
  - 提示词片段：`可滚动容器两端 mask 淡出，且用 animation-timeline:scroll() 让淡出只在实际可滚动的一侧出现`

---

## H5 渐变的高级用法（Advanced Gradients）

**"紫蓝线性渐变"常被视为 AI 味 signature**（`B82` / `B44` 把它列为高风险默认值，建议主动偏离，但这是参考清单不是硬性铁律，按项目自行取舍）。渐变本身不是问题，用法才是。

- **锥形渐变（conic-gradient）** · L3 · 进阶 · 成本:低
  - 视觉收益：饼图、旋转光晕、彩虹环、棋盘格、**渐变描边**
  - 同族拓展：`repeating-conic-gradient`（棋盘/放射）、配合 `@property` 做旋转动画
  - 提示词片段：`按钮描边用 conic-gradient 旋转（配合 @property --angle 动画），产生流光边框`

- **多停止点与非线性插值（Multi-Stop & Easing）** · L3 · 进阶 · 成本:低
  - 视觉收益：两点渐变必然有"灰死带"。**加中间停止点或用 OKLCH 插值**才通透
  - 关键约束：在 sRGB 空间插值经过灰点；`in oklab` / `in oklch` 才保持饱和
  - 同族拓展：`linear-gradient(in oklch, ...)`、色相插值方向（`shorter/longer hue`）、渐变缓动（多停止点模拟）
  - 提示词片段：`所有渐变加 in oklch 插值；两色渐变必须补 1-2 个中间停止点避免灰死带`

- **网格渐变（Mesh Gradient）** · L3 · 进阶 · 成本:中
  - 视觉收益：多个径向渐变叠加产生的有机彩色晕染，比线性渐变高级得多
  - 同族拓展：多个 `radial-gradient` 叠加、动画各自漂移、配合噪点、canvas/shader 版本（见 `R4·B3`）
  - 提示词片段：`背景用 4 个错位 radial-gradient 叠加成 mesh gradient，各自以不同周期缓慢漂移（20-40s），叠 3% 噪点`

- **渐变做图案（Gradient Patterns）** · L3 · 进阶 · 成本:低
  - 视觉收益：纯 CSS 生成网格、条纹、圆点、格纹、等距线，无需图片
  - 同族拓展：`repeating-linear-gradient`、多背景叠加、`background-size` 控制周期、见 `R8·J2` 平铺系统
  - 提示词片段：`底纹用 repeating-linear-gradient 双向叠加做 1px 网格，周期 32px，透明度 4%`

- **渐变遮罩组合（Gradient + Mask）** · L3 · 进阶 · 成本:低
  - 视觉收益：渐变不作为颜色而作为**透明度/强度的控制器**，效果更细腻
  - 提示词片段：`用渐变作为 mask 控制噪点强度（顶部强底部弱），而非直接用渐变上色`

- **告别默认渐变（Anti-Default Gradient）** · L3 · 基础 · 成本:低
  - 关键约束：留意常见默认三件套——`紫→蓝 135°`、`粉→橙`、`青→紫`（`B82` / `B44` 列为高风险默认值，建议主动偏离；参考清单，非硬性禁令）
  - 提示词片段：`避开紫蓝/粉橙/青紫的 135° 线性渐变；改用同色系明度渐变、或 mesh gradient、或渐变+噪点组合`

---

## H6 边框描边与 1px 极致（Borders & Hairlines）

**细节控的战场。** 边框做对了，整体精致度上一个台阶。

- **发丝线（Hairline / 真 1px）** · L5 · 进阶 · 成本:低
  - 视觉收益：高 DPR 屏上 1px CSS = 2-3 物理像素，看着粗。真发丝线更精致
  - 实现路径：`transform: scaleY(0.5)` 伪元素 / `box-shadow: 0 0 0 0.5px` / `border-width: thin`
  - 提示词片段：`分隔线用 0.5px（高 DPR 屏）并配合 @media (min-resolution) 回退到 1px`

- **渐变描边（Gradient Border）** · L3 · 进阶 · 成本:低
  - 视觉收益：边框本身是渐变，比纯色边框高级
  - 实现路径：`border-image` / 双层背景 + `background-origin` / `mask-composite: exclude` 镂空 / `padding-box + border-box` 双背景技巧
  - 同族拓展：流光边框（配合 `@property` 旋转 conic）、发光边框
  - 提示词片段：`卡片用双背景技巧做渐变描边：background: linear-gradient(内容色) padding-box, conic-gradient(描边) border-box`

- **内描边与外描边（Inset vs Outset Stroke）** · L5 · 基础 · 成本:低
  - 视觉收益：`box-shadow: inset 0 0 0 1px` 做内描边不影响盒模型；`outline` + `outline-offset` 做偏移外框
  - 同族拓展：`outline-offset`（负值做内嵌框）、`ring` 效果（多层 box-shadow）
  - 提示词片段：`焦点环用 outline 2px + outline-offset 3px（不用 box-shadow，保证高对比模式可见）`

- **圆角与边框的同心（Concentric Radius）** · L5 · 进阶 · 成本:低
  - 视觉收益：嵌套元素的圆角不同心会明显别扭
  - 关键公式：`外半径 = 内半径 + 间距`
  - 同族拓展：见 `R1·G5` 圆角系统、`squircle`（`corner-shape` 属性 / SVG path）
  - 提示词片段：`嵌套圆角遵循 外半径=内半径+padding；用 CSS 变量计算而非手填`

- **多层阴影（Layered Shadows）** · L5 · 进阶 · 成本:低
  - 视觉收益：单层阴影生硬，**3–5 层递增的阴影**才像真实光照（"smooth shadow"）
  - 同族拓展：阴影缓动曲线（各层 offset/blur/alpha 按曲线递增）、彩色阴影（取元素主色）、`drop-shadow` vs `box-shadow`
  - 提示词片段：`阴影用 4 层递增（1px/2px/4px/8px offset，alpha 递减），颜色取主色低饱和暗化而非纯黑`

- **分隔的替代方案（Beyond Divider Lines）** · L1 · 进阶 · 成本:低
  - 视觉收益：**用间距、色块、背景差分组，比画线高级**。满屏分隔线是廉价的信号
  - 同族拓展：见 `R1·G3` 间距节奏
  - 提示词片段：`优先用间距与背景色差分组；分隔线只在必要处用，且透明度 ≤8%`

---

## H7 系统件定制（System UI Elements）※ 最被忽视

**滚动条、选区、焦点环、占位符、自动填充——这些默认样式会瞬间暴露"没做完"。**

- **滚动条（Scrollbar）** · L5 · 基础 · 成本:低
  - 视觉收益：默认滚动条会打破整体设计语言
  - 同族拓展：`scrollbar-width: thin`、`scrollbar-color`（标准）、`::-webkit-scrollbar` 系列（细节控制）、`scrollbar-gutter: stable`（防布局跳动）
  - 提示词片段：`滚动条用 scrollbar-width:thin + scrollbar-color 匹配主题；容器加 scrollbar-gutter:stable 防跳动`

- **文本选区（::selection）** · L5 · 基础 · 成本:低
  - 视觉收益：选中文字时的颜色是**免费的品牌触点**，几乎没人做
  - 提示词片段：`::selection 用品牌强调色背景 + 保证对比度的前景色；深色模式单独定义`

- **焦点环（Focus Ring）** · L5 · 基础 · 成本:低
  - 视觉收益：好看的焦点环 = 专业 + 可访问。删掉焦点环 = 业余
  - 关键约束：**绝不 `outline: none` 不给替代**；用 `:focus-visible` 只在键盘导航时显示
  - 提示词片段：`:focus-visible 用 2px outline + 3px offset，品牌色；:focus（鼠标点击）不显示；高对比模式下用 currentColor`

- **占位符与自动填充（Placeholder & Autofill）** · L5 · 基础 · 成本:低
  - 视觉收益：浏览器自动填充的黄色背景会毁掉表单设计
  - 同族拓展：`::placeholder`、`:autofill` / `:-webkit-autofill`（用 `box-shadow: inset` 覆盖背景）、`::file-selector-button`
  - 提示词片段：`::placeholder 用 60% 不透明度的前景色（不用灰色）；覆盖 autofill 黄底（用 inset box-shadow 技巧）`

- **原生控件（Native Controls）** · L5 · 进阶 · 成本:低
  - 视觉收益：复选框、单选、range、progress、select 的原生样式往往不匹配设计
  - 同族拓展：`accent-color`（最省事的一招）、`appearance: none` + 自绘、`::-webkit-slider-thumb`、`<selectmenu>`/可定制 select
  - 提示词片段：`先试 accent-color 统一原生控件；需要完全自定义时保留原生语义元素 + appearance:none`

- **文档级细节（Document Chrome）** · L5 · 进阶 · 成本:低
  - 视觉收益：`theme-color`（移动端浏览器栏染色）、favicon 完整套件、`color-scheme`（原生控件跟随主题）、`::-webkit-scrollbar` 在 `html` 上、overscroll 行为
  - 同族拓展：`overscroll-behavior: none`（防橡皮筋穿透）、`accent-color`、动态 favicon、OG 图
  - 提示词片段：`设 meta theme-color 匹配页面主色（含深浅两版）；html 设 color-scheme；模态框加 overscroll-behavior:contain`

- **打印样式（Print Stylesheet）** · L5 · 进阶 · 成本:低
  - 视觉收益：页面被打印或存 PDF 时不崩
  - 同族拓展：`@media print`、`@page`、`break-inside: avoid`、`print-color-adjust`
  - 提示词片段：`加 @media print：隐藏交互元素、展开折叠内容、链接显示 URL、避免元素跨页断裂`

---

## H8 CSS 动画与 Houdini

- **可动画自定义属性（@property）** · L5 · 进阶 · 成本:低
  - 视觉收益：注册类型后，CSS 变量可以被 transition/animation 插值——**渐变角度、颜色、数值都能动画了**
  - 同族拓展：`@property --angle { syntax: '<angle>' }`、动画渐变、动画 conic 旋转、计数器动画
  - 提示词片段：`用 @property 注册 --angle/--progress，实现渐变旋转与数值计数动画（纯 CSS 无 JS）`

- **进场动画（@starting-style）** · L5 · 进阶 · 成本:低
  - 视觉收益：元素首次出现时的动画，不需要 JS 加 class
  - 同族拓展：`@starting-style`、`transition-behavior: allow-discrete`（可动画 display/popover）
  - 提示词片段：`弹层进场用 @starting-style + transition-behavior:allow-discrete，纯 CSS 实现进出场`

- **滚动驱动动画（Scroll-Driven Animations）** · L5 · 进阶 · 成本:低
  - 视觉收益：见 `R11·F2`。原生实现，跑在合成线程上，比 JS 监听流畅
  - 同族拓展：`animation-timeline: scroll()/view()`、`animation-range`、`timeline-scope`
  - 提示词片段：`区块入场与进度条用 animation-timeline: view()，不用 IntersectionObserver`

- **Paint / Layout Worklet（Houdini）** · L3 · 电影级 · 成本:中
  - 视觉收益：用 JS 画 CSS 背景（`paint()`），程序化图案/噪声/手绘边框，且可被 CSS 变量驱动
  - 关键约束：支持度有限（Chromium 系），必须有回退
  - 同族拓展：`CSS.paintWorklet`、`registerPaint`、Typed OM
  - 提示词片段：`可选用 Paint Worklet 画程序化手绘边框/噪点；必须提供纯 CSS 回退`

- **合成层友好动画（Compositor-Friendly）** · L5 · 基础 · 成本:低
  - 视觉收益：只动 `transform` 与 `opacity` 才能 60fps+；动 `width/top/box-shadow` 会持续重排重绘
  - 同族拓展：`will-change`（节制使用）、`contain: layout paint`、`content-visibility: auto`（长页性能）
  - 提示词片段：`动画只用 transform 与 opacity；长页区块加 content-visibility:auto；不滥用 will-change`

- **视图过渡（View Transitions）** · L5 · 进阶 · 成本:低
  - 视觉收益：见 `R11·F3`。同文档与跨文档都支持
  - 提示词片段：`用 View Transitions 做区块与页面切换；给关键元素 view-transition-name 实现共享元素连续`

---

## H9 布局能力（Layout Capabilities）

- **父选择器联动（:has()）** · L1 · 进阶 · 成本:低
  - 视觉收益：容器根据子元素状态改变样式，**大量原本需要 JS 的视觉联动现在纯 CSS**
  - 同族拓展：`:has(:checked)`、`:has(> img)`、`:has(:focus-within)`、数量查询 `:has(> :nth-child(4))`
  - 提示词片段：`用 :has() 实现状态联动（表单校验态、卡片有图无图的不同布局、展开态父容器变化），减少 JS`

- **容器查询（Container Queries）** · L1 · 基础 · 成本:低
  - 视觉收益：组件响应自身容器而非视口，在任何位置都排版正确
  - 同族拓展：`@container`、`cqw/cqi/cqb`、`container-type: inline-size`、style queries `@container style(--variant: x)`
  - 提示词片段：`组件用 @container 响应自身宽度；卡片内字号用 cqi 单位随容器缩放`

- **子网格（Subgrid）** · L1 · 进阶 · 成本:低
  - 视觉收益：嵌套组件对齐到外层网格，卡片内的标题/正文/按钮跨卡片对齐
  - 提示词片段：`卡片列表用 subgrid 让各卡片的标题行、正文行、按钮行跨卡片严格对齐`

- **锚点定位（Anchor Positioning）** · L1 · 进阶 · 成本:低
  - 视觉收益：tooltip/弹层相对锚点定位并自动翻转，无需 JS 定位库
  - 同族拓展：`anchor-name`、`position-anchor`、`position-try-fallbacks`
  - 提示词片段：`tooltip 与下拉用 anchor positioning + position-try-fallbacks 自动翻转，替代 Popper.js`

- **流式排版（Fluid Typography & Spacing）** · L1 · 基础 · 成本:低
  - 视觉收益：字号间距连续缩放，无断点跳变
  - 同族拓展：`clamp()`、`min()/max()`、`round()` 对齐基线、Utopia 式流式标尺
  - 提示词片段：`字号与间距全部用 clamp() 流式；标题 clamp(2rem, 6vw, 5rem)；不在断点处跳变`

- **视口单位正确用法（Viewport Units）** · L1 · 基础 · 成本:低
  - 视觉收益：移动端浏览器地址栏收起时 `100vh` 会跳，`dvh` 才对
  - 同族拓展：`dvh/svh/lvh`、`100dvh` 全屏、`env(safe-area-inset-*)`
  - 提示词片段：`全屏区高度用 100dvh（不用 100vh）；四周留 env(safe-area-inset) 边距`

---

## 本组 · 组合速查

| 想要的效果 | 组合 |
|---|---|
| 高级毛玻璃面板 | `R9·H3` 五件套 + `R9·H6` 多层阴影 + `R9·H6` 同心圆角 + `R9·H2` isolation |
| 纯 CSS 电影感 | `R9·H3` 噪点 + `R9·H2` overlay 纹理 + `R9·H5` mesh gradient + `R9·H2` 加性发光 |
| 流光边框按钮 | `R9·H5` conic-gradient + `R9·H8` @property 角度动画 + `R9·H6` 双背景描边 |
| 内容感知文字/光标 | `R9·H2` mix-blend-mode: difference |
| 液态融合图标 | `R9·H3` blur+contrast 滤镜链 |
| 打破卡片堆砌 | `R9·H4` clip-path 斜切 + `R9·H4` mask 淡出 + `R9·H6` 去掉分隔线用间距 |
| 巨型文字填图 | `R9·H4` background-clip:text + `R9·H5` 动态渐变 |
| 完整"做完了"的感觉 | `R9·H7` 全套（滚动条/选区/焦点环/placeholder/theme-color/print） |
| 零 JS 的响应式组件 | `R9·H9` container query + `R9·H9` :has() + `R9·H9` subgrid + `R9·H1` clamp |
| 零 JS 的滚动动效 | `R9·H8` animation-timeline: view() + `R9·H8` @starting-style |

**常见坑**：
- 毛玻璃很脏/很灰 → `R9·H3` 缺 saturate() 提饱和，或背景无内容可模糊
- 渐变中间发灰 → `R9·H5` 缺 `in oklch` 插值或中间停止点
- 阴影很生硬 → `R9·H6` 用了单层阴影，改 4 层递增
- 嵌套圆角别扭 → `R9·H6` 不同心，用 外=内+padding
- 混合模式影响了不该影响的层 → `R9·H2` 缺 isolation:isolate
- 滚动时布局左右跳 → `R9·H7` 缺 scrollbar-gutter:stable
- 焦点框被删了 → `R9·H7` 错误做法，应设计好看的 :focus-visible
- 动画卡顿 → `R9·H8` 动了 width/top/box-shadow，改 transform/opacity
- 移动端全屏区高度跳 → `R9·H9` 用了 100vh，改 100dvh
- 一眼 AI 味 → `R9·H5` 用了紫蓝 135° 默认渐变；`R9·H3` 缺噪点（判定参考 `B82` / `B44`，按项目取舍）

> **本组的检验方法**：打开 DevTools，看你的 CSS 里出现了几个"2020 年之后才有的属性"。如果一个都没有，你在用十年前的工具做 2026 年的视觉。

---

## 与库内衔接

| 本文小节 | 目标库相关文档 | 关系 |
|---|---|---|
| H1 现代 CSS 能力白名单 | `V14` 现代CSS视觉玩法 | 地基 — V14 给出现代 CSS 视觉玩法的库内基线，本文是可检索的能力清单与提示词化扩展 |
| H1 现代 CSS 能力白名单 / 全组术语 | `F1` CSS术语 | 地基 — 属性与函数的术语释义以 F1 为准，本文只做能力编排 |
| H2 混合模式与图层 / H3 材质隐喻 | `B64` 光与材质的界面表达 | 扩展 — B64 讲光与材质的设计意图，本文提供 mix-blend-mode / filter / 阴影层数的具体参数落法 |
| H3 毛玻璃（backdrop-filter） | `V2` 模糊景深与玻璃 | 扩展 — V2 是库内玻璃与景深主文档，本文补"五件套"清单与失败模式 |
| H4 遮罩与形状裁切 | `V5` 遮罩裁切形状 | 扩展 — V5 定形状语言，本文补 mask-composite / clip-path 动画 / shape-outside 细节 |
| H5 渐变的高级用法 | `V3` 渐变与色彩效果 | 扩展 — V3 定渐变的审美取向，本文补 oklch 插值、mesh、conic、渐变做图案的实现 |
| H1 / H6 / H9 工程落法 | `F4` Tailwind与shadcn模式速查 | 验证 — 用 F4 核对这些能力在 Tailwind / shadcn 体系下的写法与令牌落点 |
| H3 材质与风格取向 | `B16` 风格谱系、`E1` 趋势与竞品 | 验证 — 材质隐喻要落在明确风格坐标上，避免默认值堆叠 |
| H5 / H3 反默认值判断 | `B82`、`B44` | 验证 — 作为参考清单核对高风险默认值（毛玻璃、紫蓝渐变等），不作硬性铁律，按项目取舍 |
| 全组视觉维度覆盖 | `B15` 全维度清单 | 验证 — 用 B15 检查是否有视觉维度被漏掉 |
| H7 系统件定制、H8 合成层友好动画 | `T` 系列度量与验收 | 验证 — 焦点环、reduced-motion、性能项进入验收清单 |

---

## 参考资料

- 本文融合自外部「视觉提示词库 H 组：CSS 能力与 UI 材质」（v1.x，日期 2026-08-16），迁移时保持条目结构、L 层级、档位、成本、强度值域、同族拓展与提示词片段不变，仅改写交叉引用编号并移除源库的项目专属内容。
- 技术术语与参数值（`backdrop-filter`、`mix-blend-mode`、`mask` / `clip-path`、`@property`、Houdini、container queries、`oklch` 插值、噪点 baseFrequency 与不透明度、阴影层数等）来自该库原始调研，未新增未经验证的数据。
- 浏览器支持度随时间变化：使用前按当期 Baseline 状态复核，并为 Houdini、`corner-shape`、`calc-size()` 等尚未全面支持的能力保留回退。

---

_迁移版本：R9（提示词库 H 组 · CSS 能力与 UI 材质）_
_原则：能用 CSS 做的不要用 canvas 做；canvas 只留给唯一的那处峰值_
