# judge-report.md · 通知中心生成 盲审对照

> 口径：docs/K10-界面审计九维框架.md 九维；证据分级：✅=代码审查可定，⬜=需浏览器/真机复核。
> 对象：armA.html（802 行，浅色暖纸面工作台语境）/ armB.html（1015 行，墨底纸面组件演示语境）。
> 盲审：仅依据两文件本身与命中词条，不推断来源。

---

## 维度 1｜视觉设计（静止时的品质与辨识度）

**armA — 7/10**
- ✅ 配色有主张：暖纸底 `#f5f4ef` + 墨 `#211f1c` + 柿红 `#d8492b` + 玉绿 `#1f7a5c`（L10-21），非默认白底蓝。
- ✅ 工艺细节：`color-mix` 类型着色头像（L208）、角标白边 `border:2px solid #fff`（L103）、自定义 `::selection`（L37）、双层阴影 token（L22-23）。
- ⚠️ 字体为系统栈无性格（L33 全平台默认 sans），页面骨架（顶栏+3 统计卡+双栏卡）偏常规后台范式。
- 命中：B82（系统字体/常规后台骨架接近 AI 共同分母，配色扳回）、B44、B29（tabular-nums 正面）。

**armB — 8/10**
- ✅ 单强调色纪律：墨底 `#17140F` + 纸面 `#FBFAF7` + 柿橙 `#D9531E`（L13-31），明暗对比造就辨识度。
- ✅ 双字体系统：sans + `ui-monospace` 元信息（L33-34），类型色条 `--tc` 3px 左缘（L221-226），mono kicker/kbd/count 形成编辑感。
- ✅ 唯一装饰=一层 <7% 透明度暖光晕（L50-54），克制且有注记。
- ⚠️ sans 同样为系统栈；`.stage .lede` 用 `--fg-faint`（注释声明供纸面 ~4.6:1）却落在墨底上（L408），自违 token 语义。
- 命中：B82（mono+单强调=有效差异化）、B77、B64（光晕克制）、B29/B60（mono 数字工艺）。

**对比**：A 强在通知条目视觉信息更厚（头像角标、引用块、chips），整页暖调有产品感。B 强在 mono/sans 双字体+类型色条+墨纸反差的体系化艺术指导，辨识度更高。

## 维度 2｜信息设计（内容清晰与重点突出）

**armA — 8/10**
- ✅ 条目信息全：行为者/目标链接/引用块（`.n-quote` L227-233）/类型点/时间/chip 标签（"截止 明天 18:00""优先级 高" L567）。
- ✅ 未读胶囊计数 + "全部已读" ok 态（L678-679）；页脚"仅保留最近 30 天"（L471）是真实策略文案；问候语随未读数联动（L682-684）。
- ✅ 未读/已读分组+计数徽标（g-head L166-179）。
- 命中：C6（无 lorem、文案形态真实）、B62（密度匹配通知任务）、B26。

**armB — 7/10**
- ✅ 语义 mock 真实（四类 TYPE + target/excerpt，L577-607）；lede 明确写出打断分级策略（L543-544）；组内空态"未读都处理完了"（L505-508）与全空态插画+说明（L516-525）分层。
- ⚠️ `.n-line` 与 `.n-excerpt` 均 2 行截断（L246、L253），正文信息被裁掉，无 chips/截止等结构化字段。
- ⚠️ 页语境弱于 A：组件演示页而非完整工作台（属定位差异，扣分有限）。
- 命中：C6（真实文案）、B52（空态分层正面）、B62（截断换密度，取舍可辩但丢信息）。

**对比**：A 强在单条通知的信息完整度（引用全文+标签 chip+截止时间），信息优先级"未读组>已读组"表达也更足。B 强在文案语义精度（action 句式按类型生成）与空态分层；截断 2 行是明确丢分点。

## 维度 3｜空间设计（距离、层级、边界）

**armA — 6.5/10**
- ✅ 间距基本落在 4pt 系（12/14/16/24/26），面板喙与铃铛对位（`.panel::before` L130-135），未读底色块分组表达清晰。
- ⚠️ **toast 列与面板同角同高度碰撞**：toast `top:72px;right:22px;width:354px`（L290-291），面板 `top:calc(100%+14px);right:-10px;width:420px`（L119-120）→ 顶栏 60px 后面板顶约 74px，toast 恰好压在面板头部操作区上方，面板开着时新 toast 会盖住"全部已读"。
- ⚠️ `.p-body{max-height:472px}` 固定值（L161），不随视口钳制；`@media 860px`（L417-421）未处理面板 → 375px 宽度下 420px 面板左缘溢出约 45-55px，头像列被裁。
- ⚠️ 组头 `g-head` 不 sticky，滚过即丢分组语境。
- 命中：K·视觉咬合（喙正面；toast/面板堆叠碰撞=K·浮层堆叠症状）、K·双重边框（无双线，通过）、B66（分隔用留白克制）。

