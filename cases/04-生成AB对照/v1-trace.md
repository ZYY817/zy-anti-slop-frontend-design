# v1-trace.md · 生成过程记录（V1 知识库辅助组）

> 任务：团队协作 SaaS「通知中心」下拉面板（见 `brief.md`）。
> 本文件记录：实际读了哪些文档、命中哪些 K 词条、每个决策点的作答（Decision/Reason/Spec 简式）、生成后 Z3 自检结果。

---

## 1. 工作流路径

```
AGENTS.md → 00-总索引.md → Z2 检索协议 → K0 词条地图 → 命中 K14 →
领域文档精读 → M1 方向陈述 → 生成 v1.html → Z3 五轮自检 → 实际修复 → 本记录
```

## 2. 实际读取的文档（12 篇 + 3 个片段）

| 文档 | 读取方式 | 取用了什么 |
|---|---|---|
| `AGENTS.md` | 全文 | 工作流铁律、反 AI 味参考清单定位 |
| `00-总索引.md` | 全文 | 板块路由、K 词条清单、快速对照表 |
| `Z2-Prompt检索与组合编排` | 全文 | 上下文对象、检索评分、Decision/Reason/Spec/Check 编译格式、冲突裁决顺序 |
| `K0-词条总索引与检索` | 全文 | 16 分类地图 → 定位 K14 为核心词条 |
| `M1-AI生成顶级前端方法论` | 全文 | 先陈述字体/色彩/布局再写码；规格非形容词；三验收测试 |
| `Z3-前端质量审计与迭代闭环` | 全文 | 五轮审计表、P0-P3 分级、K 决策点核对（§二点五） |
| `K14-通知打断与浮层治理` | **全文（核心词条）** | 5 个决策对象全部逐项作答，见 §3 |
| `B52-空状态设计大全` | 全文 | 空态结构（图/标题/描述/CTA）、文案禁忌（不用"暂无"）、stagger 入场 |
| `B73-状态体验与感知性能工艺` | 全文 | 四态速查、Delight 稀有性（未用 confetti） |
| `B74-微交互配方大全` | 全文 | 列表项进出（十）、toast 滑入+倒计时（七）、滚动渐隐 mask（12.2）、reduced-motion 全局降级 |
| `B76-无障碍实操模式` | 全文 | Disclosure/menu-button 模式（aria-expanded/controls/haspopup）、焦点归还、focus-visible |
| `B82-反AI味美学与差异化系统` | 全文 | 五维度引导、点名默认值、差异化自查清单 |
| `C5-微文案` | 片段（空态/Toast/确认三节） | "不该弹确认"清单、toast 文案=陈述结果一句话 |
| `K3-悬停与指针微观判定` | 片段（K·触屏无hover） | hover 承载物三级分级、媒体查询写法 |
| `K12-容错与恢复链` | 片段（K·撤销） | 撤销四决策点 |
| `K18-视觉治理与例外` | 片段（K·视觉配额） | 配额五决策点 |
| `G2-后台管理` | 片段（顶栏/通知位） | 顶栏 56px 右置搜索+铃铛+头像的经典构型（仅参考结构，未抄样式） |
| `cases/README.md` / `cases/04 brief.md` | 全文 | 本测试为 V0/V1 盲审对照，产出约束 |

> 预算核对：精读 12 篇 ≈ 上限内；K 词条按 §二点六 折算（1 词条 ≈ 1/3 配额）。未动用 R 板块——纯 UI 组件，视觉非主表达（Z2 §二点五闸门）。

## 3. 项目上下文对象（Z2 §一）

```yaml
product_type: dashboard（团队协作 SaaS 内嵌组件）
primary_user: 团队成员，工作中被 @/指派/回复时收到通知
primary_job: 扫一眼"有什么事找我"，处理未读，清空心智负担
business_goal: efficiency（通知处理效率）+ retention（回流）
device: desktop web 下拉面板（触屏需降级）
brand_personality: 克制、工具感、有温度但不吵
content_shape: dense-data（信息流列表）
interaction_risk: medium（实时到达 / 状态迁移 / 浮层焦点）
media: none
tech_stack: 单文件 HTML，内联 CSS/JS，零外部依赖
constraints: [中文界面, ARIA/键盘/reduced-motion, 真实语义 mock]
quality_bar: premium
```

