# F · AI味病名表（一手清单扒录 · 校准用）

> 每条 = **病名｜症状｜根因｜修法｜❌/✅｜判据｜来源**。判据三档：**✓命中式**（出现 X 即可写检测）；**△密度/语境**（要堆叠或语义判断，单发不算）；**目**（只能截图/人眼）。可靠性标（强/中/弱）采 febbhav 口径。库内呼应：B44、B82、K10、Z3。

## 0. 来源缩写
- **[SKILL]** Anthropic frontend-design SKILL.md（2026-11 采样）— github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- **[M15]** Mowgli《15 Tells and Fixes》2026-10 — mowgli.ai/blog/why-ai-built-apps-look-the-same
- **[UX35]** uxskill《35 fingerprints》2026-05（每条带 regex+severity）— uxskill.laithjunaidy.com/blog/ai-design-fingerprints-list.html
- **[SIGNS]** febbhav/signs-of-ai-design（带 reliability/status 标签的活文档）— github.com/febbhav/signs-of-ai-design
- **[SLOPCOP]** Adrian Krebs 扫站器 18 模式（Playwright+computed style，误报 5–10%；1,590 个 Show HN 站 22% 中 ≥4 条）— news.ycombinator.com/item?id=48821493；转述 honterstudio.com/insights/make-website-look-less-ai-generated
- **[SITEPEEL]** 126 个 YC 首页实测（中位 9/100 分）— sitepeel.dev/reports/ai-slop-websites-2026/
- **[PIXEL]** 109 家 AI 创企品牌报告 — thepresentpixel.com/ai-sameness-report/
- **[FRAN]** Fran Pradas 30 条 vibe-coded 迹象 — franpradas.com/en/articulos/how-to-tell-if-a-design-is-vibe-coded
- **[FALIA]** falia.co 识别指南（Claude Code vs Codex 签名）— falia.co/en/insights/web-design/spot-ai-built-website/
- **[ANTISLOP]** anti-slop-ui skill 清单 — awesomeskills.dev/en/skill/anti-slop-design-anti-slop-ui
- **[AGT]** somnus0x/agt-skill-pack（15 条打分，≥6 即 AI）— github.com/somnus0x/agt-skill-pack
- **[COPY]** 文案腔词表 — github.com/samber/cc-skills/.../anti-patterns.md；oliviacal.com/post/ai-writing-tells
- **[HN]** HN 讨论 — item?id=49024805 / 48504912 / 49058547 / 48496483

