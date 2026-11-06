# repair-report.md · 03-拖拽排序优化 修复报告

> 输入：`audit.md` 九维诊断。按 K10 修复 prompt 执行——**先逐项回答命中 K 词条的决策点（Decision/Reason/Spec 三行），再写代码，最后按词条验收字段自检**。
> 证据标记：✅ 代码可核对（附行号/参数）｜⬜ 需浏览器/真机复核（标"未验证"）。行号均指 `after.html`。

---

## 一、命中 K 词条的决策点答案（先答后写）

### K·Pointer事件（K7）— P0

- ① pointerType 分流
  - **Decision**：分流。触屏仅 `.handle` 可发起拖拽且阈值 10px；鼠标在"手柄+行体非文本区"可发起，阈值 6px。
  - **Reason**：触屏行体必须留给页面滚动（`pan-y`），否则列表与滚动抢手势；桌面行体大可拖、标题留给文本选择。
  - **Spec**：`pointerdown` 内 `e.pointerType==='touch' ? !onHandle : (onTitle && !onHandle)` 即 return（JS L226-232）；阈值 `drag.touch ? 10 : 6`（L241）。
- ② pointer capture 时机
  - **Decision**：pointerdown 即 `setPointerCapture`（不是过阈值才捕）。
  - **Reason**：K7 标准骨架为 `pointerdown → capture → move → up`；K4"过阈值才 capture"指进入拖动**态**的时序。早捕无害（click 仍正常派发），且免疫 armed 阶段指针划出元素丢事件。
  - **Spec**：`el.setPointerCapture(e.pointerId)` 在 armed 时执行（L236）。
- ③ touch-action 声明
  - **Decision**：`.handle{ touch-action:none }`；`.item` 不声明（默认 pan-y，页面可滚）。
  - **Reason**：手柄=显式拖区，禁默认手势防滚动抢事件；行体保持滚动通道，是"触屏仅手柄拖"成立的另一半。
  - **Spec**：CSS `.handle{ touch-action:none; -webkit-touch-callout:none }`（L66-70 区域）。
- ④ cancel 收尾
  - **Decision**：`pointercancel` 一律按**无效放下**走 `settle(true)` 回滚；Esc 同路径。
  - **Reason**：系统抢事件≠用户松手，按成功提交会落错位置。
  - **Spec**：`onCancelEvt → cancelDrag → settle(true)`（L337-347）。

### K·拖动占位（K4）— P0

- ① 原位处理
  - **Decision**：不塌陷也不另造 ghost——被拖元素**留在 DOM 原位**、用 transform 视觉拎起，其他项让位腾出目标槽。
  - **Reason**：before 的 `display:none` 是塌陷根因；留 DOM 位使"原槽=可回退槽"天然存在，取消路径零成本。比插 placeholder 节点少一次 DOM 增删。
  - **Spec**：`.dragging{ transition:none; position:relative; z-index:10 }`，全程不 insertBefore，直到 `pointerup` 才落定（`settle()`）。
- ② 插入指示
  - **Decision**：2px 指示线（强调色，带左端圆点）+ 其他项让位动画，排序场景选型。
  - **Reason**：词条域二选一："排序用 2px 指示线+让位 / 区块用主色 10% 底+dashed"——单列排序取前者。
  - **Spec**：`.insert-line`（CSS 块）+ `placeLine()` 按目标边界 Y 定位；无效区 `line.style.display='none'`。
- ③ 尺寸同步
  - **Decision**：让位距离 = 被拖元素 `height + gap`（槽高 `slotH`），占位与实元素同尺寸。
  - **Reason**：占位尺寸≠实元素会导致落位跳动（词条症状原话）。
  - **Spec**：`drag.slotH = itemH + gap`，`reflowOthers()` 位移量 `(target-natural)*slotH`。
- ④ 让位动画
  - **Decision**：200ms `cubic-bezier(.2,.8,.2,1)` ease-out；reduced-motion 下瞬移。
  - **Reason**：词条域"spring 或 200ms ease-out，禁瞬移"；6 项小列表 spring 收益低，选 CSS 时长。
  - **Spec**：`.item{ transition: transform .2s var(--ease-out) }`；`@media (prefers-reduced-motion:reduce)` 关 transition、JS `REDUCED` 跳过 WAAPI。

### K·拖放目标判定（K1）— P0

