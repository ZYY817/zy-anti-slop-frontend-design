# G-廉价与高级机制 · 一手拆解文中的可验收机制
（调研期 A6 · 2026-11 · 方法：每条压成"廉价表现→高级做法→验收句"，压不出的放文末参考。格式：机制｜廉价表现｜高级做法(数值/操作)｜决策点｜验收句｜来源）

## 一、层级与排版（Refactoring UI 系）

| # | 机制 | 廉价表现 | 高级做法（具体数值/操作） | 决策点 | 验收句 | 来源 |
|---|------|----------|---------------------------|--------|--------|------|
| 1 | 层级三档色+两档字重 | 全靠字号大小区分主次 | 文本三档：近黑(非纯黑)主文/灰次级/浅灰辅助；字重两档 400(或500)+600(或700)；UI 禁用 <400 字重 | 每段文本归哪档 | 全屏文本≤3 个明度档且每个元素能说出档位 | medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886 |
| 2 | 彩底降对比 | 彩色底上放中性灰字（#999 类）发脏 | ①降不透明度白字让底色透出；②取背景同色相、调饱和明度手挑色 | 用①还是② | 任何彩色底上无中性灰字 | 同上 |
| 3 | 强调靠弱化 | 主元素继续加大加粗仍不突出 | 转而弱化竞争元素（降对比/降明度）；强调预算花在次要元素上 | 弱化谁 | 一页一个真·主操作；破坏性动作不自动=大红粗按钮，除非它是主操作 | gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5 |
| 4 | 字号同阶 | 每个场景拍一个新字号（46 vs 48 之争） | 模数阶：低档小跳、高档大跳；阶内级数≤6-8（例 14/16/20/32/64）；阶内任意两值差不<25% | 基值+比率 | 全站字号值∈同一集合 | gist 同上 + plinthstudio.dev/blog/stripe-linear-loom-design-lessons |
| 5 | 行长行高 | 全宽正文、行高默认值 | 行长 45-75 字符（20-35em）；行高正文 1.4-1.6、大标题可 ~1.1；字越大行高比值越小 | 容器宽+每档行高 | 正文容器实测字符数落区间内 | gist + devshakib.jumyn.com/blog/the-unglamorous-details-that-make-an-interface-feel-expensive |
| 6 | 对齐纪律 | 长文居中、数字列居中 | >2-3 行一律左对齐；数字右对齐并配 tabular-nums | 对齐规则 | 无>3 行居正文；数值列单位对位 | gist + adamarant.com |
| 7 | 字距随字号阶走 | 全站 letter-spacing:0 | 大标题负字距 -0.01~-0.04em（Linear -0.022em；Vercel -0.02~-0.04em）；12px 全大写标签 +0.04~0.06em；正文 0 | 按阶定字距 | 字距值存在 type scale 每一档上，不是全站一个值 | plinthstudio + dupe.design + adamarant.com/en/blog/optical-alignment-in-ui-7-spacing-fixes-math-gets-wrong |

## 二、间距与分组

| # | 机制 | 廉价表现 | 高级做法 | 决策点 | 验收句 | 来源 |
|---|------|----------|----------|--------|--------|------|
| 8 | 间距阶 token 化 | 13/14/15/18px 并存干同一件事 | 4 或 8 基值集合（4/8/12/16/24/32，段间 64/96）写成 token；原始数字禁入组件（可 lint） | 间距集合 | 全站间距值∈一个集合，grep 无散值 | adamarant 9-details + devshakib + uxren.cn/?p=72151 |
| 9 | 组间距>组内距 | 等距歧义：看不出谁和谁一伙 | 块间间距明显>块内（例：块间 30 > 标题-正文 20 > 行内 10） | 两级间距比值 | 任取相邻两级，外>内且无"看不出分组"处 | uxren + gist("more space around the group than within it") |
| 10 | 先过量留白 | 一开始就塞满再抠 | Start with too much whitespace，再往回收到"刚好" | 何时停 | 首版留白多到不舒服再收 | gist |
| 11 | 不撑满屏 | 拉伸内容填满宽屏 | 需要 600px 就用 600px；不用 % 除非真要缩放 | 容器宽 | 无"为了填满"的拉伸件 | gist |

