# B82 · 反 AI 味美学与差异化系统

> 你的知识库已经"懂设计"，但这个文件解决 **AI 生成时的默认陷阱**：不给约束，模型就会回到统计平均值——Inter 字体、紫色渐变、三张圆角卡片、白底。
> 本文件 = 提示层 + 三策略 + 五维度美学指南 + 官方 skill 精髓 + 禁忌清单。**先定一个可辩护的视觉方向，再写代码。**
> 与 B7(视觉修辞)、B16(风格词库)、B61(情绪工程) 的区别：它们是"能做什么"，本文件是"怎么让 AI 别做平庸的"。

---

## 为什么 AI 一出界面就"AI 味"

一个 prompt 同时要求模型做三件事——**选品味 + 探索方案 + 写代码**——它就会退回训练数据的平均值。

典型 AI slop 症状（看到就要替换）：
- 字体：Inter / Roboto / Open Sans / Lato / Arial / 系统默认
- 配色：紫→蓝渐变 + 白底；或任何"蓝 #4F46E5 主按钮"
- 布局：三个并排圆角卡片、居中 Hero、单调网格
- 装饰：千篇一律 soft shadow、过度 blur、为动而动
- 文案："Built for the modern team"、"Unlock your potential"

---

## 角色定位（官方 skill 的精髓）

> 把自己当成**小工作室的设计总监**：每个客户都要一个"不可能认错"的视觉身份。
> 这个客户已经拒绝过模板化提案，为独特的观点付费：
> **做出有主见的、针对本 brief 的调色板/字体/布局选择，并承担一个你能辩护的真实美学风险。**

官方流程：**brainstorm → explore → plan → critique → build → critique again**
（先头脑风暴 → 探索方向 → 规划 → 自我批评 → 构建 → 再批评——生成完必须再审视一遍）

---

## 策略一：按设计维度逐个引导（核心）

不要笼统说"做得好看"，**分别攻击 5 个维度**。每个维度给"好"的具体方向 + 明确禁区。

### 1. 字体（Typography）
- 永远不用：Inter、Roboto、Open Sans、Lato、默认系统字体
- 好选择参考：
  - 代码/技术感：JetBrains Mono、Fira Code、Space Grotesk
  - 编辑/编辑感：Playfair Display、Crimson Pro、Fraunces、Newsreader
  - 创业/启动感：Clash Display、Satoshi、Cabinet Grotesk
  - 技术专业：IBM Plex 家族、Source Sans 3
  - 独特现代：Bricolage Grotesque、Obviously
- 配对原则：**高反差才有记忆点**。Display + monospace、serif + geometric sans、可变字体跨字重。
- 用极端：100/200 与 800/900 对比，不要 400 vs 600；字号跳跃 3 倍以上，不要 1.5 倍。
- 选一个标志性字体，果断使用，从 Google Fonts 加载。**写代码前先陈述你的字体选择。**

### 2. 色彩与主题（Color & Theme）
- **主色 + 锐利强调 > 均匀平淡的调色板**（官方原话：Dominant colors with sharp accents outperform timid, evenly-distributed palettes）
- 用 CSS 变量保证一致性
- 一句话定调性："奶油纸感 + 陶土橙强调"、"墨黑 + 荧光绿点缀"、"暖沙 + 深棕"
- 灵感来源：IDE 主题（Dracula/Nord/One Dark）、文化美学

### 3. 动效（Motion）
- **一个精心编排的时刻 > 散落的微交互**（官方原话：one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions）
- 首选纯 CSS 实现；React 用 Motion 库
- 用 scroll-triggering 和 hover 惊喜
- ⚠️ **反直觉提醒：多余的动画会让设计显得 AI 生成。** 有时 less is more。

### 4. 空间构图（Spatial Composition）
- 非预期布局：非对称、重叠、对角流、破格元素
- 慷慨的负空间 **或** 受控的密度（二选一，必须是刻意的选择）

### 5. 背景与细节（Backgrounds & Visual Details）
- 创造氛围与深度，不默认纯色：渐变网格（mesh）、噪点纹理、几何图案、分层透明度、戏剧性阴影、装饰边框、自定义光标、颗粒叠加（grain）

---

## 策略二：引用具体灵感（Reference, 不是抽象描述）

模型对"某个风格关键词"有丰富理解，用它来锁定方向，胜过描述"现代、高级、大气"：

```
<always_use_solarpunk_theme>
  始终用 Solarpunk 美学：
  - 温暖乐观的配色（绿/金/大地色）
  - 有机形状与技术元素混合
  - 自然灵感图案与纹理
  - 明亮、充满希望的氛围
  - 复古未来主义字体
</always_use_solarpunk_theme>
```

可复用主题：日式侘寂、瑞士国际主义、粗野主义、编辑/杂志感、赛博终端、纸张/印刷感、复古科幻、液态玻璃、新金属、RPG 幻想、Solarpunk。完整流派见 E1 / B34。

---

## 策略三：点名常见默认值（明确说"不要"）

> 只说"要创意"不够，模型不知道哪些具体东西是"烂大街"。直接点名。

```
避免：
- 过度的字体（Inter/Roboto/Arial/系统字体）
- 陈词滥调的配色（尤其白底紫渐变）
- 可预测的布局和组件模式
- 缺乏上下文个性的千篇一律设计

仍然常见的收敛（如 Space Grotesk），必须打破：
- 每次生成换不同的字体 / 明暗 / 美学，不要收敛到同一个选择
```

---

## 官方提示块模板（可直接进 CLAUDE.md / 系统提示，约 400 token）