**armB — 8/10**
- ✅ `max-height:min(560px, calc(100vh - 96px))` 视口钳制（L147）；`overscroll-behavior:contain`（L184）；粘性组头 `.g-title{position:sticky}`（L196-202）；`is-scrollable` 底部渐隐暗示可滚（L187-190）。
- ✅ toast 顶部居中（L343-348），与右上角面板空间分离，永不打架；`@media 560px` 面板转 fixed 全宽（L437-441）。
- ✅ 类型色条贴面板左缘（grid 首列 3px，padding-left:0，L213-216）——"色条即分组刻度"的空间手法。
- ⚠️ 面板喙 `::before` 无圆角过渡处理（L159-165），与 A 同级。
- 命中：K·滚动穿透（contain 正面）、K·视觉咬合（喙+色条贴合正面）、B66、B42。

**对比**：A 强在面板内三层缩进节奏和条目间距本身没问题；但 toast 压面板、无视口钳制、移动端溢出是三个实在的空间事故。B 强在滚动治理、粘性组头、toast/面板分区和移动断点，空间工程完整。

## 维度 4｜交互设计（操作与响应）

**armA — 7/10**
- ✅ 主路径全：点条目/点悬停钮标已读（L712-729）、标为未读逆操作（`item-act` undo 图标 L647-648）、全部已读、清空已读、toast 点击定位（L772-778）、Esc/外点关闭（L746-747）、disabled+原因（L680-681）。
- ✅ hover 反馈 <100ms 量级（`.15s` 变色即给），`:focus-visible` 全局描边（L40）。
- ⚠️ `item-act` 靠 `:hover`/`:focus-visible` 才显形（L256）→ 触屏用户对标为未读要先点出 hover 再点钮，功能性 hover 独占。
- ⚠️ 死示能多处：`.viewall`、`.more`、`.lk` 全部 `<a>` 无 href 且无 handler（L470、L500、L562 等）；`.todo` 是 `<label>` 无 input 无 handler 却 `cursor:pointer`（L378、L525-528）；设置/搜索钮无响应。
- ⚠️ Esc 关闭不归还焦点（`closePanel` L740-744 无 focus 调用）；铃铛 `aria-label="通知中心"` 静态（L450），徽标数字在 aria-label 覆盖下对读屏不可见。
- 命中：B9（死示能症状）、B45（反馈及时正面）、D4（disabled 有原因正面）、K·触屏无hover（item-act 症状）、B76（焦点归还缺失、计数不可读）。

**armB — 8.5/10**
- ✅ read-dot"指示器=操作"合一：未读点本身就是标已读按钮，hover 放大现勾（L268-287）；`@media (hover:hover) and (pointer:fine)` 下才降不透明度（L289-292）→ 触屏不藏功能。
- ✅ Esc 先关 toast 再关面板且 `closePanel(true)` 焦点归还铃铛（L840-846、L822-829）；`pointerdown` 外点关闭排除铃铛（L835-838）；`aria-expanded/aria-controls/aria-label 动态含未读数`（L482-489、L720）。
- ✅ "全部已读"6 秒可撤销（L792-801）；toast"查看"→开面板+定位+`is-flash`（L924-932）；行整行可点（L696-699）。
- ⚠️ 无"标为未读"逆操作；read-dot 20×20px 触控目标偏小；`viewAll` 死链（L1005）。
- 命中：B76（焦点归还/动态 label 正面）、K·触屏无hover（正面）、K12·撤销（正面）、D4、B9（read-dot 示能合一正面；死链小症状）。

**对比**：A 强在给了"标为未读"逆操作和更完整的页面语境；但死示能密度高、触屏 hover 独占、焦点不归还是连环扣分。B 强在键盘/触屏/读屏三条路径都被显式设计过，交互闭环更完整。

## 维度 5｜动效设计（时间、曲线、节奏）

