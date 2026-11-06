# E · 生长机制与内容层
（对应调研框架维度 E「自我生长」+ F「内容/文案层」· 全部结论标来源）

## 一、生长机制发现

### 1. 活系统的演进：分权治理 + RFC 生命周期，是工业界标准答案
- **三种治理模型**：centralized（核心组批所有改动）→ federated（产品组共建）→ hybrid（核心组管根基、产品组在护栏内贡献）；多数团队从集中起步随规模走向混合。来源：Figma https://www.figma.com/resource-library/design-system-governance/ ；zeroheight https://help.zeroheight.com/hc/en-us/articles/36474270188699
- **按决策半径分权**：改基础令牌/共享组件=brand 级，同一小组审批；现有组件新变体=team 级，使用组自己拍板。提案模板要求"用例 + 现有组件为何不够"。来源：同上
- **RFC 五站生命周期**：草案（问题+方案）→设计评审→技术评审（API+迁移计划）→批准（决策留痕）→发布（PR+changelog+通知）；不可逆决策批准前设 48h 冷却。来源：https://www.designsystems.one/designops/governance
- **USWDS 组件生命周期**：讨论→正式提案→**≥45 天公开评议**→评估（批准/返修/标记 will-not-pursue）→approved→开发→发布，阶段本身就是置信度信号。来源：https://designsystem.digital.gov/components/lifecycle/
- **版本契约**：semver + sunset——deprecation notice（changelog+lint warn）→ 3–6 个月迁移窗（codemod）→下个大版本才移除；major 一年最多一两次。来源：https://bartczyz.com/blog/design-systems-at-scale/
- **贡献漏斗要廉价**：Issue 5 分钟可提（要什么/给哪个产品/时间线）→RFC 短模板→PR→一次平台评审→当天自动发布。来源：同上

### 2. "终审→归因→补丁→回归"回路有正式化先例：eval flywheel
- **OpenAI 评估飞轮**三阶段循环：Analyze（定性复查，人工标注失败样本找复发模式）→Measure（建测试集+grader 量化基线）→Improve（定向改 prompt/样本/组件）；改完新失败模式浮现，飞轮再转。来源：https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel
- **失败分类法 = 质性研究借用**：open coding（逐条失败写自由笔记，忍住不分类）→ axial coding（合并同类，收成 5–10 个失败模式）。来源：同上 + https://dev.to/bigcircle/how-to-build-an-llm-evaluation-from-real-failures-b32
- **补丁只打高频类**：ETGPO 给失败 trace 建带占比统计的错误分类，只为最普遍类别生成定向修复，**长尾错误主动过滤**——补丁才泛化、少反复验证。来源：https://arxiv.org/html/2602.00997
- **通用优化可能帮倒忙**：Define→Test→Diagnose→Fix 四阶段；每次改动触发全量重评估。来源：https://arxiv.org/html/2601.22025
- **对照我们**：目测终审=Analyze，归因=open/axial coding，补丁=Improve，冷启动回归=Measure。**缺的环节：失败分类成文、基线量化、grader（把"目测"部分交给可复跑判据）。**

### 3. 从真实产品 UI 反向挖词：管线有先例，终点仍需人工闸门
- **DMiner**：爬 854 个真实 dashboard → 特征工程（单视图特征+成对视图关系）→ 决策规则挖掘 → 规则过滤 → 推荐器。来源：https://arxiv.org/html/2209.01599v2
- **控件级模式挖掘**：view hierarchy 序列化为 token → 自监督向量 → 聚类出 Top App Bar 设计模式。来源：https://www.mdpi.com/2076-3417/15/3/1060
- **截图逆向**：Screen Parsing 用 Faster-RCNN 检元素+栈式 parser 重建 UI 层级树。来源：https://dl.acm.org/doi/fullHtml/10.1145/3472749.3474763
- **共同形态**：原始 UI（截图/DOM）→结构化特征→规则/聚类→**人工过滤**→产物。没有一家做到"截图直接产可验收规则"；过滤这步恰是我们的终审位。即 agent 可干"特征提取+候选聚类"，入库闸门仍是人。

