# C · 知识的机器可读形态：同一份"品味"写成什么形态模型最能用？

## 各形态发现

**1. Anthropic Agent Skills：三级渐进披露**（https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview）
- Level 1 元数据：YAML frontmatter 的 `name`+`description` 常驻系统提示词，`description` 必须同时写"做什么+何时用"（≤1024 字符）——它是唯一的触发依据。
- Level 2 `SKILL.md` 正文：触发后整篇读入；官方建议 **<500 行**，超出拆文件。
- Level 3 附属文件：`references/`、`assets/`、`scripts/` 按需读或**只执行不读**；最佳实践明确警告"避免深层嵌套引用"（引用链第 2 层起可能只被部分读取）——引用只能一跳（https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices）。
- 结论：skill ≠ 一篇大文档，而是"高信号主文件 + 一跳可达的按需层"，容量理论无上限，但每跳都有触发成本。

**2. 规则文件实践（CLAUDE.md/AGENTS.md/.cursor/rules）**
- Claude Code 官方：CLAUDE.md 目标 **<200 行**，更长"消耗 context 且降低遵守度"；指令须具体可验证（"用 2 空格缩进"而非"格式化好代码"）；部分目录才用的规则下沉到 path-scoped 文件（https://code.claude.com/docs/en/memory）。
- 100 仓库实证：中位 92 行；好规则三特征——可勾选、带具体命令、写明这条规则防的是哪个真实失误；工具已强制的规则不写（https://diffox.ai/blog/agents-md-vs-claude-md）。
- Cursor 规则 <500 行/文件、按关注点拆分；Codex 给 AGENTS.md 32KiB 硬上限直接截断（https://dev.to/clogmeter/how-long-should-claudemd-agentsmd-be-51m8）。
- 共识模式：**入口文件做索引+铁律，不写手册**；"When working on X, read docs/Y.md" 式带触发条件的指路优于平铺直叙的链接（https://www.wordman.dev/agent-instructions/；https://www.kuril.in/notes/writing-a-great-agents-file/）。

**3. Design tokens（W3C DTCG 2025.10 稳定版）**
- DTCG 定义 token 为"设计系统中不可分割的决策单元"（颜色/尺寸/字重/时长/缓动/阴影/排版复合体），JSON 交换格式，支持别名与主题变体（https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/）。
- 关键局限：token 承载的是**取值与命名槽位**（primitive→semantic→component 三层），不是判断。"哪个元素该主导画面""视线先落哪"没有 token 类型可装——层级是权重分配决策，只能在消费侧用决策点+验收句表达，token 只能是它的输出格式。
- 旁证：连"编码品味"的社区 skill 也把 token 层定位为 raw→meaning 的最底层，上面还要叠诊断问题与否定清单（https://github.com/SunflowersLwtech/sunkit/blob/main/plugins/polanyi-design/skills/polanyi-design/SKILL.md）。

**4. 实证：原则 vs 示例 vs 清单**
- **指令数量有衰减**：随指令条数增加，遵守率下降（arXiv 2510.14842）；社区经验值"~150 条注意力预算"。**中段信息丢失**：U 型注意力曲线，关键信息放中间可能不如不给（Liu et al., https://arxiv.org/abs/2307.03172）。
- **规则 vs 示例依任务分胜负**：代数/规则类任务规则胜；分布敏感/品味类任务（风格模仿恰是这类）示例胜或多示例无显著增益（EMNLP 2026, https://aclanthology.org/2026.emnlp-main.1722.pdf）。风格模仿实验：few-shot 稳赢 zero-shot，但 **>5 个范例收益骤减**。
- **示例锚定表面形态，指令才可泛化**：示例的影响"局限于首次生成"，规则可跨上下文生效；两者组合最强（Bohr 实验，d=-10.97，https://wiki.bitsy.services/wiki/ai/pastiche/rules-versus-examples/）。反例：对话历史里 1 个反例就能击穿系统提示词规则——模型抄最近的表面形态（https://parameterspaceinspector.com/blog/how-many-examples-beat-a-system-prompt-rule/）。
- **否定式知识高效**："三条好范例胜过五十条规则；一条坏例约十倍于一条好例"；社区设计 skill 独立收敛出"否定>断言、分类学>规则、反收敛"三原则——品味教不了"什么是好"，但教得了"什么肯定不是"（https://learnedcontext.com/learn/teaching-ai-your-voice；同 polanyi-design 链接）。
- 含义：品味的最优编码 = **少量否决规则（每条带 ❌/✅ 对例）+ 一个方向分类学 + 强制每次做不同具体选择**，而不是正面原则清单。

