# A · 厂商设计系统怎么编码"好"
（6 家官方文档 + 深度分析文 · 重点=视觉层级规则的具体写法 · 2026-11）

## 逐家发现

### Apple HIG
- 结构：无显式 principles→tokens 分层；按主题页组织，每页格式=**加粗祈使句规则 + 解释段 + 系统机制**（text styles / size classes / Dynamic Type）。
- 视觉层级写法：Layout 页 5 条祈使句——按相对重要性排序（阅读序=上→下、leading→trailing，重要项放顶部/leading 侧）；**对齐+缩进表从属**（"people perceive indented items as subordinate"）；分组用负空间/容器形/分隔线；渐进披露；控件与内容可区分。
- 字体：系统 text styles 语义名；"minimize the number of typefaces"；"prioritize important content when responding to text-size changes"——字号放大时重要内容先放、次要不跟随。
- density：不设密度档，用 size classes（compact/regular）+ safe area 处理。
- 边界：独立 "UI Design Dos and Don'ts" 页（≥44pt 触控、≥11pt 字号、对齐表达关系、文本不重叠）。
- 机读性：每个页面直接提供 `.md` 版本——文档本身即为 LLM 抓取形态。
- 源：https://developer.apple.com/design/human-interface-guidelines/layout.md · /typography.md · https://developer.apple.com/design/tips/

