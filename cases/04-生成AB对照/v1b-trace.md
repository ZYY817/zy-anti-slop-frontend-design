# v1b-trace.md · 生成过程记录（V1 知识库辅助组 · 第二次独立生成）

> 任务：团队协作 SaaS「通知中心」下拉面板（见 `brief.md`，含"范围钉死"：真实工作台页内嵌通知面板）。
> 与 v1 的关系：**同一任务书的第二次独立武装生成**，不复用 v1 的方向（v1=墨底柿橙组件展示页；v1b=青瓷台账 + 真实工作台，回答 brief 的"范围钉死"要求）。

---

## 1. 工作流路径

```
AGENTS.md → 00-总索引.md → Z2 检索协议 → K0 词条地图 → 命中 K14（核心）→
Z1 第0层轻量方向卡（Z2 §二点五 R 闸门：常规 UI 不开 R，但必答方向卡）→
领域文档精读 → M1 方向陈述 → 生成 v1b.html → Z3 五轮自检 + 无头 Chrome 实证 → 实际修复 → 本记录
```

## 2. Z1 第0层轻量方向卡（4 项答案原文）

> §二点五 R 闸门判定：常规产品 UI、视觉非主表达 → 不开 R 板块，但方向卡必答。

1. **气质三词**：清亮 / 紧凑 / 笃定 —— "晨间台账"感的工作台。通知面板是"看一眼有什么找我"的工具，气质上克制、不吵、可扫读。
2. **配色来源与剂量**：取自"青瓷台账 + 朱砂印"。雾灰青底 `#ECEFED`（账房里的晨光）、纸面 `#FDFEFC`、深松墨顶栏 `#141F1A`；品牌松绿 `#0E6E55` 剂量 ≤5 处（logo 标 / 当前导航 / 主按钮 / 链接与操作 / focus ring）；朱砂 `#C2402A` **专司未读语义**（徽标 / 未读点 / @提及 chip），不泛化为品牌强调色——绿=动作，朱=未读，两色职责分离。
3. **材质档**：哑光纸面 + 1px 发丝线（`#DCE2DC`）+ 单层柔和投影；装饰手法仅 1 种——页顶极淡青雾径向光晕（rgba .075）；无玻璃、无噪点、无渐变堆砌。工作台问候用宋体系（思源宋体/Songti 栈），是"晨报签名"式的唯一感性笔触。
4. **反面清单**：不做白底紫蓝渐变、不用 Inter/Roboto、不用蓝色未读点默认体系、不用 emoji 图标（全内联 SVG 描边）、不写"暂无数据"式文案、不做孤立组件演示页（范围钉死：面板嵌在真实工作台顶栏内）、modal 用量 = 0、不把紫/蓝渐变用于任何元素。

## 3. 实际读取的文档（9 篇全文 + 5 个片段）

| 文档 | 读取方式 | 取用了什么 |
|---|---|---|
| `AGENTS.md` | 全文 | 工作流、R 闸门新规则、反 AI 味参考清单 |
| `00-总索引.md` | 全文 | 板块路由、K 词条导航、快速对照表 |
| `Z2-Prompt检索与组合编排` | 全文 | 上下文对象、§二点五方向卡义务、K 决策点编译规则、冲突裁决顺序 |
| `Z1-终极Prompt生成器` | 全文 | 第0层轻量方向卡 4 项、K·词条作答块、质量底线层 |
| `M1-AI生成顶级前端方法论` | 全文 | 先陈述方向再写码；DESIGN.md 式令牌完全替换；三个验收测试 |
| `Z3-前端质量审计与迭代闭环` | 全文 | 五轮检查表、P0-P3 分级、§二点五词条决策点核对 |
| `K0-词条总索引与检索` | 全文 | 16 分类地图 → 定位 K14；确认 K3/K12/K18 边界词条 |
| `K14-通知打断与浮层治理` | **全文（核心词条）** | 5 个决策对象逐项作答，见 §4 |
| `B52-空状态设计大全` | 全文 | 空态八型（本案命中"已清空"型）、文案禁忌、stagger 入场、表格空态保留表头思路→组头保留 |
| `B74-微交互配方大全` | 全文 | toast 滑入（七）、列表项进出（十）、滚动渐隐 mask（12.2）、勾号绘制、reduced-motion 全局降级写法 |
| `B76-无障碍实操模式` | 全文 | Disclosure 模式（aria-expanded/controls）、焦点归还、aria-live 用法 |
| `B82-反AI味美学与差异化系统` | 全文 | 五维引导、点名默认值、差异化自查清单（写码前承诺） |
| `C5-微文案` | 片段（八/九节） | 不该弹确认清单 → 全部已读走 Toast+Undo；toast 文案=一句话陈述结果 |
| `K3-悬停与指针微观判定` | 片段（K·触屏无hover） | hover 承载物三级分级、`@media (hover:hover) and (pointer:fine)` 写法 |
| `K12-容错与恢复链` | 片段（K·撤销） | 撤销四决策点、批量撤销粒度、恢复原位要求 |
| `K18-视觉治理与例外` | 片段（K·视觉配额） | 配额五决策点 |
| `G2-后台管理` | 片段（顶栏节） | 顶栏 56px 右置搜索+铃铛+头像构型、密度档位参考 |

