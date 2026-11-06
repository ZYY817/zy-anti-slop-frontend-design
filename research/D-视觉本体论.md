# D-视觉本体论 · 剥掉风格后"好界面"由什么构成
（调研期 A4 · 2026-11 · 方法：每条规则压成"决策点+验收句"，压不出的是感想）

## 各流派发现

**Refactoring UI（Schoger/Wathan）**——本调研最重要的方法论样本：它不卖风格，只卖" tactic（战术）"：层级不靠字号堆，靠字重+明度（正文近黑/次级灰/辅助浅灰三档，字重两档 400/600 足够）；先加过量留白再往回删；**避免歧义间距**（组间距必须明显大于组内距）；边框是最后手段（阴影/明度差/间距优先）；深度=模拟单一光源（小阴影=微抬=可点，大阴影=浮层）；基线对齐而非居中；彩色底上不用灰字改用降透明度白字。全书目录本身就是维度清单。来源：refactoringui.com、medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886

**typography-first 学派**——Reichenstein：界面信息 95% 是文字，"把文本当 UI"；微观排版=可读性细节，宏观排版=格式/网格/层级关系（ia.net/topics/the-web-is-all-about-typography-period）。Butterick 把它落成数字：正文四决定项=字号(网页15-25px)、行距(120-145%)、行长(45-90字符)、字体；全大写加 5-12% 字距；段落缩进与段间距二选一；居中慎用（practicaltypography.com/summary-of-key-rules.html）。

**"高级感"拆解（Linear/Stripe/Vercel/Raycast）**——共性可枚举：①交互密度≠视觉密度，每元素三态齐备但画面克制；②灰度 chrome+单一强调色，色彩让给内容（Stripe 全站 3 色；Vercel 全灰）；③一套强调机制用到底（Stripe 只用 italic，从不 bold）；④深度用明度差不用阴影（Stripe 卡片=背景+15-20%亮度）；⑤图标统一 stroke/圆角规则（Raycast 官方博客原话）；⑥键盘可达且每操作有视觉确认；⑦spec 是底线不是目标、减范围即提质量（Karri 10 rules）。来源：mantlr.com/blog/stripe-linear-vercel-premium-ui、plinthstudio.dev/blog/stripe-linear-loom-design-lessons、dupe.design/blog/design-dna-extraction、figma.com/blog/karri-saarinens-10-rules…、raycast.com/blog、blakecrosley.com/guides/design/raycast

**经典框架**——CRAP 四原则即四个动词：对比（不同就做得很不同）、重复（同构同源）、对齐（每元素必有连接对象）、亲密（近=相关）（designlab.wisc.edu、SFU 讲义）。Tufte：data-ink ratio——可迁移为"每个像素要么传信息要么是噪音"；lie factor=视觉尺寸与数值成比例（guypursey.com、spectrum.ieee.org/tufteisms）。Gestalt/NN-g：分组由邻近+留白+共域传达；视觉层级=color/size/alignment/character 四类对比（nngroup.com/articles/visual-hierarchy-ux-definition）。Laws of UX：aesthetic-usability（美被认为更好用）、Doherty<400ms、Fitts、Von Restorff 隔离强调（lawsofux.com）。

**空间与节奏**——8pt 网格：尺寸/padding/margin 全取 8 的倍数（小元素可用 4），像素对齐保锐利（spec.fm/specifics/8-pt-grid）。模数阶：字号=基值×比率（1.25 major third 适合 dense UI，1.333 perfect fourth 适合落地页），比率决定层级对比度（modularscale.com、imperavi.com/books/ui-typography）。光学对齐：播放三角按视觉重心向"轻"侧偏移；圆形需放大至方 112.84% 面积（凸包）才显等大；大标题收紧字距（marvelapp.com、bjango.com/articles/opticaladjustments、railsdesigner.com）。

**motion 编舞**——M3：时长按面积分档（小100-200/中250-300/大300-375ms），进场 decelerate、离场 accelerate 且更短，>400ms 显慢；桌面应比移动端快（150-200ms）（m3.material.io/styles/motion、m2.material.io/design/motion/speed.html、m1.material.io/motion/movement.html）。Emil Kowalski：高频动作不该有动画（Raycast 开合零动画），每个动画须能指认目的——空间连续性/因果/反馈，指认不出就删（emilkowal.ski/ui/you-dont-need-animations）。

**视觉层级专项**——眼动：文本页 F 型（前两行+左缘获最多注视→标题前两词承载信息）、图片页 zigzag、有标题分层时 layer-cake（nngroup.com/articles/text-scanning-patterns-eyetracking）。Gutenberg 阅读重力：左上=最强首视区、右下=终视区（放主 CTA）。squint/blur test：模糊 5-10px 后应仍能读出分组与第一焦点（nngroup.com、polypane.app）。

## "好"的可分解维度清单（核心产物：每条=管什么｜决策点｜验收句｜来源）