### Material Design 3
- 结构：Foundations(layout 原理) → Styles(type/color/elevation/spacing token 体系) → Components(每组件 anatomy+guidelines+Do/Don't)。
- 字阶：**5 角色×3 尺寸**（display/headline/title/body/label），角色按用途命名并带用途句（"display is reserved for short, important text"）；另有同结构 emphasized 套给选中/编辑态。"No single product will use all styles—select appropriate ones"。
- 色彩：26 角色 6 组；accent 角色 "assign based on importance and needed emphasis"（primary=最重要动作、secondary=无需立即注意、tertiary=小元素特殊强调）；**"Not all components should use primary"**；surface 占画面多数。on-/container/-variant 词法把配对写进命名。
- elevation：0–5 级 + 每组件 resting level 表；hover 升一级。
- spacing：线性阶+倍率命名约定（space225=18dp=8×2.25）；分组分 implicit（邻近+留白）/explicit（线/影）；"spacing to direct attention"=节奏+相似+对齐。
- 边界：组件页内嵌 Do/Don't（卡片 Don't："间距/标题/分隔线能解决的，不用卡片"）。
- 源：https://m3.material.io/styles/typography/applying-type · /styles/color/roles · /styles/elevation/tokens · /foundations/layout/grids-spacing/spacing · /components/cards/guidelines

### Microsoft Fluent 2
- 结构：principles(轻) → design tokens(global→alias 两层) → 主题页（每页=原理段+数值表）。
- 字阶：语义 ramp Caption2→Display（16 档），**同尺寸 Strong/Stronger 字重变体**——层级差主要靠字重而非字号跳档。
- 空间：4px 基 ramp（含 2/6/10 例外供图标对齐）；Layout 页直写 Gestalt："close proximity seen as meaningfully related"、"more spacing → more focus, denser → overlooked"、密集过载令人迷失——**留白量=注意力量**。
- elevation：**公式生成**（blur=n, y=0.5n, opacity 14%/28%），key+ambient 双影，6 档；"elevation conveys levels of importance"。
- density：density token = baseHeightMultiplier × designUnit（±1 档）。
- 源：https://fluent2.microsoft.design/typography/ · /layout/ · /elevation/ · /design-tokens

### Shopify Polaris
- 结构：Design guidance（每页 **Do/Don't/Caution 三态**标注）→ primitive tokens → semantic tokens（绑定唯一用途，如 space-card-padding 只能用于 Card padding）→ 组件。
- 字阶：只设 **3 角色**（display/heading/body）；decision log 记录 2 角色 vs 5 角色实测，3 是"认知负荷×灵活度"折中——角色数量本身是被设计的决策。
- 层级：weight+size+color+positioning **组合**表达，"don't rely on color only"；heading 规则：短、≥后文尺寸（lede/kicker 除外）、自明内容可省、勿全同字重。
- 空间三职责：近=相关；密度服务功能（信息量大→紧）；**rhythm+contrast——"pairing different spaces 时至少跳一档"**。
- 边界：stylelint-polaris 把边界写成 lint 规则（禁硬编码 px/em/rem 于 gap/margin/padding）——边界=可执行工具不是文档。
- 源：https://polaris.shopify.com/design/typography/using-type · /design/layout/layout-tokens · /tokens/space · https://github.com/Shopify/polaris/issues/5988 · /tools/stylelint-polaris/rules/space-declaration-property-unit-disallowed-list

### GitHub Primer
- 结构：foundations → primitives（@primer/primitives JSON，base/functional 两层 token）→ CSS utilities → 组件。
- 字阶：f00–f6 响应式（mobile 降一档）+ h1–h6；行宽 "~80 characters"；层级服务高效阅读，**"refrain from color as a primary method of emphasis"**；视觉字号与语义标题解耦，但 "don't adjust heading tag order to achieve visual design"。
- 空间：base-8 scale，"highly composable, works with the density of GitHub's content"。
- **杀手锏=DESIGN_TOKENS_GUIDE.md**：写给执行者的规则书——"You are a CSS expert. Never use raw values"；**RFC2119 分级**（MUST/SHOULD/NEVER）；bg↔fg 配对 logic matrix（MUST pair/NEVER use）；token 语法树状压缩表示；easing **决策树**；golden example 完整组件 CSS；交互态 checklist；**hallucination guard**（建议了不存在的 token 就标 `/* check-token */`）。
- 源：https://primer.style/product/getting-started/foundations/typography/ · https://github.com/primer/primitives/blob/main/DESIGN_TOKENS_GUIDE.md

### IBM Carbon
- 结构：2x Grid 语言（一切÷2，8px mini unit）→ tokens（spacing-01…13=2→160px；**字阶=公开公式** Xn=Xn-1+{INT[(n-2)/4]+1}×2）→ layer model tokens（以层代影）→ 组件。
- **字阶双套**：productive（14px 基、fixed headings）vs expressive（16px 基、fluid headings 跨断点变）——选哪套由**用户意图+KPI**决定：任务型（停留久、KPI=完成时长/放弃率）→productive；浏览型（扫读、KPI=点击率）→expressive。唯一把"选密度"写成判据的厂商。
- 边界：spacing FAQ——"deviating should be avoided whenever possible"，承认例外但默认守阶。
- 源：https://carbondesignsystem.com/elements/typography/style-strategies/ · /elements/typography/type-sets/ · https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview · https://www.ibm.com/design/language/2x-grid/

### Adobe Spectrum（补充：概念层最锋利的一家）
- Spectrum 2 把视觉层级重构为 **"attention hierarchy=一个 view 的信噪比"**："only a handful of higher-attention (louder) elements, the majority lower-attention (quieter)"；适用于色（高注意蓝 vs 低注意灰）、插画、对象样式（圆角更软更吸睛、影越深越吸睛）；高对比色与 elevation "to be used sparingly"。
- token 层开源全表（spectrum-design-data），含 deprecated→replacedBy 治理列。
- 源：https://adobe.design/ideas/designing-design-systems-a-framework-for-names-terms-and-definitions · https://opensource.adobe.com/spectrum-design-data/

## 横向结论：它们共有的编码方法
1. **不写形容词写"角色×档位矩阵"**：所有字阶都是语义角色×尺寸档，不给裸字号表；"先被看到"=被分到高角色，角色带用途句。
2. **强调是配额不是手段**：primary/high-attention/elevated 均为稀缺名额（"不是每个组件都 primary"、"loud 元素只该少数"）——层级=一页内的配额分配方案。
3. **配对语法防乱用**：on-/container/variant 词法、bg↔fg 配对 matrix、semantic token 绑 selector——"哪些值允许共现"写成表/语法而非散文。
4. **Gestalt 直译成空间规则**：近=相关、留白多=注意多、跳档才有节奏；空间是分组的第一手段（"间距能解决的不用卡片"）。
5. **密度由用户意图定档**：Carbon 用 KPI 分流两套字阶，Fluent"信息多→紧"——密度是可判的决策不是品味。
6. **边界=三态标注+可机检条款**：Do/Don't/Caution 全覆盖；Polaris lint 规则、Primer RFC2119 分级把边界变成可自动命中的条款。
7. **LLM 原生形态已出现**：Apple 每页 .md；Primer 规则书=角色设定+决策树+黄金示例+幻觉护栏——"品味→可执行结构"的最近参照。
8. **仍留给人的**：什么最重要（排序输入）、品牌表达、何时破例——所有家都把重要性排序当前提，不替产品决定它；库要补的是"让模型先问出排序"的入口。

## 可迁移点（决策点 / 验收句 / 来源）
1. 决策点=每段文本选语义角色（display/headline/title/body/label）而非字号；验收：任意文本能答出角色，display/headline 仅用于短重要文本，同角色全站同规格；源=M3 type scale。
2. 决策点=本页高注意配额给谁、给几个；验收：高注意元素≤2 且对应"用户该先做"的动作，其余落次级档；源=Spectrum attention hierarchy + M3 color roles。
3. 决策点=强调用哪组已配对值；验收：前景色只取与背景已定义的配对，层级表达≥2 通道（色+字重/尺寸/位置），不单靠颜色；源=Primer logic matrix + Polaris。
4. 决策点=哪些元素算一组；验收：组内距<组间距一档以上，抹掉分隔线仍能从间距读出分组；源=Fluent layout + Polaris space + Apple grouping。
5. 决策点=相邻间距取哪两档；验收：表达不同层级关系的间距至少跳一档（如 8→16），等距只表同级；源=Polaris space "skipping at least one unit"。
6. 决策点=视觉权重前 5 名是谁；验收：按阅读序（上→下、leading→trailing）排的眼球顺序=产品意图重要性序，缩进项从属其上项；源=Apple HIG layout。
7. 决策点=本页用户模式=任务还是浏览；验收：任务页紧凑档+fixed 字阶、浏览页宽松档+fluid 字阶，不跨档混用；源=Carbon style-strategies。
8. 决策点=首屏放多少内容；验收：次级内容收进展开结构而非铺满（渐进披露）；源=Apple HIG layout。
9. 决策点=每条规则何时别用；验收：每条视觉规则带≥1 条"X 能解决的不用 Y"反例句；源=M3 card guidelines Don't。
10. 决策点=每条规则是 MUST/SHOULD/NEVER 哪级；验收：NEVER 条款可被 lint/审计逐条命中判失败；源=Primer DESIGN_TOKENS_GUIDE。