**armA — 7.5/10**
- ✅ 时长带内：面板 .22s/.3s（L127）、toast .55s 入/.28s 出（L300-304）、条目 stagger 26ms×i（L136-137）、徽标 pop 弹性曲线（L108-109）、铃铛摆动（L110-115）、`freshIn` 新到高亮（L198-203）——入场编排意识明确。
- ⚠️ `.n-item` transition 含 `max-height .32s, padding .32s, margin .32s`（L188-189）——离场收拢走 layout 属性，违反 transform/opacity 白名单。
- ⚠️ `prefers-reduced-motion` 只杀 animation/transition duration（L422-424），`.p-body{scroll-behavior:smooth}`（L161）与 `scrollIntoView({behavior:'smooth'})`（L777、L789）漏降级。
- ⚠️ 进出场基本对称（toast 入 .55 出 .28 略有非对称意识）。
- 命中：B11（stagger 编排正面）、B5、K·动画反转（部分不对称）、R9/K·渲染管线（layout 动画症状）、B71（reduced 漏 scroll-behavior）。

**armB — 8.5/10**
- ✅ 全白名单：面板 `.18s var(--ease-out)`（L154-156）、item-in .3s / item-out `.18s ease-in`（L295-303）=退场更快且换 ease-in，教科书式不对称；badge-pop 用 spring var（L131-134）；read-dot 勾显现用 `--ease-spring`（L278）。
- ✅ 进度条 rAF 与计时器同源，暂停=真停（L392 注释、L863-888）；reduced-motion 双管齐下：CSS 全杀 + `.t-prog{display:none}` + JS `reduced` 标志短路所有延时（L443-452、L643、L759、L778）。
- ✅ 空态三段 `e-in` 延迟编排（L322-328）。
- ⚠️ `setTimeout(done,170)` 对齐 `.18s` 动画（L300、L761）——写死 timeout 而非 animationend，接续信号不严谨。
- 命中：K·动画反转（正面）、K·动画接续（170ms 硬编码症状）、B71、B5、B11。

**对比**：A 强在编排热闹（stagger+freshIn+铃铛摆），动效"表演"更足。B 强在曲线语义干净（退场 ease-in 加速、spring 用在弹性点）、进度条不撒谎、reduced-motion 连 JS 计时一起降级。

## 维度 6｜行为细节（K 板块主战场）

**armA — 6/10**
- ✅ toast hover 暂停用 WAAPI `anim.pause()`，进度与计时天然同步（L763-771）；toast 点击→开面板→`scrollIntoView`+`.fresh` 高亮（L772-778）回看链路完整；批量离场 stagger 60ms（L709）。
- ⚠️ **全部已读无撤销**：`markAllBtn` 直接把 un 置 read，只闪一条 `done-strip`（L705-711）；**清空已读永久删除无任何确认/撤销**（L715-719）。
- ⚠️ toast 无队列治理：无同屏上限、无同类合并、无优先级（`showToast` 直接 append，L761）；所有类型一律 5.2s toast，无打断分级。
- ⚠️ `.p-body` 无 `overscroll-behavior` → 面板内滚到底穿透到页面（L161）。
- ⚠️ `render()` 整体重建 innerHTML（L670）→ 任何操作后列表 scrollTop 归零，滚动位置不锚定。
- ⚠️ 无读屏播报（无 announcer；徽标计数被 aria-label 覆盖不可见）；toast focusin 不暂停计时；Esc 不归还焦点。
- ⚠️ 徽标 `n>9?'9+'`（L676）——9+ 上限偏低，10-99 区间精度丢失。
- 命中：K12·撤销（两个破坏性/可逆操作都没接住——本文件最大缺口）、K14·Toast队列（无上限无合并无分级）、K14·打断层级（无分级）、K14·徽标与未读（9+ 偏离、读屏不可见）、K14·浮层堆叠（toast 压面板）、K6·滚动穿透、K·滚动锚定（重建丢位置）、K3·触屏无hover、B76、K·动画接续（`setTimeout(...,300)` vs CSS `.32s` 硬同步 L688）。

**armB — 9/10**
- ✅ 打断分级显式建模：`TOAST_TYPES` 仅 mention/assign 升级轻打断，reply/system 零打断仅徽标+播报，面板开着全部降级为列表内滑入（L583-584、L981-987）。
- ✅ Toast 治理：5s 合并窗口"等 N 条新通知"（L901-912）、hover/focus 暂停并冻结剩余时长（L885-886）、撤销 toast 6s（L945-963）、aria-live polite + 独立 announcer（L570-571、L743-746）。
- ✅ 徽标：99+ 封顶、is-zero 收起、动态 aria-label（L718-720）；未读态=色条实心/已读=色条 35%+头像降饱和（L229、L239）——单套未读标准。
- ✅ `overscroll-behavior:contain`（L184）；增量 DOM 移动 `moveToRead` 不重建列表（L751-762）→ 滚动位置天然保持；Esc 分层先 toast 后面板+焦点归还。
- ⚠️ Esc 一键同时关 toast 和面板，偏离"Esc 只作用栈顶"的严格语义；170ms 硬编码接续；无标为未读。
- 命中：K14·打断层级（正面实现）、K14·Toast队列（合并/暂停/分级正面；同屏≤3 靠合并隐式达成）、K14·徽标与未读（正面）、K12·撤销（正面）、K6·滚动穿透（正面）、K14·浮层堆叠（焦点栈正面，Esc 双关小偏差）、K5·中断状态一致性（`t._done` 守卫、timer/raf 清理正面）。