- ① 判定算法
  - **Decision**：pointer-inside + 上下半区——指针越过某 item 中线即判插入其下。
  - **Reason**：词条建议"小目标用 pointer-inside"；排序场景指针跟手，中线分界直接给"前插/后插"两个半区，消灭恒前插。
  - **Spec**：`p = count(others.cy < e.clientY)`（onMove 内）。
- ② 目标分级
  - **Decision**：平级单层，无嵌套目标——不适用（症状不存在）。
  - **Reason**：单列无组结构。
  - **Spec**：—
- ③ 目标反馈
  - **Decision**：2px 指示线 + 让位（见 K·拖动占位②）。
  - **Reason**：词条配方，且指示=真实落点而非"悬停高亮猜位置"。
  - **Spec**：`.insert-line` + `reflowOthers()`；指示与最终落点同一 `ins` 索引计算。
- ④ 无效目标
  - **Decision**：列表边界外扩 Y±48px / X±64px 之外=无效区，先验 `cursor:no-drop` + 指示线隐藏，松手→取消回滚。
  - **Reason**：排序无"第二类投放区"，无效=离列表太远；先验信号在松手前给。
  - **Spec**：`drag.valid` 判定 + `.drag-invalid *{cursor:no-drop!important}`。

### K·拖拽碰撞检测（K4）— P0

- ① 算法选型
  - **Decision**：pointer-inside（指针中线扫描）。
  - **Reason**：排序首选（词条原话）；6 项线性扫描成本忽略。
  - **Spec**：`while (p < others.length && others[p].cy < e.clientY) p++`。
- ② 滞后带
  - **Decision**：±4px。
  - **Reason**：词条域值，边界附近防抖。
  - **Spec**：`Math.abs(e.clientY - boundary) < 4 → 保持 drag.ins`。
- ③ 排除规则
  - **Decision**：候选集剔除被拖元素自身；列表外扩边界外=不可放区。
  - **Reason**：自身进候选会导致原位闪烁判定。
  - **Spec**：`others = items.filter(el => el !== drag.el)`；`drag.valid` 边界判定。
- ④ 性能
  - **Decision**：拖拽开始缓存候选 rects，scroll/滚动中失效重算（`recacheRects`）；6 项无每帧 layout 压力。
  - **Reason**：词条要求"拖动开始缓存、滚动失效"——自动滚动场景滚动是常态，必须重算；重算时减去让位 transform 得自然位。
  - **Spec**：`beginDrag()` 缓存 `{top,h,cy,cur}`；`onScroll → recacheRects()`。

### K·交互状态机（K7）— P1（支撑全部 P0）

- ① 状态枚举
  - **Decision**：`idle → armed → dragging → settling → idle` 五态（armed=阈值内按下态，覆盖词条六态中"按下抓取"）。
  - **Reason**：before 只有 `let dragEl`，无 armed/settling，点击与拖动无法区分、落定期无护栏。
  - **Spec**：`const S = {IDLE,ARMED,DRAGGING,SETTLING}` + 头部注释状态图。
- ② 转移条件
  - **Decision**：idle+pointerdown(命中拖区)→armed；armed+位移≥阈值→dragging；armed+up→idle（点击）；dragging+up→settling→commit；dragging/armed+Esc/cancel→settling(回滚)。
  - **Reason**：每个箭头一条事件+条件，写在转移处注释。
  - **Spec**：`onDown/onMove/onUp/onEsc/cancelDrag` 五处转移点。
- ③ 非法转移
  - **Decision**：非 idle 态的 pointerdown 吞掉；非发起 pointerId 的 move/up/cancel 吞掉（多指只认第一指）；contextmenu 在非 idle 态 preventDefault。
  - **Reason**：双指/系统菜单打断是僵尸拖动态的两个真实来源。
  - **Spec**：`state!==S.IDLE return`；`e.pointerId!==drag.pointerId return`；`contextmenu` 全局守卫。
- ④ 副作用归属
  - **Decision**：进入态统一挂/摘类名（armed/dragging/drag-active/drag-invalid），离开态统一 `cleanupPointer()` 摘监听。
  - **Reason**：before 的副作用散在 4 个 handler；现集中 `beginDrag/settle/cleanupPointer`。
  - **Spec**：类名切换只在 `beginDrag/settle` 出现；监听器只在 `cleanupPointer` 摘除。