> 预算核对：全文精读 9 篇 + 片段 5 个 + K 词条 4 个（折算 ≈1.3 篇配额），在 5-12 区间内。R 板块未开闸（Z2 §二点五）。
> 另参考了同目录 `v1-trace.md` 与 `brief.md`（确认任务范围与"范围钉死"），未读 `v1.html` 源码（保持方向独立）。

## 4. 项目上下文对象（Z2 §一）

```yaml
product_type: dashboard（团队协作 SaaS 工作台，通知面板内嵌顶栏）
primary_user: 团队成员（沈澜·设计），工作中被 @/指派/回复
primary_job: 扫一眼"有什么事找我"，清空未读心智负担，回到工作
business_goal: efficiency + retention
device: desktop web 下拉面板（触屏降级方案必备）
brand_personality: 清亮、紧凑、笃定
content_shape: dense-data（信息流列表）+ 工作台数据
interaction_risk: medium-high（实时到达 / 状态迁移 / 撤销 / 浮层焦点）
tech_stack: 单文件 HTML，内联 CSS/JS，零外部依赖
constraints: [中文界面, ARIA/键盘/reduced-motion, 真实语义 mock, 范围钉死]
quality_bar: premium
```

## 5. 命中词条与决策点作答

### K14·打断层级升级链 ★核心决策

① **通道分级**
- Decision：按"是否需要本人动作"分两通道——`TOAST_TYPES = {mention, assign}` → 轻打断 toast（右上滑入卡片 + [查看] + 5s 计时）；`reply / system` → 零打断（仅徽标 +1 弹跳 + 列表滑入 + aria-live 播报）。永不 banner、永不 modal。
- Reason：通知中心本身是聚合地，全量 toast = 轰炸；但 @/指派语义是"有人等你回应"，值 5 秒轻提醒。**面板已打开时全部降为列表内滑入**（注意力已在场，连 toast 都多余）。
- Spec：`arrive()` 三分支：`panelOpen` → 仅 `n-li-arrive` 滑入 + announce；`TOAST_TYPES` → `showArrivalToast`；其余 → `bumpBadge` + announce。

② **升级规则**
- Decision：不升级。toast 生命周期内同类到达**合并**进同一条（`"苏晓棠 等 2 条新通知"`）而非叠加新 toast；用户忽略 toast 不升 banner/modal。
- Spec：`toastItems[]` 合并池；`showArrivalToast` 检测 `.toast[data-kind="arrival"]` 存在则更新文案 + 重臂计时。

③ **降级规则**
- Decision：全部已读 / 清除已读 → toast + [撤销]，零确认弹窗；单条已读 → 就地收起动画 + aria-live，零 toast。
- Spec：`showUndoToast(text, snapshot)`；`markRead()` 仅 moveToRead + `announce()`。

④ **打断成本表**
- Decision：modal 用量 = 0。本案没有任何"必须回答才能继续"的事（两批量操作均可撤销）。
- Spec：全文无 dialog/modal/backdrop。

### K14·Toast 队列治理