**对比**：A 强在 toast→条目定位回看和 WAAPI 暂停这两个点做得漂亮；但撤销、队列、分级、穿透、播报、焦点归还六项行为细节全部缺席。B 强在 K14 五个决策对象几乎逐项落地且有可读的实现注释，是本维度压倒性优势。

## 维度 7｜前端工程（实现质量）

**armA — 7/10**
- ✅ 事件委托在 `listEl`（L712）、数据驱动 `render()`、TYPE/ICONS 查表（L538-556）、`color-mix` 带 fallback（L208）、`aria-expanded` 同步（L735、L743）。
- ⚠️ 全量 `innerHTML` 重建：scrollTop 丢失、焦点丢失风险、代价高于必要；`collapse` 用 max-height 布局动画（L194-197、L688）。
- ⚠️ 事件体系 mouse 系（mouseenter/leave，L770-771），无 pointer 统一；多个游离 `setTimeout` 未追踪（L688、L703、L710、L718）——连续操作叠加时序靠运气，render 幂等兜底才不出错。
- ⚠️ 死代码：`--jade-soft` 引用未定义（L158）、`.ghost-btn:hover` 双 background 覆盖（L158）；`freshId` 与 `.fresh` 靠渲染时序隐式约定。
- 命中：K·事件委托（正面）、K·渲染管线（layout 动画症状）、K·中断状态一致性（timeout 失控风险）、D3（token 基本成系但有死引用）。

**armB — 8.5/10**
- ✅ `syncChrome()` 单一同步点管徽标/计数/空态/按钮/渐隐（L713-735）——状态派生视图，无平行副本；DOM 增量移动而非重建（`moveToRead` L751-762、`markAllRead` 保序 insertBefore L783-788）。
- ✅ pointer 事件统一（pointerdown/pointerenter/pointerleave，L835、L885-886）；`armTimer` 把 timeout+rAF 封装成可暂停实体（L864-888）；`reduced` JS 标志（L643）；`[hidden]` 强制样式（L40）；token 注释带对比度核算（L21-22、L25-26）。
- ⚠️ `setTimeout(done,170)` 与 CSS `.18s` 靠注释外约定同步（K·动画接续）；`is-entering` 类不摘除（依赖每次新建节点，可接受）；`aria-haspopup="true"` 应为 "dialog"（L483）。
- 命中：K·交互状态机（syncChrome 单源派生正面）、K·Pointer事件（正面）、K·渲染管线（白名单干净）、K·动画接续（硬同步小症状）、D3（token 纪律+对比度注释正面）。

**对比**：A 强在代码直白好读、模板渲染简单；但重建式渲染+游离 timer+mouse 系事件是三个工程债。B 强在状态同步单点化、增量 DOM、pointer 统一、可暂停计时器封装，工程质量明显更稳。

## 维度 8｜性能体验（流畅与鲁棒）

**armA — 6.5/10**
- ✅ 动画主体是 transform/opacity；列表规模小，全量重渲染代价可控。
- ⚠️ 离场动画跑 max-height/padding/margin → 每帧 layout（L188-197）；toast 无上限可无限堆叠（连点 demo 钮即证）；`.p-body` 固定 472px 无视口保护；render 重建后 fresh/stagger 类动画与计时器交错无收敛守卫。
- 命中：K·渲染管线（layout 动画）、K14·Toast队列（堆积）、K5·中断状态一致性（风险项）。

**armB — 8/10**
- ✅ 全 transform/opacity；toast 合并窗口天然抑制堆积；DOM 增量移动；`overscroll-behavior:contain` 防穿透链式滚动；`is-scrollable` 按需加 mask（L733-734）——mask 仅滚动容器需要时才挂。
- ⚠️ 每 toast 一条 rAF 循环（L872-874）规模可控但存在；mask-image 在滚动中重绘成本待实测 ⬜。
- 命中：K·渲染管线（正面）、K14·Toast队列（堆积被合并抑制正面）、F3（⬜ 待实测帧率）。

**对比**：A 强在实现简单、小数据量下不会卡；但离场 layout 动画+toast 不设防是实际掉帧/刷屏风险。B 强在渲染纪律和堆积抑制，性能面更接近可交付。