```
<frontend_aesthetics>
你倾向于收敛到"通用、分布均值"的输出。在前端设计里这就是"AI slop"。
避免它：做有创意、独特、让人惊喜的界面。专注：
- 字体：独特、漂亮、有趣。绝不 Inter/Arial/Roboto。用有辨识度的选择。
- 色彩与主题：坚持一个统一的审美，用 CSS 变量。
  主色 + 锐利强调优于平淡均匀的调色板。
- 动效：纯 CSS 优先，React 用 Motion。一个精心编排的页面加载
  （staggered reveals）胜过散落的微交互。用 scroll 触发和 hover 惊喜。
- 背景：用渐变网格/几何图案/质感，创造氛围与深度，不默认纯色。
避免通用 AI 审美：
- 过度使用的字体（Inter/Roboto/Arial/系统字体）
- 陈词滥调配色（尤其白底紫渐变）
- 可预测的布局和组件模式
- 缺乏上下文个性的千篇一律设计
为场景做"为它而生"的设计。明暗交替、字体变化、美学多样，
不要在每次生成时收敛到同一个答案。
</frontend_aesthetics>
```

> 来源：Anthropic cookbook `prompting_for_frontend_aesthetics`（有对照实验验证：无此块 = 白底紫渐变，有此块 = 多样化有性格的输出）。

---

## 进阶：隔离提示（Isolated Prompting）

想单独提升某个维度、或锁定主题跨多次生成保持一致时，用隔离块（比全量美学块生成更快、更可控）：

```
<use_interesting_fonts>
字体即时传达品质。别用无聊的通用字体。
绝不使用：Inter、Roboto、Open Sans、Lato、默认系统字体
有冲击力的选择：
- 代码感：JetBrains Mono、Fira Code、Space Grotesk
- 编辑感：Playfair Display、Crimson Pro、Fraunces
- 创业感：Clash Display、Satoshi、Cabinet Grotesk
- 技术感：IBM Plex、Source Sans 3
- 独特感：Bricolage Grotesque、Newsreader
配对原则：高反差=有趣。Display+等宽、衬线+几何无衬线、可变字体跨字重。
用极端：100/200 vs 800/900，不要 400 vs 600。字号跳跃 3 倍+，不要 1.5 倍。
选一个标志性字体果断使用，从 Google Fonts 加载。写代码前先陈述选择。
</use_interesting_fonts>
```

---

## 官方 skill 补充原则（容易漏的"软"规则）

1. **先锚定主体（Ground it in the subject）**：brief 没定就自己定——一个具体主体、受众、页面唯一任务，先陈述你的选择。
2. **结构即信息（Structure is information）**：编号标记（01/02/03）、眉题、分隔线、标签必须**编码真实内容**，不是装饰。内容不是真实序列时不要用编号。
3. **复杂度匹配愿景**：极繁方向要复杂的执行；极简方向要间距/字体/细节的精确。优雅 = 把选定的愿景执行好。
4. **文案也是设计素材**：brief 常无真实内容，自己写文案。写得像模板的文案会毁掉整个设计。从屏幕另一端（用户）的视角写。
5. **删减法则（香奈儿）**：出门前照镜子，摘掉一件配饰。完成稿再删一点。
6. **截图自查**：构建中截图看效果——一张图值 1000 tokens。

---

## 强制流程：先承诺方向，再写代码

```
第 1 步：确定主体、受众、页面唯一任务，陈述你的选择
第 2 步：承诺一个具体美学方向（palette + 字体 + 布局母题 + 背景质感）
第 3 步：列出你故意"不做的默认做法"（anti-defaults）
第 4 步：才允许写代码
第 5 步：写完自查（下方清单），Critique 后再交付
```

---

## 差异化的落地清单（写完代码自查）

- [ ] 去掉所有默认字体（Ctrl+F 检查 font-family）
- [ ] 不是白底 + 一种渐变的配色；有主色 + 锐利强调
- [ ] 至少一个"敢于不同"的视觉决策（能一句话解释理由）
- [ ] 布局不是三卡片对称居中；有非对称/破格/重叠元素
- [ ] 有上下文相关的细节（行业、产品、受众特征渗透进视觉）
- [ ] 明暗对比、字号对比用了"极端值"而非"中间值"
- [ ] 背景有质感/层次（mesh/噪点/几何/分层），不是纯色
- [ ] 动效：一个编排时刻 > 散落微交互；有多余动画就删
- [ ] 编号/标签等结构元素编码真实信息，非装饰
- [ ] 文案从用户视角写，无模板腔
- [ ] 极繁极简各按其愿景执行到位（复杂度匹配）
- [ ] 已完成删减（摘掉一件"配饰"）
- [ ] 响应式到移动、键盘焦点可见、reduced-motion 尊重

---

## 参考资料（第二轮已深挖）

- `anthropics/skills` → `frontend-design/SKILL.md`（官方完整版，上述原则均出自此处）
- `anthropics/claude-cookbooks` → `prompting_for_frontend_aesthetics.ipynb`（DISTILLED_AESTHETICS_PROMPT 原文 + 隔离提示 + 对照实验）
- `designprompts.dev` — 31 种风格提示库（同一数据换 31 种设计风格，类似 CSS Zen Garden）
- Taste Skill（uiroot）— 开源的"品味"技能，防 AI 生成平庸输出
- `awesome-prompts` frontend_developer.txt — 工程侧提示（性能/无障碍/质量默认值）
- 结合本库：B7(视觉修辞)、B16(风格词库)、B61(情绪工程)、F2(触发词)、E1(风格流派)、B44(禁忌)
