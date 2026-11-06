# B-AI生成工具 · 注入物形态 + 验证回路
（调研期报告 · 维度 B · 2026-11 · 全部结论带来源）

## 逐家发现

### v0.dev（Vercel）
- 注入物=**写死的约束清单**，嵌在泄露 system prompt 中段（Prompt.txt L692-762，约70行）：全项目3-5色上限、2字体族上限、禁紫/紫罗兰、禁渐变（除非点名）、必须用语义token（text-foreground，禁text-white裸色值）、间距走数学阶梯、组件库优先于自造。
- "好"的定义=**写死偏好**：禁色表本质是把 AI 病清单内化成禁令；不含判断方法。
- 验证回路：官方 agentic "Browser use"——v0 能打开自己建的 app、"use them, **critique designs**"、边工作边回传截图 → 截图+vision 自审闭环已产品化。
- 另有 design systems/team templates：品味层外置成用户资产跨项目复用。CTO Malte Ubl 明言"pivot to let it rip——a prompt without the evals, models, and especially UX is like a broken ASML machine"，即护城河在 eval+模型不在 prompt。
- 来源：deepwiki.com/x1xhlol/system-prompts-and-models-of-ai-tools/4.1.4；v0.app/docs/agentic-features；v0.app/v11；simonwillison.net/2024/Nov/25；leaked-system-prompts.com/prompts/v0/v0_20250428

### Claude artifacts / Skills（Anthropic，最完备样本）
- 两层注入：①claude.ai system prompt 内 `artifacts_info` 自带"Design principles for visual artifacts"——按体裁分流（复杂应用功能优先 / landing 要"wow factor…would this make someone stop scrolling"）、默认当代趋势、"lean toward the bold and unexpected"；②官方 frontend-design skill 按需加载。
- skill 形态（~120行单文件）：人格设定（"design studio 的 design lead，客户已拒过模板方案"）+ 判断方法 + **"For calibration"病名表**（cream #F4F1EA+terracotta #D97757、酸绿黑底、broadsheet、SaaS圆角卡片套、template chrome 五大当前聚类味）+ 两阶段流程（先出设计计划：4-6命名hex/字体角色/ASCII布局/unique原则→过"generic default检查"→才写码）+ 自审（"take screenshots to review…a picture is worth 1000 tokens"）+ 克制原则（"大胆只花一处"，Chanel类比）+ 文案节。
- cookbook 版 frontend_aesthetics 仅 **~400 token**：按 typography/color/motion/background 四维拆，每维给 Never-use 清单+好例+判断原则（"high contrast=interesting""size jumps of 3x+, not 1.5x""dominant colors with sharp accents outperform timid evenly-distributed palettes"）。
- 明确防"二阶收敛"：禁了 Inter 会漂到 Space Grotesk，结尾加"think outside the box…you still tend to converge on common choices"。根因命名="distributional convergence"。
- 优先级声明："brief's own words always win"；Claude Code 版 skill：用户原话>项目已有design system>模型自选。
- web-artifacts-builder skill（74行）：工程管道（React+Tailwind+shadcn→Parcel打单HTML），反AI味只一句"avoid excessive centered layouts, purple gradients, uniform rounded corners, Inter font"——证明人格/品味与工程约束是分离的两层。
- 来源：claude.com/resources/articles/improving-frontend-design-through-skills；platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics；github.com/anthropics/skills/.../frontend-design/SKILL.md、web-artifacts-builder/SKILL.md；github.com/elder-plinius/CL4R1T4S/ANTHROPIC/Claude-4.1.txt

### bolt.new（StackBlitz）
- 泄露 prompt 里设计指导**只有一句**："For all design requests, ensure they are professional, beautiful, unique, and fully featured—worthy for production"——纯形容词，无维度、无禁例，是十家里最薄的。
- prompt 主体是 WebContainer 环境约束+artifact 格式+"think HOLISTICALLY…BEFORE creating an artifact"（先全局思考再动手），结构分 `<response_requirements>`/`<system_constraints>`，144条规则25条否定式；关键限制放在各节**开头**（位置学：开头/结尾召回>中段）。
- 验证回路：无截图自审；靠 WebContainer 即时运行报错回喂。
- 来源：weighmyprompt.com/system-prompts/bolt；eldergenix.com/prompts/bolt-new-20250425；dev.to PromptEval 五家横评（Bolt 结构分最高83.5）