## 维度 9｜真实验收（是否亲眼验证的痕迹）

**armA — 6.5/10**
- ✅ 代码层面状态覆盖可见：空态插画（L615-623、L658-661）、disabled+title（L680-681）、unread/read/fresh/leaving/done-strip 多态、`:focus-visible`、`@media 860px`。
- ⚠️ 移动端面板溢出未被发现（无断点处理）→ 375/768 宽度验收缺位；触屏 item-act 不可见未被发现；reduced-motion 漏 scroll-behavior；读屏路径（计数、操作播报）无验证痕迹。
- 命中：D4（状态覆盖正面）、T2/B14（⬜ 尺寸扫查不全）。

**armB — 8/10**
- ✅ 多路验证痕迹：hover:none 媒体查询、560px 断点面板 fixed、reduced-motion CSS+JS 双路径、announcer+动态 aria-label、组空态+全空态+撤销+合并四类边界、`hidden` 兜底样式、lede/hints 把预期行为写成可验收清单（L561-566）。
- ⚠️ `.lede` 对比度自违（L408）说明暗色区文字扫描有漏；⬜ 动画曲线/中断帧率仍需录屏复核。
- 命中：D4/B14（边界态分层正面）、B76、C4（播报链正面）、T2。

**对比**：A 强在页面语境完整（导航/统计/待办俱全），像一次产品级验收面。B 强在尺寸/指针/动效偏好/读屏四条验收路径都有代码级证据，边界态覆盖更系统。

---

## P0 计数

- **armA：0 个 P0。** 主路径（看未读→点开→标已读→批量已读→关面板）在桌面键鼠/键盘下均可达成；移动端面板左缘裁切、触屏 hover 独占、读屏计数丢失均为降级而非全灭 → P1 簇。
- **armB：0 个 P0。** 无标为未读、read-dot 触控目标偏小、lede 对比度不足、viewAll 死链均为 P2-P3。

## 总分表

| 维度 | armA | armB | 差距归属 |
|---|---|---|---|
| 1 视觉设计 | 7 | 8 | B 体系化艺术指导 |
| 2 信息设计 | 8 | 7 | A 条目信息更完整 |
| 3 空间设计 | 6.5 | 8 | A toast 压面板/无视口钳制/移动溢出 |
| 4 交互设计 | 7 | 8.5 | B 焦点归还/触屏/读屏三路闭环 |
| 5 动效设计 | 7.5 | 8.5 | A layout 动画+reduced 漏项 |
| 6 行为细节 | 6 | 9 | A 撤销/队列/分级/穿透/播报全缺 |
| 7 前端工程 | 7 | 8.5 | B 单源同步+增量 DOM+pointer |
| 8 性能体验 | 6.5 | 8 | A layout 动画+toast 不设防 |
| 9 真实验收 | 6.5 | 8 | B 多路验收痕迹 |
| **合计** | **62/90** | **73.5/90** | |

## 总结论

**armB 更好（73.5 vs 62），赢在行为细节、交互、工程三个"动手维度"。**

- **armB 赢在哪**：第 6 维行为细节拉开最大分差（9 vs 6）——打断分级（TOAST_TYPES）、toast 合并窗、6s 撤销、overscroll contain、焦点归还、announcer 播报，K14/K12/K6 词条几乎全部落地；第 4 维键盘/触屏/读屏三路闭环（read-dot 指示器=操作合一、Esc 归还焦点、动态 aria-label）；第 7 维 syncChrome 单源派生+增量 DOM+pointer 事件。
- **armA 赢在哪**：仅第 2 维信息设计（8 vs 7）——单条通知信息更厚（引用块全文、截止/优先级 chip、"仅保留最近 30 天"策略文案），页面语境也更像真产品；视觉的暖纸面配色与 B 各有千秋。
- **armA 丢分集中在**：全部已读无撤销+清空已读无确认（K12）、toast 无队列/无分级且与面板空间碰撞（K14）、滚动穿透+重建丢位置（K6）、触屏 hover 独占（K3）、reduced-motion 漏 scroll-behavior、死示能密度（`.viewall`/`.lk`/`.todo` 无 href 无 handler）。
- **armB 丢分集中在**：无标为未读逆操作、excerpt 2 行截断丢信息、`.lede` 暗面对比度自违 token 注释、Esc 一键关两层（偏离栈顶语义）、`setTimeout(170)` 硬同步动画、viewAll 死链。
- **库缺口（反哺）**：①"toast→面板→条目定位+高亮"的回看链路两臂都做了但库内无对应词条；②B 的"未读指示器即操作按钮"（indicator=action 合一）是 K14·徽标与未读未覆盖的模式。