## 三、高级感拆解（Stripe/Linear/Vercel/Raycast）

| # | 机制 | 廉价表现 | 高级做法 | 决策点 | 验收句 | 来源 |
|---|------|----------|----------|--------|--------|------|
| 12 | 灰度 chrome+单强调色 | 多色并用、色即是装饰 | chrome 全灰度；强调色=1：Stripe 全站 3 色(黑/白/#635BFF)只给标题词/CTA/链接；Linear #5E6AD2 每视口≤1 次（"荧光笔只用一次"）；Vercel 纯黑白+#0070F3，色只给产品输出 | 强调色额度 | 每屏强调色出现可数（≤~3 处）且只在 CTA/节标/激活态 | plinthstudio + opendesigner.io/blog/recreating-stripe-linear-vercel-design-systems-with-design-md + dupe.design |
| 13 | 一套强调机制 | bold+italic+变色混用 | 选 1 种用到底、禁用其余：Stripe 全站只用 italic，0 bold、0 变色强调 | 强调手段白名单 | 全站强调手段数=1 | plinthstudio |
| 14 | 明度差代阴影 | 卡片一律上投影 | 卡片面=背景+15~20% 亮度（Stripe #0A2540→#0D3251）；暗色主题靠提亮而非投影分层 | 深度手段选型 | 有明度差的面无阴影；每处阴影能说出高度级 | dupe.design + gradiently.design/guide/css-box-shadow |
| 15 | 字体即品牌 | 默认 Inter/Roboto 无辩护 | 选一款可辩护的字+大标题参数写死：Linear Inter Variable 80-96px/-0.022em/~500 重；Stripe Söhne(Klim)；Vercel Geist 96px/700/lh1.0 | 字体+标题三值 | 大标题有明确 size/weight/tracking 三值而非默认 | plinthstudio + mantlr.com(摘要) + dupe.design |
| 16 | 图标同源 | 两套库混用、emoji 当图标、16px 小图标放大 3-4x 显"chunky" | 单一图标集；stroke 匹配相邻字重；图标尺寸=所随行高；小图标要显大→套色块而非放大，或换为大会尺寸设计的精细集 | 图标规范 | 全站图标同源同 stroke；无被放大的小图标 | adamarant + medium refactoring-ui |
| 17 | 交互密度≠视觉密度 | 为"显高级"删功能或堆动画 | 每元素态齐备+键盘可达+50ms 级响应(Raycast 把>50ms 当硬约束)，画面保持克制 | 密度预算 | 功能不降、首屏无装饰噪音、每操作<50-400ms 有可见反馈 | mantlr.com(摘要) + blakecrosley.com/guides/design/raycast |
| 18 | 反模式明文禁 | "凭感觉"审 | 成文禁止清单：Linear 禁渐变底/圆角>8px/卡片阴影/正文<14px/每页>2 强调色；间距禁 32px（"两端都毁的值"） | 禁止清单 | 存在一份成文 anti-patterns 列表 | opendesigner.io |
| 19 | 克制=自信 | 装饰填空 | 每装饰元素问"Stripe 会发这个吗"，默认删；Vercel 避 60-80% 明度灰（纯底上发浑） | 装饰审查 | 每个非内容元素答得出功能 | plinthstudio + opendesigner.io |
| 20 | spec 是底线 | 做到 spec 就交差 | 减范围提质量(规则8)；"缺陷可数、卓越不可数"→定量项清零+定性人评(规则6)；为特定人设计(规则7) | 质量门槛 | 发布前已知缺陷=0，卓越靠评审不靠计数 | figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/ |

## 四、"为什么廉价"速查（原因→改法）

| # | 机制 | 廉价表现 | 高级做法 | 决策点 | 验收句 | 来源 |
|---|------|----------|----------|--------|--------|------|
| 21 | 边框是最后手段 | 分隔全靠 1px 线，满屏盒子 | 替代序：box-shadow → 双色背景 → 加间距 →（最后才）边框；发丝线可用 `0 0 0 1px` 影（随圆角） | 分隔手段优先级 | 每处边框答得出为何前面三种不行 | medium refactoring-ui + gradiently |
| 22 | 圆角嵌套公式 | 16px 按钮塞进 16px 卡，角不平行显肿 | 外半径=内半径+间距（12+8=20）；圆角阶 3-4 个值封顶 | 圆角集合 | 任取嵌套对满足公式；一屏圆角值≤4 | adamarant 9-details + devshakib |
| 23 | 数字不跳 | 比例数字表格/计时器横向跳 | `font-variant-numeric: tabular-nums`+右对齐 | 哪些列 | 数值更新时不位移 | adamarant |
| 24 | 状态齐备 | 只设计了静止态 | default/hover/pressed/focus(键盘可见)/disabled/loading 全；focus 不被 sticky 遮挡；目标≥24×24px | 态清单 | 每交互控件 6+ 态可演示 | adamarant + WCAG 2.2 |
| 25 | 换行受控 | 标题留孤词、长名顶飞布局 | 标题 `text-wrap:balance`；段落 `text-wrap:pretty`；数据字段预定义截断/两行/自适应规则并按最长真值测 | 逐字段规则 | 用最长真实数据测过 | adamarant |
| 26 | 加载不跳 | 图/横幅加载推挤按钮 | 图给宽高或 aspect-ratio；skeleton 同真实行高；横幅预留位；CLS≤0.1(p75) | 预留策略 | CLS≤0.1 | adamarant + web.dev |
| 27 | 灰字可读 | 浅灰在日光下消失、输入框找不到 | 正文对比≥4.5:1、大字≥3:1、控件边/勾选框≥3:1；灰阶≤3-4 级且按比值预设 | 灰阶档数 | muted token 构造即达标 | adamarant + WCAG |
| 28 | 真实内容 | lorem、"Submit"、每行恰好 3 条 | 空/1 条/超长/缺图/错误各一设计；复数用 Intl.PluralRules；按钮写动作 | 边缘态清单 | 6 种边缘态各有设计稿 | adamarant + uxren |
| 29 | 图不缩糊 | 大截图缩小发糊；低分辨率图 | 小屏重截或局部截；图标不放大（见#16） | 素材尺寸 | 无被缩放的截图、无低于显示分辨率的图 | gist |
| 30 | 按压即反馈 | tap 后 300ms 才有反应、只响应 release | 有意图的触摸≤1 帧(~16ms)给信号：按下即 scale 0.96、释放 spring 弹回(120ms/easeOutBack)；动画可中断；安全处乐观 UI | 反馈首帧 | 每个可点件 press-down 有即时可视反应 | devshakib |
| 31 | 加载不闪 | spinner 闪 80ms 消失 | skeleton 与真实布局同形+最小显示时长防频闪 | 最短时长 | 快响应下无 strobing | devshakib |
| 32 | 少特效 | 每元素重影/玻璃拟态堆叠 | 特效服务层级：发丝边线 1 色+elevation 影 1-2 档封顶 | 特效预算 | 阴影/模糊种类可数 | wellworks.cn + devshakib |

## 五、光学校正（数学对齐的反直觉修正）

| # | 机制 | 廉价表现 | 高级做法 | 决策点 | 验收句 | 来源 |
|---|------|----------|----------|--------|--------|------|
| 33 | 播放/尖角图标偏质心 | 三角形 bbox 居中显左偏 | 对齐质心而非包围盒：向尖端移 3-6% 图标宽（24px 字形≈1px，即 `translateX(1px)`） | 偏移量 | 100% 缩放下眼看居中（数学上是"偏"的） | bjango.com/articles/opticaladjustments + adamarant optical + devshakib(playNudge=2px) |
| 34 | 圆形补偿 | 同 box 的圆显小（内接圆只占方面积 π/4≈79%） | 按凸包面积等大：理论 112.84%；实战圆比邻居方件放大约 4-8%(devshakib 用 ×1.08) | 放大率 | 同排圆/方视觉等重 | bjango + adamarant + devshakib |
| 35 | 图标对文本 | bbox 垂直居中显偏高 1-2px | 相对 x-height/基线校准，下移 1-2px；按墨量不按 viewBox（24px 图标可能只有 20px 墨） | 对齐基准 | 图标与文字基线眼看平齐 | devshakib + adamarant |
| 36 | 尾部图标减距 | 尾随 chevron 自带留白致右显松 | 尾侧 padding 减 2-4px，或在图标集内裁 viewBox | 减多少 | 两侧视觉留白相等 | adamarant optical |
| 37 | 文字垂直居中 | line-box 居中导致"Save"显低 | 下 padding 少 1-2px；或 `text-box-trim`/`text-box-edge` 裁行盒（@supports 渐进） | 裁 or 补 | 按钮文字眼看居中 | adamarant |
| 38 | overshoot/悬挂标点 | 引号/圆符破段落左缘 | 引号 ::before 负 margin 或负 text-indent 外挂；字形层面 O 超高~3%、A~5%(cap-height 1-3%) | 悬挂策略 | 段落左缘看直线 | adamarant |
| 39 | 修正要命名 | 散落的 magic number | 修正写进组件并进 token：`--optical-shift-triangle:1px`；实例级 nudge 视为组件 bug | 落在哪层 | grep 可找到全部光学校正值 | adamarant + devshakib |
| 40 | 找错法 | 放大审漏掉 | 100% 截图→水平镜像→blur 8px 看质量分布；镜像后仍歪=真歪 | 审法 | 模糊后无失衡 | adamarant |

## 六、阴影/深度参数

| # | 机制 | 廉价表现 | 高级做法 | 决策点 | 验收句 | 来源 |
|---|------|----------|----------|--------|--------|------|
| 41 | 分层阴影公式 | 单层 `0 10px 30px rgba(0,0,0,.5)`=脏灰晕 | 接触影起 `0 1px 1px`@~8%，每层 offset+blur×2（1/2/4/8/16px），每层 alpha 5-10%；嫌重先删最大层而非加深 | 层数+alpha | 每层参数符合倍增规律 | gradiently + tobiasahlin.com/blog/layered-smooth-box-shadows |
| 42 | 阴影带色相 | 纯黑影压彩色底发灰 | 取背景色相的深版（mint 页→#134e4a、cream→#451a03、lilac→#3b0764），5-10%/层 | 阴影色 | 阴影色=背景最深 stop 的深版 | gradiently |
| 43 | 垂直偏移 | 大 blur+0 offset 的"雾团" | 加 Y 偏移模拟顶光；inset 影同法 | 光源方向 | 全站阴影光源方向一致（上方） | medium refactoring-ui |
| 44 | 负 spread 收边 | 大 blur 向四周侧漏灰晕 | `0 12px 24px -8px` 把影收到底下 | spread 值 | 侧缘无晕 | gradiently |
| 45 | 高度分档 | 一档影用全站 | 4 级：0=无或 1px 发丝线/1=sm 静止卡/2=md 悬停+下拉/3=lg 对话遮罩；越高越大越柔而非越黑 | 级数+映射 | ≤4 档且每档有指定用途 | gradiently |
| 46 | 暗色面提亮 | 暗色主题堆黑影看不见 | 抬升面=更亮的表面+发丝边线，不叠影；浮层可 backdrop-filter | 暗色深度策略 | 暗色主题层级靠明度可辨 | gradiently + dupe.design |
| 47 | 动影不卡顿 | hover 改 box-shadow 每帧重绘 | 大影放 ::after、只过渡 opacity(200ms)；50 卡片格不卡 | 动画手法 | 动画属性只含 opacity/transform | gradiently |

## 七、可机检清单项（design QA）

| # | 机制 | 验收句 | 来源 |
|---|------|--------|------|
| 48 | 像素容差 | 实现值与 spec 差≤2px；4px 间距差必为 bug 而非渲染误差（margin collapse 与 Figma gap 语义不同要查） | uiprobe.io + pinvari.com |
| 49 | 状态全图 | 每交互控件 6-8 态截图齐全：default/hover/focus/active/disabled/loading/error/empty | overlayqa.com/blog/design-qa-checklist + pinvari |
| 50 | 断点矩阵 | 1280+/768/375 三档（或 1920/1366/768/375 四档）布局正确、无横向滚动、无 <最小字号、图保纵横比 | overlayqa + pinvari |
| 51 | 键盘走查 | Tab 全页：序合理、focus 可见不被遮挡、目标≥24×24 CSS px（光学收边后复检） | pinvari + adamarant + WCAG 2.5.8 |
| 52 | 缩略审法 | 50% zoom 眯眼：不均间距/杂圆角先于内容暴露；镜像截图重置模式补偿 | adamarant 10-min check |
| 53 | 截图前提 | 评审截图前确认 webfont 已加载，否则量出的全是回退字体 | 21st.dev/blog/design-qa-checklist |
| 54 | 字号底线 | 桌面正文≥16px；14px 仅限次级/密表；type scale 6-8 档无 one-off | desisle.com 80-point |

## 参考（有决策点、压不出验收句）

- **触觉/声音/微文案**：devshakib 的最后一档（haptic 配事件权重、确认音克制、角落文案有"人声"）——可枚举做法，但"够不够暖"只能人评。
- **hero 文案压缩**：Plinth 第 7 条（一句话做 5 份工作、hero 最后写）——写法可述，验收不可数。
- **强调机制选哪种**：italic/字重/单色的映射可选，"选哪个"是品牌判断非对错。
- **mantlr 原文**：付费墙(402)+archive 429 未取到全文；搜索快照得其框架：5 个不变量=交互密度+响应/typography as brand/色彩克制/crafted microstates/物理隐喻，并指认一手源为 Rauno Freiberg《Devouring Details》、Linear Method、Karri 10 rules、Matt Ström-Awn Stripe dashboard 复盘；另驳"必须用 #2A2A2A"类聚合谣传（Stripe 用 Söhne、各家按品牌温度选值）。待取全文后补数值。
- **何时破例/新颖度**：同 D 篇结论——规则只能标"允许破"，判据回人眼。

## 参考资料（第 1 轮深挖）

一手全文：gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5 · medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886 · plinthstudio.dev/blog/stripe-linear-loom-design-lessons · dupe.design/blog/design-dna-extraction · opendesigner.io/blog/recreating-stripe-linear-vercel-design-systems-with-design-md · figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/ · adamarant.com/en/blog/why-your-ui-looks-unprofessional-9-details-to-fix-before-launch · adamarant.com/en/blog/optical-alignment-in-ui-7-spacing-fixes-math-gets-wrong · devshakib.jumyn.com/blog/the-unglamorous-details-that-make-an-interface-feel-expensive · bjango.com/articles/opticaladjustments · gradiently.design/guide/css-box-shadow · blakecrosley.com/guides/design/raycast
搜索摘要（未读全文）：mantlr.com/blog/stripe-linear-vercel-premium-ui(402) · tobiasahlin.com/blog/layered-smooth-box-shadows · fxcolorstudio.com/blog/css-box-shadow-guide · wellworks.cn/html/chanpinsiwei-show-1332.html · uxren.cn/?p=72151 · tremoloo.com/blog/why-ui-looks-off-spacing-color-typography · dev.to/pritish_academy/why-your-ui-looks-off-and-how-to-fix-it-1o6l · overlayqa.com/blog/design-qa-checklist · pinvari.com/blog/design-qa · uiprobe.io/learn/figma-design-qa-checklist-for-frontend-teams · desisle.com/resources/ui-design-checklist · 21st.dev/blog/design-qa-checklist