## 1. Anthropic 官方锚（逐字段扒录）
- **"For calibration" 五聚类（原文）**：①a warm cream background (near #F4F1EA) + high-contrast serif display + terracotta/warm-clay accent (often near #D97757 — Anthropic 自陈是 Claude 交互色，用在甲方稿上即 tell)；②a near-black background + single bright acid-green or vermilion accent；③broadsheet 排版：hairline rules + zero border-radius + dense newspaper-like columns；④"the SaaS-card kit"：内容剁成全等圆角卡、一个 radius 不分层级、每卡同款 rgba(0,0,0,.1) 软灰影、gradient washes 当装饰；⑤"template chrome"：tracked-out ALL-CAPS eyebrow 压每个标题、'A · B · C' 中点 meta 串、'WORD — fragment' 间隔破折号标签、#0B0B0B/#111 染色近黑冒充黑、mono 字体做数据小标签、链接按钮尾挂 '→'。原文关键句："they are defaults rather than choices, and they appear regardless of subject…brief's own words always win"。
- **排版三禁例（原文）**："Accenting just a single word or phrase in a headline"（标题里只给一词换色/斜体）；"Using all caps for labels"；"Adding unnecessary typographic labels above content"。另："a big number with a small label, supporting stats, and a gradient accent is the default treatment"——hero 默认配方，非最佳选择别用。
- **结构原则（原文）**：01/02/03 编号 "only appropriate if the content actually is a sequence…check the content really is a sequence"；线条/编号/眉题/分隔线须"encode useful information rather than decorate it"。
- **动效原则（原文）**："fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated"；一次编排入场 > 散落效果；响应动作的动效才受欢迎。
- **Process 两阶段（原文结构）**：Pass1 产出紧凑 token 方案 = Color 4–6 named hex + Type 字体及角色 + Layout 概念（一句话散文+ASCII wireframe 比稿，含对齐指引）+ Principles；Pass2 对照 brief 自审——"work through a similar prompt to see if you arrive somewhere similar"，像默认就改写并说明改了什么为什么，确认独特性后才写代码。克制侧："Spend your boldness in one place"；Chanel 原则"出门前摘掉一件配饰"；截图自审"a picture is worth 1000 tokens"。

## 2. 病名总表

### A. 色彩
- **紫蓝/靛紫渐变**｜hero 洗底、渐变按钮，indigo-500 #6366F1/violet-500 #8B5CF6/purple-500 #A855F7 原值｜Tailwind UI 2019 demo 色（作者 Wathan 公开道歉）→教程复制→生成物回流训练集；2026 抓取：营销站蓝紫渐变渗透率 ~78%（2020 仅 ~10%）｜从产品世界取唯一 accent，`--color-*: initial` 重置命名空间｜❌`from-indigo-500 to-purple-600` ✅钢灰底+信号琥珀单点｜✓regex `from-(purple|violet|fuchsia|indigo)-(4|5|6)00…to-(blue|sky|cyan)`（中；active 但在迁移）｜M15#1 UX35-high SIGNS AICHECK FRAN#04 AGT
- **渐变字/单词跳色**｜`bg-clip-text` 标题彩虹字，或标题里只一个词变色/斜体｜三个 Tailwind 类即成的 demo 手法；SKILL 排版禁例第一条｜单色+字号/字宽/字重做层级｜❌"effortlessly" 渐变 ✅`text-7xl font-extrabold` 纯黑整句｜✓regex `bg-clip-text|background-clip:\s*text`（中）｜SKILL M15#2 UX35 AICHECK SITEPEEL-14% SIGNS SLOPCOP
- **紫粉 mesh/渐变滥用**｜radial/conic purple-fuchsia-pink 渐变 hero；全页装饰渐变 ≥13 处｜mesh gradient 是仅次于蓝紫的第二指纹；"one gradient sets an accent, twenty set none"｜单 accent+中性底；要用色相跨度 <60°｜❌紫粉球团 ✅一层低饱和邻近色/噪点｜✓UX35 regex；AICHECK 阈值 13（中）｜UX35 AICHECK FRAN#01
- **紫色辉光阴影**｜卡/按钮 `box-shadow rgba(120–149,…,0.5)` 紫调发光｜"AI premium"第二强指纹｜中性扩散影 `0 20px 40px -15px rgba(0,0,0,.08)`，色彩归面不归影｜✓shadow-purple-* 或 rgba(12x–14x（中）｜UX35 SIGNS
- **裸名 Tailwind 色**｜`bg-blue-500` 等直写无语义 token｜色彩系统从未被设计｜定义 primary/success/accent 映射一次｜✓`(bg|text|border)-…-(4|5|6)00`（弱，配 token 检查才准）｜UX35 AICHECK-16色
- **暗卡低对比**｜`bg-zinc-8/900` 上 `text-*-5/600/700`，不达 4.5:1｜暗色配对没测过｜暗面上 text-zinc-100~300，500–700 只留三级辅文｜✓配对 regex+对比度可算（高）｜UX35 SLOPCOP
- **纯黑/纯白通铺**｜#000 死黑底发硬；#FFF 到底无分区色调｜色温决策缺席｜带 tint 的中性阶；注意 #0B0B0B 也只是 SKILL 点名的"替身黑"｜✓纯值可检（弱-中）｜AGT FRAN#02 SKILL-c5
- **奶油+衬线+赤陶**｜#F4F1EA 系 cream 底+高对比衬线 display+#D97757 系 clay｜反紫浪潮的下一安全默认；"the 2026 default"｜palette from subject；禁令表不是方向｜❌cream+italic serif+Begin 按钮 ✅题材自带色｜△色值区间可检但 craft/food 品牌合法，误报高（中；active,rising）｜SKILL-c1 M15#13 SIGNS ANTISLOP-明标"replacement cliché" HN"brown sites"
- **近黑+酸绿/朱红**｜near-black+单一荧光 accent+辉光+mono 标签｜"techy"默认； Linear/Raycast 2019 手工风格被万队抄后被模型吸收｜暗色须有场景理由；中性向主色 tint、降彩度、去辉光｜△（弱单独；active）｜SKILL-c2 M15#12 FRAN#05 SIGNS
- **翡翠备胎 emerald fallback**｜prompt 禁紫后级联到 #10B981，甚至无视"别用绿"的书面指引｜习得层级里次高概率 accent｜命名色锁进 token 让默认类不编译｜✓hex（中；active）｜SIGNS
- **怯彩均权/教科书 pastel**｜多 muted 色等权无主导；mint+lavender+peach 同饱和均分｜大胆配色在训练数据中位数里本就稀有｜一个主色干一件事（可点击），其余带温/冷倾向的中性｜△（弱）｜SIGNS FRAN#03/06
- **broadsheet 报纸风**｜hairline 细分线+零圆角+密集报纸栏｜2026 新聚类（SKILL-c3）｜题材契合才用；否则给 radius/层级留白｜△｜SKILL-c3

### B. 字体
- **Inter/Geist/system-ui 独大**｜全页一族（Inter 当 display 尤甚）或纯 `-apple-system` 栈｜create-next-app v14.2 内嵌 Inter、现模板内嵌 Geist——模板默认即训练默认；SITEPEEL 实测第一 tell（33%）｜按题材选 1–2 族+明确角色，display 跳档 3x+；Inter 留正文则配 Geist/Satoshi/Cabinet Grotesk/Outfit 等 display｜✓font-family+字号配对 regex（弱单独、堆叠中）｜M15#3 UX35×2 SITEPEEL SIGNS FALIA
- **逃难字体成新 tell**｜Space Grotesk=逃 Inter 的反射；Instrument Serif 斜体巨字=最新反射；DM Sans/Satoshi="今年流行字"｜禁一个流行字只会把生成导向下一个高频默认｜字体从题材来，不从"不像 Inter"来｜✓名单可检（弱-中；Geist/Instrument Serif active,rising）｜SIGNS SITEPEEL-21% SLOPCOP M15-FAQ
- **衬线斜体巨标**｜italic serif 整行 hero 或 sans 标题里塞一个 serif-italic 词｜"tasteful AI startup"通用配方；PIXEL：funded AI 创企衬线标题 28% vs 老厂 5%——"Serif is the new purple"｜衬线要干活（editorial 题材）不当装饰｜△（中；rising）｜SIGNS PIXEL SKILL-c1 SLOPCOP
- **eyebrow 全大写追踪眉题**｜每个标题上 `uppercase tracking-widest` 小标签（FEATURES/PRICING/FAQ 复读）｜template chrome；"模型模板一节然后盖印"｜删；标题写具体（"What changes on Monday"），具体标题不需要标签｜✓regex `uppercase`+`tracking-(wide|widest)`（中；"most recognizable current tell"）｜SKILL-禁例 M15#9 SITEPEEL-18% SIGNS ANTISLOP
- **pill badge 徽章**｜居中巨标上压 "New"/"v2.0"/✨ 前缀 pill，或圆点+细线变体｜默认 AI SaaS hero 形状；无事也公告｜删；有真公告才挂｜✓（中）｜SIGNS SITEPEEL-13% ANTISLOP(sparkle+pulse dot)
- **mono 当氛围**｜正文/普通标签用等宽装 hacker 终端感｜SKILL-c5 template chrome 之一｜mono 只给真数据/代码｜✓font-family+元素角色（中）｜SKILL-c5 SIGNS
- **平字阶/任意 px**｜单族单重、档距 ~1.25x 无层级、display 字距挤、`text-[90px]`/`text-[112px]` 绕开字阶｜字体配对与尺度是要判断的，生成器跳过｜3x+ 跳档；扩 Tailwind scale 或 `clamp()` 流体｜✓`text-\[(9\d|1\d\d)px\]`（中）｜UX35 SIGNS M15

### C. 布局/Hero
- **居中 hero 公式**｜badge+≥64px 整句标题+一行副标+双 CTA（渐变主 "Get Started"+ghost 次）+背后 orb/glow｜训练数据里的模态 SaaS hero（它确实转化好才成模态）｜左对齐 7-5/8-4 编辑栅格；hero 摆产品世界最有特征物（rota/map/invoice/真截图）｜✓hero 容器内 `text-center` DOM 特征（中；公式零偏离+万能文案才确诊）｜M15#4 UX35 SIGNS SITEPEEL AGT ANTISLOP FALIA
- **万能三卡**｜`grid-cols-3` 全等卡：icon+短题+两行字；内容不是三也硬凑三｜Tailwind 教程三列起手+LLM 爱列三点互相喂养；"most consistently named tell"｜非对称：bento、2+1、4 中 1 跨宽；卡大小随内容优先级｜✓UX35 结构 regex（高）｜UX35 SIGNS M15#4 FALIA
- **bento 接班tell**｜三卡被点名后的安全替代，暗底 accent 色块｜逃逸路径本身收敛｜布局从内容层级来不是从"不像三卡"来｜△（中；active）｜SIGNS
- **大数 strip+假指标**｜10k+/99.9%/4.9★ 大数字小标签+渐变 accent+滚动计数；"Trusted by 5,000+ teams"配上月注册的域名｜hero 默认 follow-up；trust 模板不管事实有无｜一个产品真数（"13/14 班已排满"）或整条删｜❌编造横幅 ✅单一真数+状态 chip｜△数字可检、真伪要核（可核查且假=强）｜SKILL M15#5 SIGNS HN-49024805
- **logo 汤**｜页面中段灰阶客户 logo 墙，关系不存在也挂；全幻觉 logo 集｜中位页有此条于是生成器照发｜真关系才上；否则删｜△（伪造=强）｜SIGNS M15
- **01/02/03 假编号**｜非序列内容贴两位展示编号/圆圈步骤行｜editorial 脚手架深一层；模板镀铬｜编号只配真序列（流程/时间线）｜△｜SKILL M15#10 SIGNS ANTISLOP
- **模板九节骨架**｜hero→logo 墙→三卡→轮播评价→stats→pricing→FAQ→footer CTA 零偏离（2026 分析：约半数 indie SaaS pricing 页同九元模板）｜人类 playbook 同款，单看无罪；零偏离+其他指纹才确诊｜按内容重排，砍掉不配位的节｜△（弱单独）｜SIGNS
- **桌面汉堡**｜宽屏也把导航藏进汉堡｜响应式断点被跳过｜md: 起内联导航，汉堡加 `md:hidden`｜✓aria-label menu 无 `md:hidden`（低）｜UX35
- **无产品实图**｜hero 只有装饰无界面/实物（SITEPEEL：12%）｜默认公式里没有产品位｜hero 让产品自己出场：截图/短 demo/一句具体主张｜△｜SITEPEEL M15 PIXEL
- **点阵底纹**｜hero 灰点阵向边缘渐隐当质感｜免费"设计感"贴片｜表面差异应来自内容差异｜✓dot-grid background-image 特征（弱-中）｜FRAN#21
- **间距单调**｜全页 `p-4/gap-6/my-8` 同档，六屏滚动装两千字｜"稀疏 SaaS 极简=专业"被均一内化，无疏密节奏｜为强调压缩/扩张间距｜△｜SIGNS FRAN

### D. 卡片/表面/图标
- **SaaS 卡套**｜同 radius+同 `shadow-sm` rgba(0,0,0,.1)+渐变 wash+1px 浅边，件件像文档示例｜shadcn `Card`+shadow-sm 原封；"nobody changed a single token"｜主块放大、次级用细线分隔不用盒、radius 按角色、影只给 overlay｜✓token/样式对默认 token 块 diff（中-高）｜SKILL-c4 M15#6 SIGNS UX35-shadcn-default
- **圆角通胀**｜`rounded-full` 或统一 16–24px 抹平按钮/输入/卡/图｜iOS 教程指纹+shadcn 默认 radius+soft=modern 联想｜full 只给 pill/avatar/图标钮；主钮 md/lg；卡 xl/2xl——按角色分级｜✓（低-中）｜UX35 SIGNS FRAN#19
- **幽灵卡**｜hairline 边+宽散影同卡并存——两种描边都不承诺｜边缘处理无决断｜选边或选影，不一卡俩｜✓border+shadow 配对（中）｜SIGNS
- **卡中卡**｜每块内容装盒再盒套盒｜containment 显得"有序"，回避真层级｜外层留白/分隔线替代嵌套盒｜△｜SIGNS ANTISLOP
- **彩色边条**｜普通卡喷 3–4px 彩 top/left border｜从 alert 组件 pattern-match 来的装饰｜彩边只留语义处（真告警）｜✓（装饰用途=强）｜SIGNS SLOPCOP
- **玻璃+blob 气氛组**｜`backdrop-blur` 无透明面配对、`blur-3xl` 彩斑 blob 飘 hero 后｜一个类即得的"高级感"；FALIA：cards+pills+frosted glass 是 Codex 签名｜solid surfaces；半透明只给真叠层（sheet over map）；blur 必须配 `bg-white/70` 类填充｜✓blur 无透明 bg 配对（低-中；玻璃卡 SITEPEEL 22% 第二高发）｜M15#11 UX35 SITEPEEL SIGNS FALIA FRAN#18/20
- **图标染色方块**｜每卡 pale-indigo 圆角方块装 lucide（变体：超大线 icon 居中）｜lucide-react 随 shadcn 装机；通用 AI 特性卡形状｜装饰图标删；只留标动作的图标，`strokeWidth={1.5}` 统一；Phosphor/Tabler 换气质｜✓（中）｜M15#7 SIGNS AGT
- **Lucide 五件套**｜Sparkles=AI、Zap=快、Shield=安全、Check=优点、BarChart3=分析、ArrowRight=每个 CTA｜同库同选品跨产品复现｜按语义选图标或自绘；换图标库换性格｜✓图标名单（中）｜SIGNS
- **emoji 当图标**｜🚀✨📅🔔 进标题/按钮/列表/特性卡｜单文件零资产的最便宜"图标"；跨平台渲染不一、不吃品牌色｜删；要图标用 Lucide/Feather/Phosphor/Heroicons SVG `currentColor` 1.5–2px stroke；白名单仅 ✓(U+2713) ⌘(U+2318)｜✓emoji-range regex（强）｜M15#8 UX35×2 SIGNS FALIA ANTISLOP
- **假终端窗**｜三红点代码窗 mockup 当 hero，产品却不是 dev 工具｜训练数据 hero 视觉套路｜hero 视觉=产品自己的物｜△（中）｜SIGNS
- **塑料人头/插画**｜完美毛孔无神 generated headshot、光溜 3D blob 插画｜生成图默认审美｜真人真图或不放头像｜目（generated headshot=强）｜SIGNS

### E. 动效
- **fade-up 量产+hover 抬升**｜每节 `opacity:0,y:20` 同 stagger scroll-reveal；每卡 hover translate+加影（不可点也抬）｜Framer Motion 主导 React 动效语料；早期"staggered reveal"指引反噬成新默认｜一次编排入场，之后动效只回答动作（开/展/确认）；`prefers-reduced-motion` 必守｜✓类名/模式密度（弱单独）｜SKILL M15#15 SIGNS ANTISLOP FRAN#23
- **300ms+Material 曲线全家**｜`duration-300` 处处、`cubic-bezier(.4,0,.2,1)` 唯一曲线｜编辑器默认=零动效意图｜micro 150–220ms、复杂 250–400ms、exit=entry 60–70%；换 `(0.16,1,0.3,1)` 出/`(0.34,1.56,0.64,1)` 弹跳/弹簧｜✓（低）｜UX35
- **箭头尾巴/弹跳**｜按钮尾挂 '→' 或 `animate-bounce` 求关注｜文案扛不动才要箭头蹦｜CTA 写动词+宾语（"Build next week's rota"）；要箭头用静态 SVG，hover 挪 2–4px｜✓（中）｜SKILL-c5 UX35 M15#10 FRAN#22
- **动效不连贯**｜无过渡 snap 挨着 elaborate 卡动画、hover 装死、spinner 当唯一 loading、layout 属性硬动 jank｜教程孤立授效果，模型没见过自己输出跑起来｜动效系统级编排查漏；loading 用骨架/进度非万能 spinner｜目（中）｜SIGNS

### F. 文案
- **空词密度**｜Supercharge/Unlock/Unleash/Seamless/Empower/Revolutionize/All-in-one/World-class/Best-in-class/Robust/Comprehensive+Delve/Leverage/Foster/Streamline/Utilize+感叹号｜平均 SaaS 句；营销词密度即指纹｜点名用户+工作+具体数；CTA=动词+宾语且全程同名（Publish→Published）｜❌"Supercharge your workflow" ✅"Build next week's rota before Friday service"｜✓词表 regex（密度才算，中）｜M15#14+ban SIGNS COPY ANTISLOP FALIA
- **失重标题**｜"Build faster. Ship smarter.""Transform your X with Y"、三拍排比（"Build, ship, scale"）永不破节奏｜语法满分、可形容任何产品｜标题说这件产品才能说的话｜△（弱单独）｜SIGNS
- **破折号密+否定枢轴**｜em-dash 数倍于人类基线、"It's not just X. It's Y."、FAQ 复述页面已有内容｜LLM 句法指纹渗入 UI 文案｜率即信号：改写高密段落，FAQ 补真问题｜△rate（弱/实例，中/密度）｜SIGNS FRAN SITEPEEL
- **假信任层**｜★★★★★+"Game-changing tool!"+只有名没有姓/查无此人（"Sarah Chen"）、编合规徽章、John/Jane Doe/Test User、lorem ipsum 残留、"Platform X"/"20XX" 占位｜trust 元素属模板标配，事实有无不管｜实名+公司+具体结果；星数只聚合自真评价系统；占位名换贴合市场的人名｜✓词表+可核查（查无此人=强）｜UX35×3 SIGNS ANTISLOP HN-49024805
- **Title Case 一切+✦**｜标题/按钮/标签/图题全 Title Case 零漂移；四角 sparkle 当万能 AI 徽章｜模型逐词盖印；NN/g：用户根本不把 ✦ 读成 AI，纯 herd adoption｜sentence case 为主；✦ 只标真 AI 功能（也该少用）｜✓（弱-中）｜SIGNS NN/g
- **2026 新 buzz 腔**｜"agents"（≈1/8 创企标题）、"frontier"、"infrastructure/intelligence/operating system/platform"｜顶替两年前 "AI-powered" 的位置｜写能力别写范畴词｜✓词表（中）｜PIXEL AY

### G. 状态/工程泄漏
- **三态缺席**｜无 loading/empty/error 态、<375–390px 破、键盘 focus 不可见｜模型只走 happy path｜每屏 default+loading+empty+error 四态齐；390px 可用；focus 可见｜✓流程/断点检查（高）｜M15-always ANTISLOP SKILL
- **a11y 指纹六件套**｜`<svg>` 无 aria-label/hidden、`<img>` 无 alt、`<a>` 有 onClick 无 href、`<button>` 无 type、h1→h3 跳级、无限滚动无 Load more 按钮｜prompt 没逼它想屏幕阅读器——是 shipped bug 不只是坏品味｜逐条 regex 修复；装饰 svg `aria-hidden`、装饰图 `alt=""`｜✓全部可写（高/中）｜UX35 DEV
- **草稿泄漏**｜`console.log`、TODO/FIXME、`: any`/`as any`、`z-index:9999`、inline `style=`、`mt-[13px]`/`gap-[11px]` 任意间距、shadcn 默认 token 块（`--radius:0.5rem`+`--foreground:222.2 84% 4.9%`）、默认 favicon、©2024 过期、生成器签名（`@/components/ui/*`+Geist→v0；`lovable.dev` meta/"Built on Lovable"→坐实；Material Symbols→Gemini）｜代码没过真 review｜逐条清；z 轴建 token 刻度（base/dropdown/sticky/modal/toast）｜✓几乎全命中式（签名=强）｜UX35-quality×7 ANTISLOP SIGNS-code FALIA DEV
- **真数据缺席**｜假图表装饰数、整数无出处、真名配假统计（"44%–0% 事实核查率"@六家 AI deck 工具实测）｜图表演示模式非数据模式｜数据图表接真数据源；无源数字删｜△（可核=强）｜SIGNS SITEPEEL

## 3. 二阶收敛警报（避开同一批特征后漂向哪）
- **官方时间线**（M15）：2025-12 指南还在打 Inter+紫渐变 → 2026-06 新聚类已是 cream+衬线+赤陶、近黑+酸绿、broadsheet → 2026-09 再加 SaaS 卡套+template chrome。原话："Removing one cliche can expose the next one."
- **"Serif is the new purple"**（PIXEL）：funded AI 创企衬线标题 28% vs 老厂 5%；新制服=抽象符号 logo（74%）+黑白底+绿/橙单 accent+"agents"标题。
- **备胎链**：禁紫→emerald（SIGNS 命名 emerald fallback，甚至违抗"别用绿"）；禁 Inter→Geist/Space Grotesk/Instrument Serif 各自成 tell（M15-FAQ/SIGNS）；Sitepeel 实测 DM Sans/Satoshi 已占 21%——"流行字"本身是 tell。
- **bento 接班三卡**（SIGNS）："spread as the safe alternative once three-card rows were called out, and is now a tell of its own"。
- **cream 已在被反噬**：SIGNS 标 cream "active, rising"；HN-48504912 "so many brown sites that look all the same"；ANTISLOP 直接把 cream+terracotta 与 black+acid green 列为"replacement cliche"；AY 的"anti-gradient minimalism"作为 2026 趋势=下一制服候选。
- **工具层同证**：HN-49058547——impeccable/ui-ux-max/hallmark 等 skill"all seem to converge on the same thing"；hallmark 被迫记 `.hallmark/log.json` 硬失败"重复上次页面结构/主题"的运行（其 nav-rotation 规则自承"most-violated"）。
- **机制**（SIGNS"Why models converge"四因：statistical averaging+toolchain defaults+preference tuning+feedback loop）决定禁令只删选项不给方向时，概率质量必滑向下一安全默认——所以 M15 verdict 与 SKILL 同开一方：**正面方向**（命名/4–6 色带角色/字体角色/布局一句话/一条产品原则/token 文件位置）先行，禁令殿后。
- **失效信号先例**（SIGNS"Signs that no longer work"）：六指、乱码大标题、恐怖谷脸已被前沿模型修复；"a guide like this decays — that is why it is a repository and not an article"。人类对当前 AI 图判别准确率仅 ~62%，单信号皆概率。

## 4. 判据写法注记
- ✓命中式可直接进 linter（UX35 已给出 35 条 regex 全文，另其 visual checklist 版见 uxskill.laithjunaidy.com/how-to-tell-if-a-website-was-ai-generated.html）。
- △类只能做"堆叠计数"：SIGNS 判读三原则=stack signs never single ones / judge the absence of decisions / probabilistic；AGT 打分制（15 条中 ≥6 判 AI）与 SLOPCOP（≥4 条计入 22%）是两种落地形态，可借鉴进 Z3 审计的计分方式。
- febbhav 设计配套 `design-rules.md` 可直接当 CLAUDE.md/AGENTS.md 投放（写法基调："prefer a real decision over the reflex"，非全面禁令）——与本库 AGENTS.md §2.4"B82/B44 当参考清单不是铁律"同构。

---
**采样日期 2026-11。病名是移动靶——本表校准用非永久禁令**：每条都标注了当时的 status（active/rising/migrating），复用时先核对该聚类是否已被逃逸路径取代（见 §3）；命中单条≠AI，缺席决策才是。