### K·拖动阈值（K4）— P1

- ① 像素阈值
  - **Decision**：鼠标 6px（域 4-8），触屏 10px（域 8-12）。
  - **Reason**：指肚精度差取域中值；桌面取中段兼顾"不误触"与"无起步延迟"。
  - **Spec**：`const th = drag.touch ? 10 : 6`。
- ② 时间辅助
  - **Decision**：不启用长按拖动模式。
  - **Reason**：触屏拖拽已由显式手柄发起，长按语义无必要还会与文本选择/上下文菜单冲突；armed 阈值内松手=点击语义保留。
  - **Spec**：无 timer 路径；armed+up→idle 注释"=点击"。
- ③ 方向锁定
  - **Decision**：锁定垂直单轴——只写 translateY，水平分量丢弃。
  - **Reason**：单列排序只许单轴（词条域原话）。
  - **Spec**：`translate3d(0,${dy}px,0)`，dx 仅用于阈值距离计算。
- ④ 阈值前反馈
  - **Decision**：armed 态 `background` 提亮 + `scale(1.005)` 微反馈。
  - **Reason**：词条"被抓住"暗示；幅度取最小可感，克制基调。
  - **Spec**：`.item.armed{ background:var(--surface-2); transform:scale(1.005) }`。

### K·命中区域（K1）— P1

- ① 热区扩多大
  - **Decision**：手柄热区 44px 宽 × 整行高（满足触控 ≥44px）；行体其余非文本区为桌面扩展拖区。
  - **Reason**：词条域 iOS/Android 44px；行高 ≈56px 天然满足高度。
  - **Spec**：`.handle{ flex:0 0 44px; align-self:stretch }`。
- ② 外扩方式
  - **Decision**：padding 实体（handle 元素本身是热区），不用伪元素——热区需吃 `touch-action`/cursor 语义。
  - **Reason**：伪元素外扩不能承载 `touch-action:none` 的命中语义分离。
  - **Spec**：`.handle` 为真实 DOM。
- ③ 相邻竞争
  - **Decision**：热区划分=手柄区+行体非文本区可发起拖拽；`.title` 文本区只用于选中复制；触屏进一步收窄为仅手柄。
  - **Reason**：这是"选中 vs 拖拽互斥"症状的根治——同一区域不同时承担两个语义。
  - **Spec**：pointerdown 仲裁两行代码（onHandle/onTitle）；`.title{ user-select:text; cursor:text }`。
- ④ hover 判定区
  - **Decision**：hover 区=点击区（整行 hover 提亮是"可拖"暗示的一部分）。
  - **Reason**：无 tooltip 类"hover 区>点击区"场景。
  - **Spec**：`.item:hover` 整行反馈。

### K4 六态① 可拖暗示 — P1

- ① 表达组合
  - **Decision**：三件套——`cursor:grab`（行体）/`grabbing`（拖动中）+ 六点手柄图标 + armed 微反馈；拖动全程 `body.drag-active *{cursor:grabbing!important}` 接管。
  - **Reason**：速查表配方 `cursor:grab`+手柄图标；全局接管防拖到文本上变 I 型光标。
  - **Spec**：`.item{cursor:grab}`、`.handle`、`.drag-active` 规则。
- ② hover 态形态
  - **Decision**：整行底色提亮一档（surface→surface-2）+ 手柄图标变亮。
  - **Reason**："能拖"先于"拖中"；触屏无 hover 用 `@media(hover:hover)` 隔离不残留。
  - **Spec**：`@media (hover:hover){ .item:hover{...} }`。

### K·拖动预览（K4）— P1

- ① 预览形态
  - **Decision**：原元素本体（排序场景选型），不做克隆。
  - **Reason**：词条域"原元素（排序场景）"；克隆对本案例纯增复杂度。
  - **Spec**：`.dragging` 作用于元素本身。
- ② 抓取点
  - **Decision**：按下点=锚点，`translateY = clientY - startY` 天然保偏移，无跳变。
  - **Reason**：transform 是相对位移，"在哪抓从哪拎"自动成立。
  - **Spec**：onMove 中 transform 计算。