## 4. 命中词条与决策点作答

### K14·打断层级升级链 ★核心决策

① **通道分级**
- Decision：新通知到达按"是否需要本人动作"分两通道——@提及/任务指派 → 轻打断 toast（顶部滑入预览 + [查看]）；评论回复/系统通知 → 零打断（仅徽标 +1 + 列表滑入）。永不 banner，永不 modal。
- Reason：通知中心本身就是聚合地，全部 toast 会轰炸；但 @/指派语义是"有人等你回应"，值得 5 秒轻提醒。回复/系统只需"有数"。面板已打开时全部再降一级为列表内滑入（注意力已在场）。
- Spec：`TOAST_TYPES = Set(['mention','assign'])`；`arriveNext()` 中 `panelOpen` 分支。

② **升级规则**
- Decision：不升级。同类通知在 5s 窗口内合并进同一条 toast 计数（"等 N 条新通知"），不因堆积而升 banner/modal。
- Reason：词条降级规则"能 toast 不 modal"；用户忽略 toast ≠ 授权更强打断。
- Spec：`toastItems[]` 合并池，`showArrivalToast` 复用 `liveToast` 更新文案并重置计时。

③ **降级规则**
- Decision：全部已读成功 → toast + 撤销（不弹确认）；单条已读 → 就地动画反馈，零 toast。
- Spec：`showUndoToast()`；`markRead()` 只做 moveToRead 动画 + aria-live 播报。

④ **打断成本表**
- Decision：本组件 modal 用量 = 0——没有任何"必须回答才能继续"的事（全部已读可撤销，故非不可逆）。
- Spec：无 dialog/modal 元素。

### K14·Toast 队列治理

① 同屏上限：实例中最大并发 2（到达 toast + 撤销 toast 各一条通道），堆叠间距 12px（`.toast-root{gap:12px}`）。到达类永远只渲染一条（合并而非叠加）。
② 优先级与去重：5s 窗口内连续到达 → 合并为 "X 等 N 条新通知"（`toastItems`）；到达 toast 关闭时清空合并池（`dismissToast` 中 `_kind==='arrival'` 判断）。
③ 自动消失：到达 toast 5s、撤销 toast 6s（批量操作取词条 8-10s 建议之下限，因内容轻）；hover/focus 暂停计时——**用 rAF 驱动进度条与计时器同源**，暂停即冻结进度条（不自相矛盾）。
④ 读屏分道：`toastRoot` 整体 `aria-live="polite"`，toast 元素 `role="status"`；无 assertive（无 error/阻断级消息）。

### K14·徽标与未读

① 计数上限：99+ 封顶（`badge.textContent = c>99?'99+':c`）。
② 清零时机：**进入面板不清零**——只有显式动作清零：点未读点 / 点条目本体 / 全部已读。
- Reason：词条推荐"避免看了但没看"；打开面板扫一眼不该静默吞掉未读。
③ 红点 vs 数字：数字徽标（有确切未读数语义，待办型产品该给数）；不用 NEW 标；铃铛 `aria-label` 同步读出计数。
④ 层级穿透：N/A（单级入口，无导航树聚合）。

未读态视觉（词条实现注"三选一并统一"的作答）：
- Decision：主区分 = **底色 tint + 左侧实心类型色条（已读降 35% 透明度）**；"点"不是第二套指示器，它本身就是**标记已读按钮**（hover 时圆点放大成光晕并浮出勾号）。
- Reason：指示器与操作合一，消灭"为什么点这里"的歧义；全站只有这一套未读语言。

### K14·浮层堆叠治理

① 层级表：`topbar(10) < panel popover(40) < toast(70)`——toast 永远压得住面板（z-index 与词条表同构）。
② 嵌套许可：单浮层，面板内不再开浮层；无 Modal 套 Modal 可能。
③ 焦点栈：非模态 Disclosure——焦点停留铃铛（`aria-expanded` 已播报），Tab 自然进入面板 DOM（面板在 DOM 中紧随铃铛）；Esc 先关 toast 再关面板，焦点归还触发按钮（`closePanel(true) → bellBtn.focus()`）；外点 `pointerdown` 关闭。
④ 背景锁滚：非模态不锁滚；面板内部 `overscroll-behavior:contain` 防滚动穿透，列表过长时底部渐隐 mask 提示可滚。