## lieflat skill 解剖（参照物，重点）

`github.com/larashero3-dotcom/lieflat-less-ai-tone`（5.5k★）。仓库结构：`SKILL.md`（~300 行主文件）+ `DETECT.md`（检测协议）+ `references/semantic-criteria.md`（封闭判据）+ `RESEARCH.md`（语料证据）+ `scripts/`（detect.py/report.py，只执行）+ `examples/agent-memory-case/`（完整走查）。正是三级披露的标准实例。

SKILL.md 内部结构（按其行文顺序）：
1. **frontmatter description 极长**（~300 字）：功能 + 流程 + 证据 + **触发时机**（"适用于写作完成后的成稿清理"）。
2. **总述+三层分工**：数得出符号的归脚本正则；要理解句意的归模型但按封闭判据逐条判、禁整体感觉打分；机器共识不够（模型间共识仅 0-40%）的归人审。
3. **工作流"必须按顺序"**：检测→交付改前报告→**等用户回复**→改写→复测对比。报告是防过度清理的闸门，且"命中清单不可静默删项"。
4. **改写原则 6 条**：最小改动/信息守恒/不制造参差/结构不动/有风格参考先读/改完自查——全是"改动纪律"，不是品味断言。
5. **13 条改写规则按优先级排**：每条固定四件套——实测数字（AI 频次 vs 人类频次 + 哪轮语料）、改法、❌/✅ 例句对、"不改"例外清单。
6. **X 级清单（永不改）**：被复测推翻的规则进否决表而非删除，附反转数据（如序数词小标题第一轮 3.1×、配对复测人类 8.6% vs AI 4.9% 反转）——**防的是模型把"感觉像"的东西乱改**。
7. **人审边界**：明说模型判不准什么（比喻贴切度），列出但不评级。
8. **最终验收 checklist**：可逐条勾的验收句收尾。

与我们库的形态差异：lieflat 是**单一任务闭环 skill**（检测→改→复测），主文件本身就是规则集，文档是证据附录；我们是**检索式知识库**（AGENTS.md 是协议不是 skill，190 文档是平级资产，靠 Z2 人工式检索协议选 5-12 篇）。它编码品味的方式是"带证词的可证伪规则+否决清单"；我们的是"决策点清单+验收标准"（K 词条）——同构，但我们的规则普遍缺它的三样东西：实测数字、❌/✅ 对例、"永不改"否决区。

## 形态选择结论

**边界判定：库不缩成一个 skill；要抽出一个薄 skill，库降级为它的 references/。**
- 该进 skill 主文件（高信号层，目标 <300 行）：生成工作流闸门（对齐 M1/Z2/Z3 已定的顺序）、反默认值否决规则（B82/B44 类，改写成"规则+实测/判据+❌/✅+不改例外"四件套）、方向分类学（R21 主方向）、验收 checklist（Z3 浓缩版）、人审边界（模型看不见的——必须截图自审或交人）。
- 该保持决策对象（按需一跳加载）：K 词条、R1-R18 提示词块、D 板块令牌结构——它们就是 references/，按触发条件指路（"做吸附类交互时读 K-吸附"），与现状一致但要**压平到一跳**。
- 该砍/降级：没有决策点+验收句的百科式背景文、与其他文档重叠的原则复述、纯趋势描述（E 板块多数）——按入库闸门，答不出①②的只进参考。
- tokens 只做输出格式（D 板块），装不了层级判断；层级这类"权重分配"必须走决策点+验收句。
- 关键机制照搬：规则要带证词与失效日期式演化（案例回归推翻就进 X 区不删除）；"感觉像 AI 味就改"的教训对应我们的"感觉要加效果就堆"——X 级清单是收敛≠好的解药之一。