① 同屏上限：实际并发 ≤2（到达通道 + 撤销通道各一条，`.toast-root{gap:12px}`）；到达类永远只渲染一条（合并非叠加）。
② 优先级与去重：toast 存活窗口内连续到达 → 更新同一条计数；关闭时 `toastItems` 池清空（`dismissToast` 中 `dataset.kind==='arrival'`）。
③ 自动消失：到达 5s、撤销 6s（批量操作取 8-10s 建议下限，因内容轻且高频）；hover/focusin 暂停计时——**rAF 驱动进度条与计时器共享同一 deadline**，暂停即冻结进度条（v1 案例反哺经验已吸收）。
④ 读屏分道：`toastRoot` 容器 `aria-live="polite"` + 每条 `role="status"`；无 assertive（无阻断级消息）；toast 通道到达时跳过独立 announcer 播报，防双读。

### K14·徽标与未读

① 计数上限：99+ 封顶（`badge.textContent = u>99?'99+':u`）。
② 清零时机：**进面板不清零**——仅显式动作清零：点未读点 / 点条目本体 / 全部已读。开面板扫一眼不吞未读。
③ 红点 vs 数字：数字徽标（待办型产品有确切未读语义）；0 时徽标整体隐藏；铃铛 `aria-label` 同步"通知，N 条未读"。
④ 层级穿透：N/A（单级入口）。

未读态视觉（"三选一并统一"之外的第四种形态，v1 已验证、本案采用）：
- Decision：**指示器即操作**——右侧朱砂未读点本身就是"标为已读"按钮：桌面 hover 时光晕展开浮出勾号，键盘 focus-visible 等效，触屏天然常驻（点本来就是常驻指示器）；叠加底色暖纸 tint + 标题字重提升 = 多通道冗余（B43）。
- Spec：`.n-read-btn::before` 为点本体（transform scale(0)/opacity 0 ↔ svg check scale(.5→1) 互换）。

### K14·浮层堆叠治理

① 层级表：`workbench(0) < topbar sticky(10) < panel popover(40) < toast(70)`——toast 恒压面板。
② 嵌套许可：单浮层；面板内不再开浮层；无 Modal 可能。
③ 焦点栈：非模态 Disclosure——焦点停留铃铛（`aria-expanded` 播报开关），Tab 依 DOM 顺序自然入面板（面板 DOM 紧随铃铛）；Esc 先关最上 toast 再关面板；`closePanel(true)` 归还焦点给铃铛；`pointerdown` 外点关闭。
④ 背景锁滚：非模态不锁滚；面板内 `overscroll-behavior:contain` 防穿透；列表过长时底部渐隐 mask 提示可滚（`has-more` 仅在未滚到底时挂载）。

### K12·撤销与破坏性操作（片段取用）

① 确认 vs 撤销：两批量操作（全部已读 / 清除已读）= 可逆 → Toast+Undo，零 modal。
② 撤销窗口：6s，hover/focus 暂停（与到达 toast 同一 `armTimer` 机制）。
③ 撤销粒度：整组——一条 toast 撤销整组。
④ 实现：**快照绑定在 toast 元素上**（`el._snapshot`），两条 undo toast 共存各撤各的；恢复按 `ORDER` 数组（原始顺序快照 + 到达时 unshift）排序回写，恢复原位——满足词条"恢复原位置"要求。

### K3·触屏无 hover（片段取用）

① hover 承载物分级："标为已读"按钮若 hover 才出现 = 功能被 hover 独占 → 必须常驻。本案未读点即指示器故天然常驻；桌面 hover 只做不透明度 .75→1 的强调，`@media (hover:hover) and (pointer:fine)` 限定。
② 粘滞清除：hover 样式全在 `(hover:hover)` 媒体内，触屏无残留。
③ 长按语义：N/A（功能常驻，无需长按等价物）。
④ 媒体查询写法：`(hover:hover) and (pointer:fine)`，非屏宽断点。

### K18·视觉配额（片段取用）

① signature 峰值：1 个——通知面板及其到达编排（铃铛摆动 + toast）；工作台全部让位。
② 强调色配额：松绿计 5 处（logo 标/当前导航/新建任务/链接操作/focus ring）；朱砂为未读语义色不计品牌配额，出现于徽标/未读点/提及 chip。
③ 装饰手法：1 种——页顶青雾径向光晕（.075）。无噪点/玻璃/网格。
④ 同屏动效并发：≤2——到达时"徽标弹跳 + toast 滑入 + 铃铛摆动"错峰编排；列表滑入独立发生。
⑤ 纹理剂量：0。

