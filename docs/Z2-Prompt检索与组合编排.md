# Z2 · Prompt 检索与组合编排

> **定位**：把全库 Markdown 变成“按项目上下文调用的少量高相关知识”，解决知识库越大、AI 越容易失焦的问题。

---

## 一、先解析项目上下文

不要直接从关键词挑文件。先形成这份上下文对象：

```yaml
product_type: landing-page | dashboard | ecommerce | content-platform | ai-product | mobile-web | other
primary_user: 谁在什么场景完成什么任务
primary_job: 用户最重要的一件事
business_goal: conversion | retention | trust | efficiency | learning | brand
device: desktop | mobile | responsive | spatial
brand_personality: 3-5 个具体气质词
content_shape: short-copy | long-form | dense-data | mixed-media | conversational
interaction_risk: low | medium | high
media: none | photography | illustration | 3d | video | generative
tech_stack: framework + styling + component system
constraints: [accessibility, performance-budget, localization, browser-support, ...]
quality_bar: usable | polished | premium | experimental
```

如果字段缺失，先使用合理默认值并标记 `assumed`，不要让缺失信息被“现代、漂亮、高级”代替。

---

## 二、知识路由矩阵

| 当前问题 | 先取主文档 | 再取扩展 | 最后取验证 |
|---|---|---|---|
| 营销页视觉方向 | B77 / B80 | B78 / B79 / B16 / B61 | B25 / B44 / B48 / Z3 |
| 信息密度后台 | C1 / G2 | B26 / B29 / B53 / B62 / F4 | C3 / C4 / F3 / Z3 |
| AI/Agent 产品 | G6 / B50 | C2 / B73 / B76 / C6 | Z3 + 信任/失败检查 |
| 内容平台 | G5 / C6 | B26 / B31 / B32 / B60 | C3 / C4 / Z3 |
| 电商转化 | G4 / C1 / C6 | B51 / B52 / B56 / B69 | C3 / C4 / F3 / Z3 |
| 移动端 | G3 / B30 | C2 / B45 / B76 / B74 | C4 / F3 / Z3 |
| 纯视觉探索 | B77 / B61 | B22 / B23 / B24 / V1-V14 | B44 / B48 / Z3 |

规则：先选 1-2 个主文档，再选 3-8 个补充文档，最后至少选 1 个验证文档。默认不超过 12 个模块。

---

## 二点五、R 板块调用闸门（只在需要时打开）

R 是“具体视觉词条与实现约束层”，不是所有前端任务的默认前置条件。普通内容页、表单、后台和既有设计系统的增量页面，优先走 A–G / M / Z；只有视觉媒介、实时效果或强 art direction 本身承担产品表达时，才进入 R 路由。

| 需求信号 | 调用顺序 | 产出边界 |
|---|---|---|
| 需要建立独特视觉方向，但尚未确定媒介 | `R20` → `R21` | 只确定一个主媒介、一个主峰值和明确禁忌，不取具体技法词 |
| 担心维度遗漏、风险或商业目标未覆盖 | `R19` + `R22` | 只作查漏清单；不把维度枚举原样写入 Prompt |
| 已确定要做 Canvas / Shader / 3D / 高级 CSS / 声音等效果 | `R0` → 对应 `R1`–`R18` | 取可实现的术语、数值与降级规则 |
| 常规产品 UI，视觉不是核心内容 | **Z1 第0层轻量方向卡**（不调用 R） | 必答 5 项：气质三词 / 配色来源与剂量 / 材质档 / **密度与呼吸峰（信息密度档位 + 页面唯一放开密度的大留白区，其余才让紧）** / 反面清单；不为“高级感”引效果词。**可选第⑥项：人性维度**——从 B86§七 选 0-2 个（如"照管感→更新日期+changelog""被款待→空态像主人领位"），它是内容/文案/组件决策不占装饰配额 |

> **闸门管的是效果词，不是视觉方向**。不调用 R ≠ 不做视觉决策——任何 UI（含小组件）生成前必须答 Z1 第0层轻量方向卡。"不犯禁令"≠"好看"：没有方向卡的产出是"正确但冷"（cases/04 一轮实证）；有方向但没呼吸峰的产出是"笃定但满"——**均匀中等密度是模板味的隐蔽来源**（cases/04 二轮实证：方向选了"紧凑"且全域同密度执行，输给有留白起伏的裸跑稿）。
>
> **结构卡先于方向卡**（无论走不走 R）：生成前先答 Z1 结构卡六项——页面类型 / 叙事结构 / 区块职责逐块报岗 / 首屏四问+证据件 / show-tell 配比 / 承诺阶梯；词到 B87 挑。骨架先于气质：**表现层全对、结构层即兴照样输**（cases/05 实证：W1 皮全对，hero 把产品实证缩成装饰件、特性区 tell-only，用户终审输给裸跑 W0）。