### 4. 证据闸门：lieflat-less-ai-tone 给了目前最完整的可操作标准
（同题参照物 https://github.com/larashero3-dotcom/lieflat-less-ai-tone ，SKILL.md + RESEARCH.md）
- **配对比较是前提**：同题目、同事实、同长度的配对复测推翻了首轮 3 条规则；不配对时"AI 精确数字是人类 3 倍"，配对后 δ=−0.06——差异全来自话题。
- **必须分模型统计**：破折号合并口径"不显著"，拆开 GPT −0.54 / Opus +0.95 方向相反互相抵消→降格为"指纹指标"（只报告不执行）。
- **倍率门槛**：≥2.0 收录；1.25–2.0 需人类侧各组稳定（组间差<5×）且量足；0.8–1.25 无差异不收；<0.8 反向。
- **三附加条件**：触发可定位（能指出改哪句/哪个词——"读起来太整齐"不收）；改法不违反白名单（信息守恒：实词须有出处，不许编造）；被推翻规则降 X 级留在报告里永不执行但不删除。
- **分母决定结论方向**：每千字/每百段/占同类元素比例，选错分母给出反向结论。
- **三层分工**：数得出符号的归脚本（正则）；要句意的归语义层——封闭判据文件+每条给 label/confidence/reason+兜底标签+禁止自造标签；判不了的（比喻贴切度）归人审，模型不装能判。
- **操作纪律**：改规则前先抽样看 20 条命中再看频率；候选清单不可静默删项，每条标"拟改/保留/误报/待核+理由"；区分"语料统计显著"与"本篇单次命中"。

## 二、内容层发现