### 未命中 / 判定不适用

- K·权限可见性（K14 内）：N/A——单用户 mock；`全部已读` 在未读为 0 时按 disable+原因处理（`disabled` + `title="没有未读通知"`），`清除` 按 hide 处理（无已读时隐藏）——四策略混用有语义依据。
- K·悬停意图/延迟（K3）：无悬停展开的浮层，不涉及。
- K9 辨析：本案为 Disclosure/Popover（非模态、DOM 相邻、外点关闭），非 Menu（无 menuitem/箭头漫游）、非 Dialog（非模态无焦点陷阱）——选型本身即答案。
- R 板块：不开闸。

## 6. 设计方向陈述（M1：写码前承诺）

- **产品**：「汇川 Conflux」协作 SaaS；"百川入海"的通知聚合隐喻；工作台为组件宿主而非演示页。
- **字体**：正文系统 CJK 无衬线栈（零依赖约束下不可外链）；工作台问候 `wb-h1` 与空态标题用宋体栈（思源宋体/Songti/STSong）——晨报式签名；一切数字 `tabular-nums`，徽标/时间/kbd 用等宽栈。
- **布局签名**：深松墨顶栏（56px 右置 ⌘K+帮助+铃铛+头像）压浅色工作台；面板内"类型 chip（提及/指派/回复/系统，文字型而非色条型）+ 首字头像 + 两行文本 + 右侧指示器即操作点"。
- **差异化落点**：类型用**文字 chip** 而非颜色条（信息冗余更直观）；未读区分=暖纸 tint + 字重 + 点三通道；已读项 hover 不藏操作——没有操作可藏。
- **反默认清单**：非白底紫渐变、非蓝点未读、非三圆角卡 hero、非 emoji 图标、非"暂无数据"、非 showcase 演示页。

## 7. Z3 五轮自检与修复记录

### 实际修复（P0/P1 全部实改，含实证发现）

| # | 级别 | 问题 → 修复 |
|---|---|---|
| 1 | P0 | `markAllRead` 延迟提交与撤销竞态：动画提交期内点撤销，pending setTimeout 仍会把全部标已读 → `pendingMarkAll` 句柄，doUndo 中 `clearTimeout` + 置 null，按钮加防连点守卫 |
| 2 | P0 | undo 快照全局单槽：两条 undo toast 共存时旧 toast 撤销拿错快照 → 快照绑定元素 `el._snapshot`，各撤各的 |
| 3 | P1 | `clearRead` 用全局 CLEARED 数组恢复，二次清除互相污染 → 快照内直接存 items 数组 |
| 4 | P1 | `markRead` 视觉移到已读顶部但数据模型未重排，下次 renderAll 会跳回原位 → 模型 splice 重排至已读区顶部，与 DOM 落位一致 |
| 5 | P1 | doMove 手动插 DOM 后 renderAll 重建，enter 动画被销毁 → 改为先 renderAll 再对新建 li 加 `n-li-enter` |
| 6 | P1 | collapse 的 transitionend 被 opacity（更短）抢先触发，条目在高度未收完时被移除闪断 → 只认 `propertyName==='height'` |
| 7 | P1 | toast 合并更新重臂计时时指针可能已在内部，pause 不触发 → `armTimer` 末尾补 `el.matches(':hover')` 检查 |
| 8 | P1 | 对比度三处不足：`--ink-3` 在未读暖底上 ~4.3:1 → `#5F6A62`(~5:1+)；`--warn` ~3.8:1 → `#96660F`(~5.3:1)；任务复选框边框 ~1.8:1 不达组件边界 3:1 → `#7C8780`(~3.5:1) |
| 9 | P1 | `has-more` 渐隐滚到底仍显示 → 改为仅"可滚且未到底"时挂载 |
| 10 | P2 | 系统通知文案"汇川助手「设计系统 2.0」组件库发布完成"角色冗余 → system 类型正文不渲染 actor |
| 11 | P2 | flash 高亮动画结尾在未读条目上闪回透明 → 用 `--flash-end` 变量按已读/未读分流落点色 |
| 12 | P2 | `task-check` 缺 aria-pressed；新建任务按钮与 # 死链接无行为/污染 URL → 补 aria-pressed 切换、新建任务真实插行、`a[href="#"]` 拦截 |
| 13 | P2 | 已读条目点击零反馈 → 点击=回看定位，给 flash 高亮（呼应 K14 实现注"回看链路"） |
| 14 | P2 | 未读点按钮垂直偏下 → margin-top 对齐第一文本行 |

