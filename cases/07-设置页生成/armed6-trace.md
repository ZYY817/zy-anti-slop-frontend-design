# armed6-trace.md — 墨迹设置页 · B87§十一 三新决策对象实装轮
页型：工具页（hero 禁令适用）；R 闸关。基座 armed5.html，armed5 治理资产（低彩度/≤2通道/权重阶梯/签名件/工程纵深）全部原样保留。

## ① hero 删除后首屏结构
`.peak` 整块（h1「设置」+引言）连 CSS 删除——首屏现在是：**sticky 顶栏（品牌+搜索设置框+保存态）→ 直接 01 通用区头 → 3 行卡 → 02 编辑器区头+排版卡顶**，首屏即操作区。取代 peak 的三处安置：页题→sr-only h1（a11y 名目不占视觉层）；「仅存本机/即时生效」承诺→nav-foot+保存态 chip；呼吸/安静→区头（编号+宋体区题+一行 `sec-desc` 安静注）。密度序列：顶栏 L3 → 区头安静层 → 卡行 L3–4（区间隔 sp7）→ 页脚 L4，页级 L1.5 峰不再存在（工具页呼吸峰=区头级）。

## ② 每区名目层数清单（≤2）
01 通用=**1**（区头；原卡头「语言与启动」并入安静注）·02 编辑器=**2**（区头+卡组头×3：排版/行为/实时预览）·03 外观=**2**（+主题/界面）·04 同步=**2**（+状态/已连接设备）·05 快捷键=**1**（区头，朱印=签名件非名目；「绑定后立即生效」并入安静注）·06 存储=**2**（+本地用量/危险区——危险区头=安全语义件）。页题 0 / EN 标注 0（6 处 `.en` 与侧栏 SETTINGS 全删）；行标签=内容层不计名目（沿用 case07 计数口径）。判定已逐项作答：卡组头与 EN「二取一」取卡头（多卡区删卡头更难认；单卡区连卡头都删——区头已够认）。

## ③ 死空间对策 + 首屏占比
选**对策① 全区滚动每区成卡**：6 区全部在流（hidden 移除），nav 点击=`scrollIntoView` 锚定+scrollspy 回写 active（导航=定向+进度扶手）；移动端 nav 变 sticky 横条钉在实测顶栏高（`--tbh`，ResizeObserver 回写）。行异构密度可控的证明：异构行（seg/select/switch/device/kbd/preview）被**关进各自卡容器**——密度由卡内 `row-min`/padding 控不由连续面控；台账败因正是异构行共享一条连续面。首屏（1280×800）：顶栏 56 下约 744px 装 01 全区+02 区头+排版卡前两行，有效内容 ≈**85–90%** ≥40% 判据。

## ④ 全页实色按钮清单（∈[0,3]）
**1 个**：`#dlgConfirm`「永久删除」danger-solid（弹窗内不可逆确认本身=唯一承诺时刻，勾选门槛保留）。accent 实色 0；行内 ghost（立即同步/导出/导入/恢复默认/取消/替换）；重复文字钮（重绑×6/移除×N）；危险入口 ghost 引确认。switch on 态/色板/同步条=功能状态面不计权重。

## ⑤ 状态通道抽查（3 态，项级≤2）
nav.active=**2**（accent-soft 底+strong 字；scrollspy 与点击同写此态）·seg 选中=**2**（thumb 底+字色）·listening-chip=**2**+脉冲（soft 底+strong 字+时间维单列）。旁证：hover 全 1（bg tint 或边框其一）、mark 1（藤黄底）、disabled 1（opacity .45）、设备确认 ask 1（danger 字）+ghost 钮；安全态豁免均≥2。

## ⑥ accent 彩度数值
玄青 `#3f4a56` S15.4%/极差23（默认）·松烟 13.7%/20·茶墨 13.2%/20·黛瓦 14.3%/24·藕灰 10.1%/18；strong×5 S11.4–16.8%；dark×5 S10.1–17.4%/17–29——全部 ≤S20% 判据。高彩度仅签名点朱印 `#b03a26` S64.5% ×3 <1%；绛=危险语境、藤黄=警示+mark，不进功能面。**零新 accent 实色**。

## ⑦ K16 闭环状态（改键→分发执行自检）
闭环通：捕获→mod 门槛+保留表（Ctrl+S 等）+IME 守卫→冲突替换链→`S.bindings`→persist→`renderKeys`（chip+搜索 hint 全量同步）→全局 keydown 分发器→`runAction` 六动作全部本页可达（search=聚焦/theme=换肤/sidebar=折叠持久化/sync=`goSec`+`doSync`/export=`doExport`/goto=`goSec('keys')`）→Toast 回执。本轮唯一接线变更：导航类动作由「单区过滤」改「滚动锚定」，分发表语义等价（goto 描述文案同步改「跳转到快捷键区」）。

## 顺手实修（非本轮判决项）
armed5 潜伏 bug：清空搜索后 `.search-hide` 行不复位（区只见命中行）→ `!q` 分支全量复位；`#keyList`/`#deviceList` 与尾随行补 `border-top` 分隔线；nav aria-label 原输出英文 SETTINGS→「设置分类」。

## 验证
`cases/verify.py armed6.html` **全过**（0 issue/warn）；抽取 JS `node --check` **OK**；Edge headless dump-dom 实证：6 快捷键行/3 设备行已渲染、i18n 已应用（statDocs=5）、`--tbh` 已回写、nav.active=1；截图 `armed6-1280.png`/`armed6-375.png`。**点击级行为（捕获/冲突/scrollspy 随滚/IME）待真机走查**——与前几轮同口径。