### Lovable
- 泄露 agent prompt（2025-09）=锁定栈（Vite+React+Tailwind+shadcn，"not possible"支持别的框架）+ **design-system doctrine**："The design system is everything…never use classes like text-white…always use design system tokens""ALWAYS use HSL colors"，自造 `--primary-glow`/`--shadow-elegant` 类语义 token。
- 第一条消息的条件块：**先改 tailwind.config.ts+index.css 的 token 再写组件**，规定产出序列（想→描述设计灵感→v1功能清单→色/字/动效→token→组件→生成配图）；"wow them with a really, really beautiful app"。
- 品味约束编译成代码层规则=第二杠杆；另有内建 SEO checklist（title<60字符、单H1等可验收条款）。
- 验证回路：preview iframe 插桩（DOM→JSX 映射、console/network 回流）+"Try to fix"把日志免费回喂——是**错误回路不是视觉自审**。
- 来源：github.com/aayambansal/squint/docs/research/lovable.md；x1xhlol/.../Lovable；leaked-system-prompts.com/prompts/lovable

### Cursor / Windsurf（合并：发现相同）
- 泄露 system prompt 里**几乎没有设计学内容**：Cursor ~57行全是协作/格式/安全规则；Windsurf Cascade 同型。品味由用户的 `.cursorrules`/`.windsurfrules` 注入——证明"品味层"在通用IDE里是**用户资产不是厂商资产**。
- 社区 rule 模板的形态值得看（windsurf.run front-end rule）：人格（Senior FE Dev）+流程（先伪代码计划再确认再写码）+实现规约（early return、class:不用三元、handle前缀、a11y）——但视觉审美仍无词。
- 来源：prompthacker.ai/p/ai-system-prompts-revealed；windsurf.run/front-end-cursor-rules；gist.github.com/juzeon/a6f39e30

### Figma Make
- 注入物=**Guidelines.md 文件**，每个生成自动创建、**每次 prompt 自动注入**；官方模板自带警告"More context isn't always better. It can confuse the LLM."；建议父文件挂小的专题 .md 保持上下文聚焦。
- 模板分两节：General（布局默认 flexbox/grid 等工程规则）+ Design system（字号14px、底部工具栏≤4项等**产品级具体规则**）；可选挂载 Figma design system 组件/样式/变量作 context。
- 官方 prompt 方法论 TC-EBC（Task/Context/Elements/Behavior/Constraints），明说"prompt 是起点不是 spec，在上下文里看真输出再调"；模型=Claude Sonnet。
- 验证回路：无自审；靠画布内可视迭代（designer 看真实输出再改）。
- 来源：help.figma.com/hc/en-us/articles/33665861260823、40097793879191；figma.com/blog/designer-framework-for-better-ai-prompts、8-ways-to-build-with-figma-make

### Subframe
- 反模板路线=**资产约束**：AI 只在你的真实组件库+theme tokens 上摆设计，codegen "deterministic and purely presentational"；组件 CLI sync 进代码库（生成文件不可改+可扩展 wrapper），"pixel-perfect…no out-of-spec components"——一致性由架构保证不由 prompt 祈祷。
- 生成侧="generate **multiple variations**"采样+人选；canvas agent 带浏览器（看真站点、capture 元素回画布、live inspect 每个 token/classname）。
- 来源：docs.subframe.com/develop/concepts/design-to-code、design/ask-ai/prompt-to-design；subframe.com/design-systems

### Polymet
- 注入物=用户自备"mini design system prompt"，**≤6K字符**的九段清单：brand foundations/color及用法/typography token/spacing-grid/iconography/motion/components（含不可逆操作+states）/UX patterns/a11y checklist——形态=令牌化设计系统的压缩摘要。
- 官方劝"focus on your product, not technical details"；variations 探索+人评（comments 逐处改）。
- 来源：docs.polymet.ai/academy/prompting-guide、polymet-101

### Replit Agent
- 验证回路最完整（主设计师 Omar Abdul-Rahim 公开能力清单）："Reviewing runtime output""**Evaluating UI output via screenshotting and vision**""Determining if the user is better suited to evaluate an output and asking them to do so"——截图+vision 自审+**该谁评估由 agent 判断**。
- 人审闸门：plan 先英文列出→用户批准才执行（合同式计划，偏离可见）；checkpoint=整个 Repl 的 copy-on-write 快照+preview+rollback。
- 另有 Visual Editor：确定性小改（字/色/距）直写源码不过 agent、不耗 credit——**简单改动走确定性通道**。
- 来源：omarabdulrahim.com/replit-agent；datarekha.com/blog/replit-agent-architecture；docs.repl.it/updates/2025/05/16；docs.replit.com/design/visual-editor