- ③ 拿起反馈
  - **Decision**：`scale(1.02)` + 阴影加深 + 强调色描边；不加 rotate。
  - **Reason**：B45 域 scale 1.02-1.05/rotate 1-3°；rotate 取 0——工具型列表克制基调，倾斜无信息增益。
  - **Spec**：`scale(1.02)` in transform；`box-shadow:0 12px 28px rgba(0,0,0,.45)`；`border-color:rgba(94,106,210,.5)`。
- ④ 层级
  - **Decision**：`z-index:10` + `position:relative`；预览不挡判定（判定走缓存 rects+指针坐标，不依赖元素命中）。
  - **Reason**：词条要求预览最上层且不干扰 drop 判定。
  - **Spec**：`.item.dragging{ position:relative; z-index:10 }`。

### K·跟手（K4）— P1

- ① 跟随律
  - **Decision**：1:1 线性跟随，无边界阻尼（列表内无"超界拖"手感需求，超界走无效区信号而非橡皮筋）。
  - **Reason**：词条默认律。
  - **Spec**：`translateY(dy)`。
- ② 禁用 transition
  - **Decision**：`.dragging{transition:none}`，松手经 `settle()` 恢复动画通道（WAAPI 落位）。
  - **Reason**：transition 与跟手互斥（词条原话）。
  - **Spec**：CSS 类 + JS settle 分工。
- ③ 更新通道
  - **Decision**：只写 `transform`（translate3d），全程不碰 top/left/height。
  - **Reason**：合成层属性白名单。
  - **Spec**：onMove/reflowOthers 仅赋 transform。
- ④ 多指/多源
  - **Decision**：Pointer Events 统一；跟踪 `drag.pointerId` 只认发起指针，第二指事件吞掉。
  - **Reason**：词条实现要求。
  - **Spec**：`e.pointerId!==drag.pointerId → return`。

### K·无效放下（K4）— P2

- ① 预判反馈
  - **Decision**：无效区（列表边界 Y±48/X±64 外）`cursor:no-drop` + 指示线隐藏；让位态冻结在最后有效判定。
  - **Reason**：词条"别等松手才说"。
  - **Spec**：`.drag-invalid` 类切换。
- ② 回位动画
  - **Decision**：WAAPI `translateY(curTop-backTop)→none`，280ms ease-out（≤400ms 域内）；不做 shake——排序回滚语义清晰，shake 是"做错了"的惩罚感，此处只是"没放"。
  - **Reason**：词条域"spring 弹回"；WAAPI cubic-bezier 近似 spring 收尾。
  - **Spec**：`settle(true)` 分支。
- ③ 状态回滚
  - **Decision**：取消=DOM 顺序不变（drag 全程未改 DOM，天然零回滚成本）+ 其他项让位 transform 经 transition 动画归零。
  - **Reason**：乐观改动只有让位 transform，回滚=清零并让它动画收回，不生硬。
  - **Spec**：cancelled 分支 `o.el.style.transform=''`（走 .2s transition）。
- ④ 取消通道
  - **Decision**：Esc（keydown capture，armed/dragging 全程有效）+ pointercancel + 触屏拖出边界松手，三路统一 `settle(true)`。
  - **Reason**：自实现 pointer 拖拽后原生 Esc 兜底不存在，必须显式补回（audit 提示）。
  - **Spec**：`onEsc`/`onCancelEvt`/`!drag.valid→settle(true)`。

### K·自动保存与多端冲突（K12）— P2

- ① 保存节奏
  - **Decision**：事件驱动即存——每次排序提交（drop/键盘移动）直接写 localStorage，无 debounce。
  - **Reason**：排序是离散低频事件不是流式输入，debounce 域（1-2s）不适用；即存无卡顿风险。
  - **Spec**：`persist()` 在 `settle` 成功分支与 keydown 移动后调用。
- ② 保存指示
  - **Decision**：副标题行内小字"已自动保存"，2s 淡出；失败显示"保存失败"。
  - **Reason**：三态取其二（saving 对同步 storage 无意义）；位置=页首信息区固定，不弹 toast。
  - **Spec**：`.save-hint` + `hintTimer`。
- ③ 冲突处理
  - **Decision**：乐观覆盖（后写胜），不做版本检测。
  - **Reason**：单机单页 demo 无多端写入者；适用边界判定=需要持久化（排序成果是用户操作产物，刷新丢失是真症状）但无冲突面。
  - **Spec**：单一 `localStorage.setItem`。