### 1. 四家体系的共同骨架（都是"删掉/说人话/指向行动"）
- **Polaris**：每个词都加噪声要称重——自查"这个词能是图标吗？标题+副文+按钮能只是一个按钮吗？"；Jenga 删法"删到什么程度会塌"；7 年级阅读水平；朗读测试"像人说的话就发"。来源：https://polaris.shopify.com/content/fundamentals
- **Mailchimp**：写前三问"这服务什么目的/谁读/他们要知道什么"；clear>entertaining；主动语态；删空词。来源：https://styleguide.mailchimp.com/writing-principles/
- **GOV.UK**：从 user need 立项而非从功能立项；短句+日常词。来源：https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/
- **Google 三词**：clear/concise/**useful**——useful=把用户推向目标。canonical 案例："Book a room"→"Check availability" 参与率 +17%，结果措辞胜过动作描述。来源：UX Encyclopedia https://ux.detroit3d.com/patterns/ux-writing-microcopy.html
- **Podmajersky 四性**：purposeful/concise/conversational/clear，分轮改稿每轮只管一性。来源：同上（Strategic Writing for UX, 2019）

### 2. "这是什么→这对你意味着什么"有成文公式
- **空态解剖（Atlassian/Carbon/GitLab/Acorn 四家一致）**：标题（≤5 词，句首大写式，无句号）+正文（1–2 句：为什么是空的+下一步去哪，不重复标题）+CTA（祈使动词+名词，≤2 词）+可选插画。
- **正向陈述**：Carbon 标题写"Start by adding data assets"而非"You don't have any data assets"，或加 "yet"；Acorn 教育型空态聚焦"能做什么+好处"，避免 "No" 开头。来源：https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states ；https://acorn.firefox.com/latest/content/patterns/writing-for-empty-states-NQLxhgJJ
- **语气按场景分**：首次使用=教育/激励；任务完成=庆祝；无结果=中性。来源：https://atlassian.design/components/empty-state/usage
- **前置加载**：区分性词放句首，用户只扫前 1–2 词（NN/g F-pattern）；"Delete account"不是"Would you like to…"。来源：UX Encyclopedia 同上
- **错误解剖学**：发生了什么→怎么修；用用户词汇不用系统词汇（"That card was declined"不是"Transaction error 4021"）；不归咎（"that email needs an @"）。来源：https://polaris.shopify.com/content/error-messages + UX Encyclopedia
- **Vercel 工程版**：主动语态（"Install the CLI"）；计数用阿拉伯数字；错误信息必须给出口；第二人称。来源：https://vercel.com/design/guidelines

### 3. lieflat 方法往 UI 文案的迁移性
- **可直迁**：配对比较（同上下文 AI 稿 vs 人工稿）、分模型、倍率门槛+三附加条件、X 级否决清单、三层分工、"改前抽 20 条命中"。
- **需改造**：正则只能数符号——UI 文案/视觉的"命中"多要视觉与语义判断，对应它 references/semantic-criteria.md 的封闭判据写法（固定 label 集+confidence+reason+兜底标签），即"语义层判据文件"是 UI 词库的对应物。

## 三、可迁移点（决策点 / 验收句 / 来源）

### 生长机制
1. **新词证据闸门**——决策点：多少证据配入库。验收句：候选词满足①触发可定位（能指出改哪个元素/属性/文案位）②配对比较下 AI:人类倍率≥2.0（或 1.25–2.0 且人类侧组间差<5×）③改法不依赖编造内容，缺一不入库。来源：lieflat RESEARCH.md。
2. **比较方法论**——决策点：AI 产出 vs 人工作品怎么比。验收句：同产品上下文+同内容数据+同复杂度配对，分模型报告；不配对/合并模型的统计只能作线索不作依据。来源：lieflat RESEARCH.md。
3. **回路固化**——决策点：终审→补丁怎么不沦为一次性。验收句：每轮终审产出失败分类（open→axial coding 成 5–10 类），只为高频类打补丁并写明占比，长尾记档不改；补丁必须过冷启动回归证明改变实际决策。来源：OpenAI flywheel + ETGPO（URL 见上）。
4. **分权入库通道**——决策点：谁来贡献。验收句：根基级词（原则/令牌）走 RFC（问题+方案+现有词为何不够+反对理由）+冷却期；案例/场景级词走 5 分钟 Issue 模板快速通道，评审只看"可验收+有来源"。来源：Figma governance + USWDS lifecycle + Bart Czyz。
5. **反向挖词分工**——决策点：agent 能不能从真实 UI 挖词。验收句：agent 负责"DOM/截图→结构化特征→候选聚类+配比统计"，输出候选清单；人审负责过滤入库——不承诺端到端自动。来源：DMiner/Screen Parsing/TAB mining（URL 见上）。
6. **否决留痕**——决策点：被推翻的词。验收句：降 X 级保留（附推翻证据），生成不执行、审计可见；候选清单每条标拟改/保留/误报/待核+理由，不可静默删。来源：lieflat SKILL.md。
7. **改规则纪律**——决策点：何时改词。验收句：改前先抽 20 条命中人工复核，再看频率。来源：lieflat SKILL.md。
8. **弃词机制**——决策点：过时词怎么退。验收句：deprecation notice→一个版本的迁移窗→才移除；semver 语义：patch=改表述/minor=新词/major=推翻旧词。来源：designsystems.one + Bart Czyz。

### 内容层
9. **行描述信息位**——决策点：行描述写什么。验收句：每条描述含"原因/后果/去向"至少其一；只重述字段名=失败。自查：删掉这句用户失去什么信息？答案为空则删。来源：Carbon/Atlassian 空态正文规则 + Polaris"weigh every word"。
10. **利益 vs 对象**——决策点：措辞指动作还是指结果。验收句：描述用户能得到的结果而非对象本身（"Check availability"型）；描述仅是字段名复述时返工。来源：Google UX writing 案例（+17%）。
11. **CTA 文案**——决策点：按钮写什么。验收句：祈使动词+名词、≤2 词（中文≤4 字），禁用"OK/确定/好的"类无信息量词。来源：Atlassian/GitLab/Vercel。
12. **空态标题**——决策点：空态第一句话。验收句：正向陈述或"还没有 X"式，≤5 词（中文≤10 字），句尾不加句号，不以"没有/无"开头。来源：Carbon/Acorn/GitLab。
13. **错误信息**——决策点：报错写什么。验收句：两句式"发生了什么+怎么修"；不出现错误码/系统术语作主语；不归咎用户。来源：Polaris error messages。
14. **人味检查**——决策点：怎么算"不像机器写的"。验收句：朗读测试通过+可用缩写+初中阅读级；clear>clever>cute，个性与清晰冲突时清晰赢。来源：Polaris/Mailchimp。

## 参考（答不出决策点/验收句，只备查）
- prompt 缺陷六维分类法（Specification/Input/Structure/Context/Performance/Maintainability）：https://arxiv.org/html/2509.14404
- 18 类 prompt 失败分类含最小复现：https://github.com/codealive-ai/ai-driven-development/blob/main/skills/prompt-engineering/references/failure-taxonomy.md
- Wikimedia Codex 治理模型（enablement>enforcement 原则）：https://www.mediawiki.org/wiki/Design_System_Team/Design_System_Governance_Model
- Lacework 三段贡献流程（review→design→release）：https://www.francesliddell.com/lacework-design-system-contribution-model
- token 流水线 CI（schema 校验+视觉回归+changeset）：https://www.css-architecture.com/token-scaling-validation-ci-pipelines/
- UXPin 维护清单（提案须附用户问题/约束/用例/指标）：https://www.uxpin.com/studio/blog/design-system-maintenance-checklist/
- UX 写作十条实操（查 "by" 短语抓被动/删填充词）：https://medium.com/design-bootcamp/10-simple-tips-to-improve-your-ux-writing-6500b5db617
- Mailchimp style guide 仓库（可直接 fork 结构）：https://github.com/mailchimp/content-style-guide
