# armed7-trace.md — 墨迹设置页 · SKILL.md 换代后第 7 次回归
页型：工具页（hero 禁令适用）；R 闸关（视觉非主表达）。基座 armed6.html，本轮换代=换视觉组合避相同安全默认（玄青+朱印→沉香+缝线），功能资产全保留。

## ① Pass1 四项原文
**重要性排序（前 3）**：①定位目标设置——搜索框+分类导航（用户带"改某项"目的来）②操作当前区控件——行标签+控件本体 ③看见状态与后果——同步态/保存态/用量/危险提示。
**角色分配表**：搜索框→title·loud#1（主控件）；nav 当前态→label·loud#2（accent-soft 底=我在哪）；区题→headline（宋体，安静不 loud）；行标签/控件→body；描述/meta/kbd/统计→label（降明度不加字号）；状态面→body/label 弃 loud。**高注意=2**。
**token 方案**：`--paper #f3f2ec` 宣纸底 · `--surface #fbf9f4` 卡面（亮半档分层）· `--ink #262521` 墨 · `--ink-2 #5c594f`/`--ink-3 #6f6a5a` 次级/辅助 · `--line #ddd7c8` 发丝线 · `--accent #5a4d3e` 沉香默认板（功能面唯一彩）· `--danger #a23c2a` 绛（仅危险语境）· 藤黄仅警示+mark · `--stitch` 缝线墨灰。字体：Noto Serif SC=区题表达 / IBM Plex Sans+系统中黑=界面 / IBM Plex Mono=数据（kbd·计数·版本）。布局：左目录右纸面「线装书房」——顶栏操作带+六区卡片流+区头缝线为记。只本产品成立：**功能面彩色必须"磨进墨里"（S≤20%/极差≤30），高彩度只许危险/警示**。
**默认检查**：紫蓝渐变/bg-clip/近黑酸绿/紫粉mesh→零；Inter/Geist/逃难字体→Plex+宋体；eyebrow 眉题/pill badge/mono 氛围化→无（mono 只给真数据）；hero/三卡均权/bento/假编号（编号=6 区真序列）/logo 汤/点阵→无；SaaS 卡套/幽灵卡/圆角通胀/blur/图标染色块/Lucide 五件/emoji→无；fade-up 量产/尾挂→/spinner 唯一→无；左色条/四件套/mark 下划线→无；**cream+衬线+赤陶边缘命中→拆**：纸底暖+serif 区题=书房本体保留，但 accent S18.4% 是磨墨灰非 terracotta(S68%)，无 display serif 巨题非营销版式——三联默认不成立；emerald 备胎→无。

## ② K 词条决策点答案
**K16·快捷键**：①作用域=输入域→组件→页面→全局，输入聚焦仅放行修饰键 ②普通用户→一律修饰键组合，禁单字母 ③保留表 Ctrl+S/W/T/N/F5/Alt+F4 等拦截 ④可发现=快捷键区列表+搜索框 kbd hint ⑤⌘K 面板不做（命令<30 非专家）⑥闭环=捕获→校验→冲突替换链→persist→renderKeys 同步全显示面→全局 keydown 分发→runAction 六动作真执行→toast 回执。
**K16·搜索触发链**：①中文 1 字即过滤+120ms 防抖（本地无请求）②IME 组合期挂起 compositionend 重启 ③本地过滤无异步竞态 ④`<mark>` 子串高亮（藤黄底无下划线）+导航命中计数走 mono 外围通道。
**K16·筛选**：单条件即时过滤；无结果=空态三件（「没有匹配的分类」+建议 chip×3 可点跳区+toast）；清空=全量复位。
**K11**：IME isComposing 守卫搜索/捕获/全局分发；Esc=取消捕获/清搜索，Enter=跳首个 mark；预览粘贴剥格式纯文本。
**K12**：清空=不可逆→原生 dialog+勾选门槛+danger-solid；设备移除=行内两步确认+toast 撤销（可逆不打断）；同步/导出 aria-busy 防重。
**K19**：排序→角色表→配额 2→层级差=明度+字重 2 变量→弱化次级（ink-2/3 降明度）→squint+3s 验证见③。
**K18**：峰值=缝线 motif 唯一装饰；accent 功能面+面积<3%；项级状态≤2 通道；实色全页=1；密度序列顶栏 L3→区头安静→卡行 L3-4→页脚 L4；色相岗=沉香功能/绛危险/藤黄警示mark/灰阶其余；动效 productive 150ms 单轨无 expressive。
**K20**：字号阶{10.5,11,12,13-15,21}同族；间距 4/8/12/16/24/32/44；desc ≤62ch；数字 mono+tabular-nums。
**B87**：名目层 ≤2/区（单卡区 1 层）；对策①全区滚动+scrollspy；导航岗=定向+进度扶手。**B88**：行描述均含后果/去向；CTA=动词+名词（导出 .zip/立即同步/永久删除）；空态/错误两句式齐。

## ③ 验收清单逐项
3 秒测试=搜索框为主控件可指认 ✓；squint=重块集中顶栏+导航列、内容区安静（blur6 缩略图代理实测）✓；高注意=搜索框+nav.active=2 ✓；病名命中=0（cream+serif+赤陶边缘已拆注）✓；四态=default/hover/loading(sync busy+save saving)/empty(navEmpty+suggest)/error(keyerr+conflict-bar)+reduced-motion ✓；390px 无横滚（实测 scrollW489<innerW504，nav 横滑为设计）✓；对比度：ink/paper 13.7、ink-3/surface 5.1、accent-ink/on-accent 7.8、danger 两对 6.2 ✓；无 lorem/死链（verify 全过）✓；K 词条决策点全答见② ✓。

## ④ 全页实色按钮清单（∈[0,3]）
**1 个**：`#dlgConfirm`「永久删除」danger-solid——弹窗内不可逆确认本身=唯一承诺时刻，勾选门槛保留。accent 实色=0；立即同步/导出/导入/取消/替换=ghost；重绑×6/移除×N=文字钮；危险入口 ghost 引确认。

## ⑤ 状态通道抽查（3 态，项级≤2）
nav.active=**2**（accent-soft 底+strong 字）·seg 选中=**2**（thumb 底+字色）·listening-chip=**2**+脉冲（soft 底+strong 字+时间维单列）。旁证：hover 全 1、mark 1（藤黄底）、disabled 1（opacity）、switch on=2（accent 面+thumb 位移）；安全态豁免均≥2（danger 字+ghost 边/keyerr 色+文/conflict 底+文）。

## ⑥ accent 彩度
沉香 `#5a4d3e` S18.4%/rg28（默认）·黛蓝 14.6%/24·松墨 7.0%/11·缟灰 4.3%/7·绛砂 13.6%/22；深色板 S6.1–17.9%/rg10–29——全部 ≤S20% 判据，十开关不吵。**零新 accent 实色**；缝线=中性墨灰零彩度不占配额。

## ⑦ 修复后复检记录
·ink-3 `#837e6e`→`#6f6a5a`（对比 3.6→4.82 复检过 AA）·缝线 token 由实色`#b6ac93`(rg35)→`rgba(111,106,90,.55)`（复用 ink-3 色系随主题自适应，复检深浅两版均在墨灰域）·`armed7.html` verify.py **全过**·抽取 JS `node --check` **OK**·Edge headless dump-dom 实证：8 缝线/6 键行/3 设备/statDocs=5/--tbh 已回写/nav.active=1·截图 `armed7-1280.png`/`armed7-375.png` 已产出并做像素+squint 代理自审（无法人眼终审，如实标注）·点击级捕获/冲突/IME 待真机走查（同前轮口径）。