- ④ 退出保护
  - **Decision**：不需要 beforeunload——提交即存，脏状态窗口为零。
  - **Reason**：无 dirty 期可守。
  - **Spec**：—；`restore()` 加载时按 data-id 恢复顺序。

### K·视觉配额（K18）— P1（配合 B82 整改）

- ① signature 峰值数
  - **Decision**：0 个装饰峰值——本页是工具型任务页，唯一"主角"是列表本身。
  - **Reason**：配额是上限不是目标；强行造 hero 是反模式。
  - **Spec**：无 hero/插画/装饰元素。
- ② 强调色配额
  - **Decision**：#5e6ad2 全页出现 4 处（紧急 tag、焦点环、插入指示线、保存提示字），面积 <3%。
  - **Reason**：域 ≤5 次/<3%；每处都是功能语义非装饰。
  - **Spec**：grep `--accent` 用法可数。
- ③ 装饰手法种数
  - **Decision**：0 种——玻璃/噪点/网格线全不引入。
  - **Reason**：before 的玻璃三件套删除；配额 ≤2 取 0。
  - **Spec**：无 backdrop-filter/box-decoration 装饰。
- ④ 同屏动效并发
  - **Decision**：拖拽时为 1 组协调运动（被拖跟手+让位属同一动作）；静止态全页零动效。
  - **Reason**：域 ≤2 处。
  - **Spec**：无 ambient/loop 动画。
- ⑤ 纹理剂量
  - **Decision**：噪点 0、玻璃 0 层。
  - **Reason**：—
  - **Spec**：CSS 全文无 blur/noise。

### B82 视觉整改（非 K 词条，按 audit 三个待答点）— P1

- ① 字体选型
  - **Decision**：`Space Grotesk`（Google Fonts）→ `Avenir Next`/`PingFang SC`/`Microsoft YaHei` 兜底；非 Inter。
  - **Reason**：几何无衬线、有技术气质辨识度，与工具型产品气质匹配；CJK 回退系统字体保证离线可用。
  - **Spec**：`<link>` 引入 + font-family 栈。
- ② 配色说法
  - **Decision**：深底 #0e0f13 + 单一强调 #5e6ad2——"工程效率工具"气质映射（Linear 系靛蓝），非紫蓝渐变陈词。
  - **Reason**：单一强调色约束+页面主题（优先级排序=效率工具场景）。
  - **Spec**：`--bg/--surface/--accent` tokens。
- ③ 玻璃剂量
  - **Decision**：玻璃 0 层——`backdrop-filter` 全删。
  - **Reason**：配额 ⑤ 允许 ≤1 层，但深底+实色 surface 已够层级，玻璃是纯装饰成本。
  - **Spec**：`.item{background:var(--surface)}` 实色。

### 指针项（非 K 词条的待答决策点）

| 指针 | 决策点 | 答案 |
|---|---|---|
| →B76/C4（键盘等效） | ① 方案选型 ② 焦点协议 | ① 每项 `tabindex=0` + Alt+↑/↓ 移动（任务约束指定；6 项短列表不用 roving tabindex，Tab 逐个可达成本可接受）；② 移动后焦点留在原元素（同一 DOM 节点 insertBefore，焦点自然跟随），`:focus-visible` 2px 强调色环 |
| →B76（aria-live） | ① 文案格式 ② 级别 ③ 联动 | ① `「标题」已放到第 M 位，共 N 项`/`已上移至第 M 位`/`已是第一位`/`已取消，保持在第 N 位`；② polite（非紧急错误不用 assertive）；③ 指针拖放与键盘移动共用 `announce()` |
| →B15/B10（优先级区分） | ① 通道映射 ② 紧急破格 | ① 色阶+字重组合：紧急=accent tint+600 字重 / 本周=中性亮档 / 常规=中性默认 / 低优=降饱和弱化；② 允许——页面主题即优先级，紧急是唯一语义化强调色用例 |
| →B42/B72（间距尺度） | ① 尺度集合 ② token 化 | ① 4pt 集合 {4,8,12,16,24,32}，圆角两档 {8,12}；② `:root` CSS 变量 `--s1..s6/--r-sm/--r-md` 全站引用 |
| K10 维9 | ① viewport ② 移动验收口径 | ① `width=device-width, initial-scale=1`；② 480px 断点收紧 padding/字号；⬜ 真机扫宽未执行（见无法验证项） |