### K12·撤销与破坏性操作（片段取用）

① 确认 vs 撤销：全部已读 = 可逆操作 → Toast + Undo，零 modal。
② 撤销窗口：6s；hover/focus 暂停（与到达 toast 同一 `armTimer` 机制）。
③ 撤销粒度：**整组**——一条 toast "已将 N 条标为已读 [撤销]"，撤销恢复整组原序。
④ 实现模式：快照 id 数组（`snapshot`），撤销时回写 `unread=true` + `renderAll()` 恢复原 DOM 顺序；已读组用 `insertBefore(el, children[i])` 保序插入而非 append。

### K3·触屏无 hover（片段取用）

① hover 承载物分级：单条"标记已读"按钮若 hover 才出现 = 功能被 hover 独占 → 触屏必须常驻。
- Spec：未读点即指示器故**天然常驻**；桌面 hover 只改变不透明度（`.55→1`）；`@media (hover:hover) and (pointer:fine)` 限定，`:focus-within` 同样拉满不透明度（键盘路径等效）。
② 粘滞清除：`@media (hover:hover)` 隔离 hover 样式，触屏无残留。
③ 长按语义：N/A——功能常驻，不需要长按等价物。
④ 媒体查询写法：`@media (hover:hover) and (pointer:fine)`，非屏宽断点。

### K18·视觉配额（片段取用）

① signature 峰值：1 个——面板本身；演示页其余全部让位（墨底 + 一行 kicker + 三个控制按钮）。
② 强调色配额：柿橙 `#D9531E` 计 5 处——徽章底、未读点、@提及色条、toast [查看]、kicker——面积 <<3%。
③ 装饰手法：1 种——页面顶部一层径向暖光晕（rgba .07，<10%）。无噪点、无玻璃、无网格。
④ 同屏动效并发：≤2——到达时"徽标弹跳 + toast 滑入"错峰；列表滑入独立发生。
⑤ 纹理剂量：0。

### 未命中/判定不适用

- K·权限可见性（K14 内）：N/A——单用户视角 mock，无权限态。但 `全部已读` 按钮在未读为 0 时按"disable+原因"模式处理（`disabled` + `title="没有未读通知"`）。
- K·悬停意图/延迟（K3）：无悬停展开菜单/工具提示，不涉及。
- R 板块：不开闸（纯 UI 组件）。

## 5. 设计方向陈述（M1：写码前承诺）

- **产品**：「织梭 Shuttle」协作 SaaS，演示页为组件 showcase。
- **色彩**：墨底页面 `#17140F` + 纸面面板 `#FBFAF7`；唯一强调色柿橙 `#D9531E`；类型编码 4 色条（提及=柿橙/指派=青碧/回复=靛青/系统=暖灰），仅出现在 3px 色条与 10.5px 类型字上。
- **字体**：正文系统 CJK 无衬线栈（零依赖约束下不可外链字体）；**时间/计数/徽标/快捷键一律等宽栈 + tabular-nums**——工程感签名。
- **布局签名**：左 3px 类型色条 + 未读点即已读按钮 + sticky 分组头（"未读 4 / 已读"）。
- **反默认清单**：非白底紫渐变、非三张圆角卡、非蓝色未读点体系、无 emoji 图标（全内联 SVG 描边）、无"暂无数据"式文案。

## 6. Z3 五轮自检与实际修复

### 修复记录（P0/P1 全部实改）