## 可迁移点（每条：决策点 / 验收句 / 来源）

1. **薄主文件+一跳引用**：决策点=哪些内容进 SKILL 主文件哪些下沉；验收句="主文件 <500 行（实践取 <300），任何附属文件从主文件一跳可达，无引用链"。来源：platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices。
2. **description 即触发器**：决策点=skill 触发语怎么写；验收句="description 同时含'做什么+何时触发'，≤1024 字符"。来源：同 overview 页。
3. **反默认值否决清单**：决策点=哪些"AI 共同分母"入否决区；验收句="每条规则附 ❌/✅ 对例 + '不改'例外，清单总长可 1 分钟扫完"。来源：lieflat SKILL.md 规则 1-13 结构；polanyi-design "Negation>Assertion"。
4. **X 级否决区（防误改）**：决策点=被案例推翻的规则去哪；验收句="推翻的规则带反转证据进 X 表，永不执行但仍出现在检测/审计报告里"。来源：lieflat DETECT.md X 级清单。
5. **按改动风险分级**：决策点=审计发现项的处置优先级；验收句="每项标 A机械改/B建议改/C只报告/H人审/X已否决，分级看改动风险不看信号强度"。来源：lieflat DETECT.md 分级表。
6. **模型判不准的移交人审**：决策点=哪些维度不自动判；验收句="凡机器共识<50% 的维度（如'这个比喻贴不贴切'/'这个视觉方向合不合品牌'）只列清单不评级"。来源：lieflat SKILL.md 人审区。
7. **改前报告闸门**：决策点=是否允许模型直接改稿；验收句="任何优化任务先交付'命中→依据→例句→改法'报告，用户回复后才动手；命中项不得静默删除"。来源：lieflat SKILL.md 工作流第二步。
8. **示例预算 ≤5**：决策点=每条规则配几个对例；验收句="每规则/每方向 1-2 个 ❌/✅ 对例，全库示例注入单次任务不超过 5 组"。来源：aclanthology.org/2026.emnlp-main.1722.pdf；Wang et al. few-shot 衰减。
9. **指令总量预算**：决策点=单次生成注入多少文档/规则；验收句="单次任务注入规则条数远低于 ~150 条注意力预算（实践取 Z2 的 5-12 文档上限不动摇），关键规则放首/尾不放中段"。来源：arXiv 2510.14842；Liu et al. 2307.03172。
10. **规则带证词与演化**：决策点=新词入库的证据门槛；验收句="每条规则注明依据语料/案例与日期，被回归推翻则降级入 X 不删除"。来源：lieflat X 级清单机制 + RESEARCH.md。
11. **反馈回路优于规则书**：决策点=验收靠清单还是靠命令；验收句="能写成可执行检查的（截图审计/detect.py 式正则）不写成建议——告诉模型怎么查活，不告诉它怎么写好"。来源：wordman.dev/agent-instructions。
12. **入口文件分层**：决策点=AGENTS.md 装什么；验收句="入口 <200 行，= 铁律+带触发条件的指路（'做 X 时读 Y'），不做手册"。来源：code.claude.com/docs/en/memory；diffox.ai 100 仓库实证（中位 92 行）。
13. **tokens 只做取值层**：决策点=视觉参数化走到哪停；验收句="token 文件表达 primitive/semantic/component 取值与主题变体；'谁该主导画面'不进 token，走决策点"。来源：DTCG 2025.10 spec。
14. **反收敛约束**：决策点=如何避免多次生成趋同；验收句="生成协议含'每次必须做出不同的具体选择'条款，同库两次产出不得落入相同安全组合"。来源：polanyi-design SKILL.md "Anti-Convergence"。