### 明确"不适用"的词条（症状不存在，不为展示而加）

K·惯性拖拽（无甩动场景）｜K·磁性吸附/对齐辅助线/几何约束（无画布吸附对象）｜K·停靠/边缘吸附（无面板停靠）｜K·语义色冲突（强调色为中性靛蓝，天然不冲突）｜K·破格（工具页秩序优先，词条"不适用"原话）｜K·输出视图（demo 无打印场景）｜K·撤销（排序本身可逆，再次拖动即撤销）｜K·悬停意图/延迟（无二级菜单）｜K·滚动穿透/锁定（无浮层）。

---

## 二、P0→P1→P2 修复报告

### P0-① 键盘/读屏 0 路径（→B76/C4）

- **问题**：无 tabindex/keydown/focus 样式/aria-live，键盘用户对"上移/下移"0 条可达路径。
- **改动**：每项 `tabindex=0`+`role=listitem`+`aria-roledescription="可排序条目"`+动态 `aria-label`（含位次/标题/优先级/操作提示）；`Alt+↑/↓` 移动（keydown 委托在 list）；`:focus-visible` 2px 环；`#live` polite 播报区，移动/落位/越界/取消四态文案；副标题补键盘操作提示。
- **验证**：✅ tabindex 与 keydown 处理器在代码（L180+ HTML 属性、L395-413）；✅ 边界播报"已是第一/最后一位"；⬜ SR 实际播报效果未验证（需 NVDA/VoiceOver）。

### P0-② 触屏拖拽整体失效（K·Pointer事件）

- **问题**：HTML5 DnD 移动端不派发，无 pointer/touch 代码。
- **改动**：全链路改 `pointerdown/move/up/cancel`+`setPointerCapture` 骨架；`.handle{touch-action:none}`；pointerType 分流（触屏仅手柄发起、阈值 10px）；pointercancel 按无效放下收尾。
- **验证**：✅ 骨架四事件齐备（L216-236 起）；✅ cancel 走 `settle(true)`；⬜ 触屏真机未验证（无设备）。

### P0-③ 投放链路崩坏（K·拖动占位+拖放目标判定+碰撞检测）

- **问题**：`display:none` 原位塌陷跟跑；零插入指示；恒 insertBefore 前插、末位不可达；间隙/尾部盲区。
- **改动**：被拖元素留 DOM 原位 transform 拎起（不塌陷）；2px 指示线+200ms ease-out 让位；pointer-inside 上下半区判定（`others[p].cy` 中线扫描），`p=others.length` 时 `insertBefore(el,null)` 末位可达；±4px 滞后带；候选剔除自身+rects 缓存/滚动重算；外扩边界内全区域可投（间隙归入相邻半区）。
- **验证**：✅ `reflowOthers/placeLine` 参数（slotH=itemH+gap、±4px、boundary 公式）；✅ 落点=指示同一 `ins` 索引；⬜ 判定手感与动画曲线未验证（需浏览器实拖）。

### P1-④ 视觉 AI 指纹三连（B82+K·视觉配额）

- **问题**：Inter + 紫蓝渐变 + 玻璃三件套。
- **改动**：Space Grotesk 栈、深底 #0e0f13+单一 #5e6ad2、玻璃删净；配额决策见上（峰值0/强调4处/装饰0种）。
- **验证**：✅ 全文无 Inter/linear-gradient/backdrop-filter；⬜ "遮 logo 辨识度"为主观验收。

### P1-⑤ 可拖示能为零+选中文本互斥（K4①+K·命中区域+K·拖动阈值）

- **改动**：六点手柄（44px 触区）+cursor grab+hover 提亮+armed scale(1.005)；`.title{user-select:text}` 文本区不发起拖拽；阈值 6/10px+垂直单轴锁。
- **验证**：✅ 热区仲裁两行条件在 pointerdown（L226-232）；⬜ "不误触"需实机点选测试。

### P1-⑥ 零过渡硬切（K·拖动占位④+→B58/B71）

- **改动**：让位 200ms、落位/弹回 240/280ms WAAPI、reduced-motion 全关。
- **验证**：✅ 参数在代码（.2s var(--ease-out)、duration 240/280、REDUCED 分支）；⬜ 60fps 未录屏。