**选择预算**：每次最多取 1 篇方向文档（`R20` 或 `R21`）、2 个实现组（`R1`–`R18`）和 1 个保障组（性能 / 无障碍 / 状态）。最终写入 Brief 的 R 条目不超过 8 条，其中必须包含：1 个主视觉决定、1 条性能或降级规则、1 条可访问性或状态规则。

**裁决规则**：R 条目不得覆盖信息层级、真实内容、可访问性和性能预算；当“效果更强”与上述任一项冲突时，保留产品约束，降低或移除效果。一个页面只保留一个视觉峰值，其余区域为它让位。

---

## 二点六、K 词条检索（决策对象级）

K 是“一个交互/视觉概念要设计哪几个决策点”的词条层。与整文档检索不同，K 检索发生在**需求里出现具体交互/视觉概念**时：

| 需求信号 | 动作 |
|---|---|
| 需求含具体交互行为（"拖动排序""吸附""悬停展开""滚动恢复"） | 去 K0 分类地图 → 取对应词条的**决策点清单**，作为 Brief 的待答项 |
| 升级/优化已有界面 | 先用 `K10` 九维扫症状，命中词条后取其决策点 |
| 需求只说"手感要好""要专业" | **不**走 K——先回 §一上下文对象把模糊词落成具体概念 |
| 术语辨析（Modal/Drawer、Popover/Tooltip 分不清） | 只取 `K9` 对应辨析对，不取整个文件 |

**编译规则**：

- 词条的每个**决策点**编译成 Brief 里的一条 `Decision/Reason/Spec/Check`——"用了吸附"但阈值/目标/曲线没有答案，视为未完成，不进 Prompt。
- 词条 `衔接` 字段指向的 B/R/V 深文档，**只在决策点需要原理支撑时才取**，不占默认 5-12 文档预算的同一权重——一条 K 词条 ≈ 1/3 个文档配额。
- K 词条与其他文档冲突时按 §五裁决：K 提供"要决定什么"，B/R 提供"怎么取值"，项目上下文决定最终值。

---

## 三、检索评分

每个候选模块按 0-5 分评分：

```text
Relevance      35%  与产品、用户、任务和媒介的直接相关性
Impact         25%  对最终质量的实际影响
Executability  20%  是否包含可执行规则、参数或代码表达
Compatibility  10%  与技术栈、a11y、性能和品牌的兼容性
Reliability    10%  是否已有验证、反模式或稳定案例
```

处理方式：

- 低于 2.5：不进入最终 Prompt，只可作为研究背景。
- 2.5-3.5：作为补充规则，压缩成 1-3 条。
- 3.5-4.5：作为主要执行约束。
- 高于 4.5：可成为 Preset 的核心规则，但仍需经过冲突检查。

---

## 四、组合顺序

最终 Prompt 按以下顺序编译，避免把词库堆成一段散文：

```text
Context
→ Product Goal & Primary Job
→ Information Architecture
→ Brand / Art Direction
→ Visual System
→ Content System
→ Interaction & State Model
→ Motion
→ Responsive Recomposition
→ Accessibility
→ Performance / Engineering
→ Anti-patterns
→ Validation Questions
```

每条规则必须落入以下一种格式：

```text
Decision: 做什么
Reason: 为什么适合当前上下文
Spec: 用什么参数/结构实现
Check: 生成后如何验证
```

---

## 五、冲突解决

出现冲突时，禁止机械叠加；按顺序决策：

1. **Context**：当前产品和用户是否真的需要这条规则？
2. **Safety / Accessibility**：可用性、无障碍、隐私和安全优先。
3. **Product Goal**：转化、效率、信任或阅读是否被保护？
4. **Brand**：哪条规则更能形成稳定识别？
5. **Visual Preference**：仅在不破坏前四项时选择。
6. **Engineering**：性能、浏览器支持、维护成本决定实现方式。

记录冲突，不要隐藏冲突：

```text
Conflict: 大留白 vs 高信息密度
Decision: 后台桌面端保留高密度数据区，导航和关键 KPI 周围使用局部留白
Trade-off: 不追求全页低密度，改为分区密度对比
```

---

## 六、Prompt 压缩