| # | 级别 | 问题 | 修复 |
|---|---|---|---|
| 1 | P0 | `[hidden]` 被 `.panel`/`.g-empty`/`.p-empty` 的 `display:flex` 覆盖 → 元素永远可见 | 全局 `[hidden]{display:none!important}` |
| 2 | P0 | `markAllRead` prepend 逆序 + appendChild 把新已读项挪到已读组底部 | 改 `insertBefore(el, children[i])` 保序置顶 |
| 3 | P1 | toast 进度条 CSS 动画与 JS 计时器分离，hover 暂停后进度条撒谎 | 改为 rAF 与计时器同源驱动，暂停即冻结 |
| 4 | P1 | 未读色条 `width:4px` 撑破 3px 网格列造成抖动 | 改透明度区分（已读 bar .35） |
| 5 | P1 | `.read-dot svg` 绝对定位无定位上下文，勾号会飞到条目角落 | `.read-dot` 加 `position:relative` |
| 6 | P1 | 对比度三处不达标：meta 灰字纸面 ~3.5:1、徽章白字 `#D9531E` 上 ~3.2:1、暗底次级文字不足 | `--fg-faint:#777162`(~4.6:1)、徽章底改 `--accent-ink`(~6.6:1)、暗底次级文字改 `--top-fg`(~5.9:1)、暗底强调文字用 `--accent-lt`(~5.2:1) |
| 7 | P1 | toast 关闭后 `toastItems` 合并池未清空 → 下次到达计数串数据 | `dismissToast` 中 arrival 类清空合并池；"查看"先取 id 再清池 |
| 8 | P1 | 全空态 `allEmpty` 无任何路径可达 | 演示栏加「清空列表」按钮 |
| 9 | P2 | reply 文案 "在 评论 · 「x」 回复了你" 不通顺 | 分类文案模板：`在「x」的评论中回复了你`；target 字段去冗余前缀 |
| 10 | P2 | 未读为 0 时组头 chip 显示"0" | `unreadCount.hidden = c===0` |
| 11 | P2 | Esc 只关到达 toast，撤销 toast 漏管 | Esc 统一 `toastRoot.querySelectorAll('.toast').forEach(dismiss)` |
| 12 | P2 | toast 类型到达时 aria-live 双重播报（toast 自身 + announcer） | toast 通道到达跳过独立 announce |

### 五轮结果

- **R1 视觉**：眯眼→面板为唯一亮块；类型色条 = 唯一 signature；装饰手法 1 种。✅
- **R2 内容**：10 条真实语义 mock（4 类型分布 3/3/2/2），相对时间、项目名、人名一致；空态文案无负面词。✅
- **R3 交互**：hover/active/focus-visible/disabled 全有；触屏未读点常驻；长短内容 clamp；reduced-motion 全降级（计时器不依赖动画）。✅
- **R4 工程/a11y**：语义标签 + aria-expanded/controls/haspopup、aria-live polite、焦点归还、无外部资源、transform/opacity 动画、无 CLS（面板绝对定位）。`node --check` JS 通过；标签/括号配平已机检。✅
- **R5 原创性**：遮 logo 可识别的约束组合（色条体系 + 点即按钮 + mono 元信息 + 打断分级语义化），非"蓝点+圆角卡"默认组合。✅

### 词条决策点核对（Z3 §二点五）

K14 四个适用词条的 15 个决策点 + K12×4 + K3×4（含 1 个 N/A）+ K18×5 均在代码中有对应实现（上文 Spec 均给出选择器/函数名）；不适用项已显式标注而非套用。

### 未验证项（诚实标注）

- 实际屏幕阅读器播报顺序（NVDA/VoiceOver 未跑，仅按 APG 结构推断）⬜
- 真实触屏设备上的 dot 常驻与无粘滞（媒体查询写法正确但无真机）⬜
- 对比度数值为手工估算（~值），未过 axe/Lighthouse ⬜

### 词条反哺线索（供 M2 参考）

- K14·Toast队列 的"hover 暂停计时"实现注只写了"pointerenter/focusin 清 timer"——本案实证发现还需**同步冻结进度条**（CSS 动画与 JS 计时分离会撒谎），建议实现注补一句"进度条须与计时同源（rAF/共享 deadline）"。置信：逻辑推理 ⚠️（单案例）。
- K14·徽标与未读 的"未读态三选一"未覆盖"指示器即操作控件"这种合并形态（未读点=标记按钮），本案采用且自洽，可作适用边界补充。置信：逻辑推理 ⚠️。