### P1-⑦ 状态无建模+事件模型错误（K·交互状态机+K·Pointer事件）

- **改动**：五态枚举+转移表注释+非法事件显式吞掉+副作用集中。
- **验证**：✅ 状态图可画（S 常量+注释）；✅ 任意事件序列归约到转移表（第二 pointerdown/异 pointerId/contextmenu 三路已列）。

### P1-⑧ 读屏零反馈（→B76）

- 并入 P0-① 的 aria-live 实现，✅ 四态文案；⬜ SR 实测未验证。

### P1-⑨ 无 viewport meta（K10 维9）

- **改动**：`<meta name="viewport" content="width=device-width, initial-scale=1">` + 480px 断点。
- **验证**：✅ meta 在 L5；⬜ 移动宽度渲染未实机扫。

### P2-⑩ 无效放下无先验（K·无效放下）

- **改动**：no-drop 光标+线隐藏+三路取消统一 `settle(true)` 280ms 弹回+DOM 天然零回滚。
- **验证**：✅ 边界参数 Y48/X64、duration 280≤400ms；⬜ Esc 手感未实测。

### P2-⑪ 排序零持久化（K·自动保存）

- **改动**：localStorage 按 data-id 存顺序，提交即存+载入恢复+保存指示。
- **验证**：✅ `persist/restore` 双向；✅ 适用边界判定已写明（单页 demo 仍需——刷新丢成果是真症状，成本<10 行）。

### P2-⑫ 四档优先级零区分（→B15/B10）

- **改动**：tag 四档色阶+字重，仅"紧急"用强调色。
- **验证**：✅ `.tag-urgent/week/normal/low` 四档；⬜ 眯眼测试主观。

### P3-⑬ 间距散值（→B42/B72）

- **改动**：`--s1..s6` 4pt token + `--r-sm/md` 8/12 两档，全站引用。
- **验证**：✅ 散值 10/14/26 清除（gap 8、radius 12、rank 24 均在集合）。

### P3-⑭ 边缘不自动滚动（库缺口·自答决策）

- **改动**：视口边 64px 触发区，速度线性 0→14px/帧，rAF 循环仅在 DRAGGING 态跑；滚动时 `sy` 补偿+rects 重算，与判定不冲突（仲裁=滚动后按新 rects 重新判定）。
- **验证**：✅ 参数与循环在代码；⬜ 小屏溢出场景未实测。注：本项为 audit 标注的库缺口，按近似 K4 链路自答决策点实现，建议反哺 K4 增补"边缘自动滚动"决策点。

---

## 三、修复清单表