### 五轮结果

- **R1 视觉**：眯眼→工作台主块(任务卡)+次块(侧栏)+面板 popover 唯一浮层峰值；装饰 1 种；签名=松墨顶栏+朱砂未读语义+宋体问候。✅
- **R2 内容**：9 条真实语义 mock（4 类型分布 4/5：提及 2/指派 2/回复 3/系统 2）+ 3 条到达池；人名/项目/时间前后一致（工作台任务与通知互相引用：指派任务就在今日任务列表里）；空态文案无负面词。✅
- **R3 交互**：hover/active/focus-visible/disabled(全部已读置灰+原因)/empty(双空态)/loading 等价物全有；触屏未读点常驻；reduced-motion 全降级（含 toast 进度条隐藏、计时器不依赖动画）；长短文本 clamp+ellipsis。✅
- **R4 工程/a11y**：Disclosure 模式 aria-expanded/controls、region 标签、aria-live polite 分道、Esc 焦点归还、`[hidden]` 全局兜底、transform/opacity 动画、零外部资源、面板绝对定位无 CLS。✅
- **R5 原创性**：遮 logo 可识别的约束组合（青瓷台账双色职责制 + 文字 chip 类型系统 + 点即按钮 + 打断分级语义化 + 真实工作台宿主），非"蓝点+圆角卡"默认组合。✅

### 无头 Chrome 实证（非"感觉对了"）

用桩化 matchMedia(setTimeout) 在 `--dump-dom` 下跑了两套断言：

- **状态机测试**（22 断言，全 PASS）：初始 4U/5R/徽标4 → 开面板 aria-expanded → 单条已读 3U/6R 且置顶已读 → 全部已读 0U + 零未读态 + 徽标隐藏 + 按钮禁用 + undo toast → 撤销回 3U → 清除已读 R0 + 组隐藏 → 撤销回 6R → Esc 焦点归还铃铛 → 面板回落 hidden。
- **到达路径测试**（11 断言，全 PASS）：mention 到达→toast+徽标5；reply 到达→零打断仅徽标6；assign 到达→**合并进同一条 toast** 标题"等 2 条新通知"；[查看]→开面板+定位高亮；面板开着时到达→零 toast 仅列表滑入；Esc 焦点归还。

> 测试方法：`v1b-test*.html`（注入 matchMedia/setTimeout 桩使动画同步化）→ headless Chrome `--dump-dom` → 读 testout 断言。两个 FAIL 均为测试断言写错（undo 后首未读应为 n2 非 n1；清除撤销恢复 6 条非 9 条），产品逻辑核实无误。

### 未验证项（诚实标注）

- 真实屏幕阅读器播报顺序（NVDA/VoiceOver 未跑，按 APG 结构推断）⬜
- 真实触屏设备未读点常驻与无粘滞（媒体查询写法正确，无真机）⬜
- 对比度为手工计算（~值），未过 axe/Lighthouse ⬜
- 到达呈现为定时器模拟推送，非真实 WebSocket ⬜

### 词条反哺线索（供 M2 参考）

- K14·打断层级升级链"回看链路"注：本案补充了一种形态——**已读条目点击=回看定位 flash**（同一手势对未读是标已读、对已读是回看），与 toast[查看] 定位共用 `flashItem` 实现，语义自洽。置信：逻辑推理 ⚠️（单案例）。
- K12·撤销"恢复原位置"注：当未读项标记后会**模型重排**到已读区顶部（新惯例），撤销需独立顺序快照（ORDER）才能回写原位——词条未提"重排型列表"的实现注，本案实证其必要性。置信：逻辑推理 ⚠️。
- K14·Toast 队列"两条 undo toast 共存"：快照必须绑定元素而非全局槽，否则后开 toast 的撤销拿错数据——本案实证。置信：逻辑推理 ⚠️。