| # | 维度 | 管什么 | 决策点 | 验收句 | 来源 |
|---|------|--------|--------|--------|------|
| 1 | 焦点序 | 什么先被看到 | 首视点放哪、主焦点是否唯一 | 模糊5-10px后第一焦点仍可指认且唯一 | nngroup visual-hierarchy |
| 2 | 权重分配 | 同级/跨级差异多大 | 强调手段组合（尺寸/字重/明度/留白） | 相邻级差异≤3个变量；次级信息降明度不加字号 | Refactoring UI ch.2 |
| 3 | 视线流 | 阅读路径是否顺 | 布局匹配 F/Z/层蛋糕哪种 | 关键信息落左上→右下路径；标题前两词有信息 | nngroup eyetracking |
| 4 | 分组 | 谁和谁一伙 | 组内距:组间距比值 | 无"等距歧义"：组间距明显>组内距 | Refactoring UI、CRAP |
| 5 | 行长 | 文本容器多宽 | 正文容器宽度 | 45-90字符（UI内45-75） | practicaltypography |
| 6 | 行高 | 行间呼吸 | line-height | 正文120-145%；字号越大比值越小 | Butterick+R-UI |
| 7 | 字号阶 | 大小系统是否同源 | 基值+比率+级数 | 所有字号取自同一模数阶；级数≤6 | modularscale |
| 8 | 间距阶 | 空间是否同源 | 间距取值集合 | 全取8pt倍数（微调4pt）；无任意px | spec.fm 8pt |
| 9 | 对齐 | 秩序感 | 每元素对齐哪条边/基线 | 每元素能指出它对齐的对象；文本按基线 | CRAP、R-UI |
| 10 | 光学校正 | 数学对齐的偏差 | 何时人工偏移 | 图标按视觉重心移；圆≈方112.84%面积 | bjango、marvelapp |
| 11 | 深度 | 层级空间感 | 深度线索选型 | 深度与可交互一致；明度差优先，边框最后 | R-UI、Stripe拆解 |
| 12 | 对比度 | 可读底线 | 文本-背景比 | 正文≥4.5:1，大件/大字≥3:1 | WCAG 2.1 |
| 13 | 色彩约束 | chrome 用几个色 | 灰度+强调色数量 | chrome 灰度系+强调色≤1；强调色只给要跳出的 | Stripe/Vercel、Von Restorff |
| 14 | 强调系统 | 用什么手段强调 | 全站主强调机制选定 | 一种机制用到底（如仅 italic/仅色块），不叠加 | Plinth·Stripe |
| 15 | 信噪比 | 元素存在理由 | 每个元素的增删 | 删之无损则删；装饰须答出信息功能 | Tufte data-ink |
| 16 | 微状态 | 交互响应完整度 | 每组件几个态 | default/hover/focus/active/disabled/loading/empty 齐 | Mantlr 共性、D4 |
| 17 | 反馈速度 | 操作是否"活着" | 反馈延迟预算 | 可见反馈<400ms；高频路径无动画 | Doherty、emilkowal.ski |
| 18 | 动效参数 | 时长/曲线 | 每动画 duration+easing | 100-375ms按面积分档；进decelerate/出accelerate | M3 tokens |
| 19 | 一致性 | 同源重复 | 哪些属性必须 token 化 | 圆角/阴影/描边/缓动各一份；同功能同构 | CRAP、Raycast图标 |
| 20 | 范围克制 | 放不放 | 元素/功能取舍 | 减到不能再减；宁少而精（spec 是底线） | Karri rules 7/8 |
| 21 | 密度匹配 | 信息多 vs 松 | 密度档位（dashboard/落地页） | 密度页小字阶比+窄间距档；营销页反之 | imperavi modular |

## 写不成词的（诚实列出：有决策点、无验收句，或两者皆无）

- **个性选型本身**：决策点可列（衬线/圆角/色相→气质映射），但"选哪个"无法证伪——只能给映射表，不能给对错（Refactoring UI ch.1.4）。
- **craft 密度阈值**：Karri 明说"缺陷可数，卓越不可数"——细节做到什么程度算够，验收只能是"人味评审"，规则只能管"每个细节都要有理由"。
- **何时破规则**：不对称/破网格产生的张力是"好"的重要来源，规则只能标"允许破"，判据回到人眼。
- **新颖度/差异化**："遮 logo 认得出"无法写成像素条件（B85 已有近似代理：原创性三问）。
- **图像/插画/文案质量**：本体是内容层问题（归 A5/F 线）。
- **色相取向**：HSL 关系可规则化，具体色相选择是品牌判断。
- **整体 coherence**：由 21 维合成、无单一验收句——squint test 是目前最接近的代理指标。
- **惯例 vs 突破的边界**：Jakob's law 告诉你跟随惯例，不告诉你何时该打破——这是判断不是规则。