压缩不是删除重要约束，而是：

- 合并重复定义，只保留一个规范来源。
- 把同类形容词转换成一条参数化规则。
- 删除对当前产品、设备和媒介不相关的模块。
- 将例子压缩成一个最能说明决策的例子。
- 把验证问题保留到末尾，不能为了变短而删掉。
- 最终输出优先保留 `must / avoid / check` 三类信息。

目标：

```text
少量高相关规则 > 全库复制
可验证决策 > 形容词
上下文适配 > 固定模板
```

---

## 七、最终编译模板

```markdown
# Frontend Generation Brief

## Context
- Product:
- Primary user / job:
- Business goal:
- Device:
- Tech stack:
- Constraints:

## Design decisions
### Information architecture
### Art direction and brand
### Visual system
### Content system
### Interaction and states
### Motion
### Responsive behavior

## Must implement
- [ ] ...

## Avoid
- [ ] ...

## Validation questions
- 眯眼时是否只有清晰的主次层级？
- 只读标题是否理解产品价值？
- 空、错、加载、禁用、权限和长内容是否成立？
- 移动端是重排而不是缩小吗？
- 是否存在可识别的产品签名，而不是默认模板？
```

---

## 八、文档之间的关系

使用以下关系组织知识图谱，不重复复制正文：

```text
Depends On       使用前必须理解的基础
Extends          在基础上增加深度
Used By          哪些场景或 Prompt 会调用
Conflicts With   可能冲突的规则
Validates        哪个检查清单验证它
Supersedes       是否替代旧文档中的同一规则
```

---

## 九、蓝图阶段的检索顺序

当用户要求生成完整界面时，检索顺序必须从结构开始，而不是从装饰效果开始：

```text
D5 界面蓝图
→ C1 信息架构 / C6 内容系统
→ B75 布局模式 / B3 布局系统
→ P1 / B1 / B33 / B60 排版
→ B32 图片媒体 / B77 艺术指导
→ D1-D4 UI 与状态
→ B30 响应式
→ F3-F4 工程实现
→ Z3 验证
```

视觉效果 V1-V14 只有在结构、排版和媒体角色确定后才进入检索。默认不把效果文档当作页面骨架。

最终编译结果必须包含：

- `Structure Blueprint`
- `Typography Contract`
- `Media Direction`
- `Component Map`
- `Responsive Recomposition`
- `Validation Plan`

---

## 附录 · 项目级 Agent System Prompt 模板（三层组装）

本库的原则、品味和流程散见多处（B82 美学块、R22 系统提示词、M1 铁律、Z2/Z3 协议）。如果要给一个**长期使用的前端生成 agent**写 system prompt，按下面三层组装——素材已全在库内，这是合成模板不是新内容：

```text
# ── 常驻层（角色 + 品味默认 + 反 slop）──
你是资深前端设计工程师。设计纪律：
- 不用默认字体（Inter/Roboto）、不用紫蓝渐变、不用三圆角卡片布局（B82）
- 形容词必须落成参数：每个"高级/现代/丝滑"换成数值、命名值或枚举（M1 铁律五）
- 一个页面只保留一个视觉峰值；强调色 ≤5 次、装饰手法 ≤2 种（K·视觉配额）
- 先陈述字体/色彩/布局方向再写代码（M1）

# ── 任务层（检索纪律 + 决策对象协议）──
- 不凭记忆设计：按项目上下文检索 5-12 个知识文档，不整库调用（Z2）
- 需求命中具体交互/视觉概念（吸附/拖拽/悬停/流式/表格...）时：
  先取对应词条的决策点清单，逐项显式作答，未答全不写码（Z2 §二点六）
- 视觉是主表达时才调用效果词条库，普通页面不强行加效果（Z2 §二点五）
- 冲突裁决顺序：安全/无障碍 > 产品目标 > 品牌 > 视觉偏好 > 工程成本（Z2 §五）

# ── 审计层（自检 + 报告）──
- 交付前跑五轮审计：视觉/UX/交互/工程/原创性，P0/P1 实际修复不承诺（Z3）
- 调用过词条的，每个决策点在实现里指出对应代码（Z3 §二点五）
- 报告格式：问题 → 证据 → 改动 → 验证；未验证项明确标注
```

**取舍说明**：常驻层每次生效（品味默认）；任务层是纪律不是知识本身（知识靠检索注入）；审计层决定"交付前做什么"。三层总预算建议 ≤500 tokens——system prompt 管纪律，知识走检索，不要把知识库复制进常驻层。