## 形态结论（注入物长什么样最有效）
1. **效果排序**：流程+判断方法+病名表（Anthropic skill）＞ 硬约束清单+token化（v0/Lovable/Subframe）＞ 纯形容词（bolt"beautiful unique"≈无效）。形容词给方向，原则给判断，病名表给校准——三者齐备才抗漂移。
2. 最有效单元是**按维度拆的三元组**：每维（字/色/动/背景）=禁例+好例+一条判断原则（"high contrast=interesting""3x+ size jump""dominant+sharp accent"）。教判断但给锚点，不是写死风格也不是空话。
3. **病名表必须常更新**：AI 味是移动靶（禁Inter→聚到Space Grotesk；2026新聚类=cream+terracotta、酸绿黑底、broadsheet）。Anthropic 把它写成"For calibration"段落——是采样校准不是永久禁令。
4. **品味约束编译成代码层硬规则**是第二杠杆：禁裸色值/先改config再写组件/只用库内组件——产出一致性由结构保证，prompt 只兜底。
5. 剂量证据收敛：~400token（aesthetics prompt）～~120行（SKILL.md）～≤6K字符（Polymet）～70行嵌入（v0）；Figma 明说"context isn't always better"。**按需加载的 skill 文件 > 常驻 system prompt**（无关任务不背品味上下文）。
6. 必有优先级声明：用户brief > 项目已有 design system > 模型自选（Anthropic/Claude Code skill/Figma 挂载设计系统同型）。

## 回路结论（验证环节怎么做）
1. 商用主流=**截图+vision 自审**：v0 browser-use critique designs、Replit"screenshotting and vision+判断该谁评"、Anthropic skill"screenshots to review…a picture is worth 1000 tokens"。
2. 开源复刻给出回路细节：渲染(headless Chromium)→多viewport截图→critic比对→**列具体issue（"hero 32px vs brief 56px"非"looks off"）**→修top3→阈值收敛（三维各≥8/10）；critic独立VLM+结构化JSON打分（game-ui-refiner 5维分）。
3. 第二形态=**多版本采样+人选**（Subframe/Polymet variations、WebDev Arena pairwise）——生成侧拉diversity，选择侧交人。
4. 公开 eval 方法：WebDev Arena pairwise→Bradley-Terry Elo（丑但对的app会输给好看的）；Design2Code：CLIP高层相似+block/text/position/color低层匹配+人评（GPT-4V 49%可替原稿、64%被认为更好）；AUV-Bench 1395个UI四任务发现**"判断-行动鸿沟"**：会评分≠会修，诊断链成功率仅24.7%——自审回路必须验证"修完真的变了"不能停在打分；Nielsen启发式专家打分（arXiv 2601.22759）。
5. 人审闸门放计划与检查点：Replit plan-gate、checkpoint preview+rollback、v0 annotations→一条prompt——机器自审管收敛，人管方向。

## 可迁移点（决策点 / 验收句 / 来源）
1. 决策点：设计注入物按维度写成"禁例+好例+判断原则"三元组。验收：任取一条建议，能答出"管哪个维度、默认是什么、为何这个更好"。来源：Anthropic cookbook + frontend-design SKILL.md。
2. 决策点：维护"当前AI聚类病名表"并标注是校准而非禁令。验收：表带采样日期；每季度重采样更新（防Space Grotesk式漂移）。来源：SKILL.md"For calibration"段 + claude.com 文章"二阶收敛"。
3. 决策点：写码前先出设计计划（4-6命名hex、字体角色、ASCII布局、unique原则），过"generic default检查"才动手。验收：计划每元素能说出"为本brief所选"的理由；发现默认项须改写并注明改了什么。来源：SKILL.md Process段。
4. 决策点：品味约束尽量下沉到token/组件层硬规则（禁裸色值、先改config再写组件、只用库内组件）。验收：产出 diff 中无硬编码色值/非token字体/库外组件。来源：v0 Prompt.txt L692-762、Lovable design doctrine、Subframe codegen。
5. 决策点：注入物显式声明优先级（brief原话>项目design system>模型自选）。验收：构造冲突场景，产出遵循高优先级且不越权"优化"用户指定风格。来源：SKILL.md"brief's own words always win"、Piebald-AI claude-code skill 优先级段。
6. 决策点：自审=渲染截图→vision比对→列具体issue→修top3→阈值收敛。验收：每个issue写成"期望值vs实际值"句式；桌面+移动双viewport各打分；未达阈值不回交付。来源：buildwithagents screenshot-loop.md、screenshot-to-code blog.codesirocco.com、agy-ui-mcp。
7. 决策点：critic与generator分模型/分上下文，critique结构化（分数+issue列表JSON）。验收：critic产出可被程序消费的JSON，generator只见critique不见critic推理过程。来源：GeraCollante/game-ui-refiner。
8. 决策点：每页预算"大胆只花一处"——一个记忆点元素，其余克制。验收：自审能唯一指出hero元素；第二个艳点被删或降级。来源：SKILL.md Restraint段（Chanel类比）。
9. 决策点：人审闸门放在计划/检查点，不放逐diff。验收：用户能一票否决plan、能rollback到任意checkpoint，且不被细节淹没。来源：Replit Agent架构、v0 design mode annotations。