| # | 问题 | 词条 | 决策点答案（摘要） | 改动 | 验证 |
|---|---|---|---|---|---|
| 1 | 键盘/读屏 0 路径 | →B76/C4 | tabindex=0+Alt+↑/↓；焦点随节点；2px 环；polite 播报四态文案 | item 属性+keydown+`#live`+aria-label 动态更新 | ✅ 代码在案；⬜ SR 实测未验证 |
| 2 | 触屏拖拽死 | K·Pointer事件 | 触屏仅手柄+10px；down 即 capture；handle `touch-action:none`；cancel=无效放下 | pointer 骨架全替换 DnD | ✅ 四事件+分流；⬜ 真机未验证 |
| 3 | 原位塌陷跟跑 | K·拖动占位①③ | 留 DOM 原位 transform 拎起；slotH=itemH+gap | 删 display:none 模型 | ✅ 无 DOM 移动直到 up |
| 4 | 零插入指示 | K·拖动占位②④ | 2px 强调色线+让位 200ms ease-out | `.insert-line`+`placeLine`+transition | ✅ 参数在案；⬜ 视觉未验证 |
| 5 | 恒前插/末位不可达/盲区 | K·拖放目标判定①③④+K·碰撞检测①②③④ | pointer-inside 上下半区；±4px 滞后；剔除自身；rects 缓存滚动重算；边界外扩 Y48/X64 | `others[p].cy` 扫描+`insertBefore(el, others[p]\|\|null)` | ✅ p=n-1 可达末位；⬜ 手感未验证 |
| 6 | AI 指纹三连 | B82+K·视觉配额 | Space Grotesk 栈；深底+单 accent；玻璃 0 层；峰值0/装饰0/强调4处 | 全 CSS 重写 | ✅ 无 Inter/渐变/blur；⬜ 辨识度主观 |
| 7 | 可拖示能零 | K4①+K·命中区域 | grab 光标+六点手柄 44px+hover 提亮+armed scale(1.005) | `.handle`+cursor+armed 类 | ✅ 在案；⬜ 实机未验证 |
| 8 | 选中/拖拽互斥 | K·命中区域③+K·拖动阈值①④ | 标题区=user-select:text 不发起；行体非文本区可发起；阈值 6/10px | pointerdown 热区仲裁 | ✅ `.title` CSS+仲裁条件 |
| 9 | 状态硬切 0ms | K·拖动占位④+→B58/B71 | 让位 200ms/落位 240/弹回 280，easing (.2,.8,.2,1)；RM 全关 | transition+WAAPI settle | ✅ 参数在案；⬜ 帧率未验证 |
| 10 | 状态无建模 | K·交互状态机 | 五态 idle→armed→dragging→settling；非法事件吞掉；副作用集中 | S 枚举+转移+cleanup | ✅ 状态图可画 |
| 11 | 跟手/预览 | K·跟手+K·拖动预览 | 1:1 translateY 单轴；dragging 禁 transition；原元素 scale1.02+阴影，z-10 | `.dragging`+onMove transform | ✅ 仅写 transform |
| 12 | 无效放下无先验 | K·无效放下 | no-drop 预显+线隐藏；280ms 弹回；Esc/cancel/越界三路取消 | drag-invalid+settle(true) | ✅ ≤400ms；⬜ Esc 实测未验证 |
| 13 | 排序零持久化 | K·自动保存 | 需要持久化；提交即存；页首小字指示；无冲突面/无 dirty 期 | localStorage+persist/restore | ✅ 双向在案 |
| 14 | 优先级零区分 | →B15/B10 | 色阶+字重；紧急唯一破格用 accent | tag 四档类 | ✅ 四档在案 |
| 15 | 无 viewport/未验收 | K10 维9 | device-width+480 断点 | meta+media query | ✅ meta 在案；⬜ 扫宽未做 |
| 16 | 间距散值 | →B42/B72 | 4pt 集合 {4..32}；8/12 两档圆角；token 化 | :root 变量全引用 | ✅ 散值清除 |
| 17 | 边缘不滚（库缺口） | 无词条（近似 K4） | 边 64px/线性 max14px/滚动后重判 | autoScroll+scrollLoop+onScroll 补偿 | ⬜ 未实测 |

## 四、剩余风险

1. **触屏真机全链路未跑**——pointer 骨架、touch-action、44px 手柄均为代码级正确，但 iOS Safari 的 pointer 事件边界行为（滚动接管、long-press callout）需真机确认。
2. **SR 播报未实测**——aria-live polite 文案与 aria-label 动态更新符合规范写法，但各读屏器对 listitem aria-label 的支持差异需 NVDA/VoiceOver 走查。
3. **均匀槽高假设**——让位/落位按"被拖项高+gap"算 slotH，当前 6 项同高成立；若未来标题换行致高度不一，长距离拖动的指示线位置会有 ≤半档误差（不改数据逻辑前提下可接受）。
4. **持久化是单写者乐观覆盖**——data-id 若被外部改动，restore 静默回退默认序（可接受降级）。
5. **Google Fonts 外链**——离线环境回退 Avenir/苹方/雅黑，视觉仍成立但丢失辨识度项。

## 五、无法验证项清单（需浏览器/真机复核）

- ⬜ 拖拽跟手 60fps、让位/落位动画曲线观感（需录屏慢放）
- ⬜ 拖动阈值"点击 100% 不误触拖动"（K·拖动阈值验收原话，需实机点选测试）
- ⬜ pointer-inside 判定在边界 ±4px 内不抖（需实拖）
- ⬜ 触屏：手柄发起、页面滚动不抢事件、pointercancel 后状态干净（需 iOS/Android 真机）
- ⬜ Esc 取消、无效区 no-drop 先验的实际呈现（需浏览器）
- ⬜ aria-live 播报与动态 aria-label 在 NVDA/VoiceOver 下的实际朗读（需 SR 走查）
- ⬜ 移动宽度 320/375 渲染与 480px 断点效果（需扫宽）
- ⬜ "遮 logo 可辨识"原创性验收（主观，需人评）
