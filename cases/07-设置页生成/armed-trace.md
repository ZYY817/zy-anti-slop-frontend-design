# armed-trace · 07 设置页生成（墨迹 Inkwell）

## 实际读的文档（12 项，含 5 个 K 词条按 1/3 配额计）
00-总索引 → Z2（检索协议） → Z1、B87、K16、K12、K7、K18、K11、B62、B75、B76、Z3、K10。
R 闸门：工具页视觉非主表达 → 不开 R，走 Z1 轻量方向卡。

## 结构卡（B87）
页型=工具页（即用即走，功能前置）；叙事=分区归类+搜索捷径，非论证链；区块报岗：顶栏=定向+捷径 / 导航=扶手 / 通用=排疑前置 / 编辑器·外观·快捷键=深化 / 同步=信任 / 存储=收口+危险后置；承诺阶梯改写为风险阶梯（设置零成本→同步/导出中成本→清空高成本）；show-tell：每行=标签(tell)+真控件(show)，编辑器预览面板=证据件；移动端重组=导航岗不变、形态重排为顶部横滑。

## 方向卡（Z1§0）
气质=书房/克制/可靠；配色=纸墨系（宣纸 #F6F2E9+暖黑墨 #26221A+全暖灰），5 款色板浅深双校；材质=哑光纸面、细分隔线分组（禁卡片海/玻璃/渐变）；密度=基准 L3→L4（行 52px），呼吸峰唯一=顶部"设置"安静区（无卡片）；反面=圆角卡片海/紫蓝渐变/emoji 导航/均匀中密/假控件；人性维度=照管感（"2 分钟前已与 iPhone 同步"）。签名母题=方形朱印×3（顶栏/呼吸峰/页脚）。色相分工：绿=动作 绛=危险专司 朱=印章 藤黄=警告。字体三阶：宋=表达 Sans=界面 mono=数据。

## K 词条决策点逐项答案
- K·快捷键体系：①输入域/捕获态挂起全局键，仅修饰组合放行；②一律修饰键（Shift 单独不算、F 键例外、Tab 拒绝）；③保留键表=浏览器/OS 不可拦截键，拒绝+行内报错；④设置页即速查表+「/」聚焦搜索；⑤<30 命令不做 ⌘K。
- K·搜索触发链：①本地过滤即时，最少 1 字；②compositionstart/end 守卫+上屏补发；③本地无竞态；④<mark> 高亮+大小写归一；无结果→建议词 chips+清空+Enter 跳首命中。
- K·撤销与破坏：清空=不可逆→原生 <dialog>+勾选门槛+后果文案（篇数/MB）；可逆改动即时生效+toast 不打断。
- K·自动保存：onChange 即存 localStorage+顶栏三态（saving 280ms→saved+时刻）；无长文不需 beforeunload。
- K·状态机：快捷键 idle→listening→bound|conflict|keyerr，clearKbdStates() 统一收尾；sync 防重 disable。
- K·异步链：同步中按钮 disable+aria-busy；导入/导出/诊断走真实 Blob 路径。K·IME：搜索与捕获均 isComposing 守卫。
- K·视觉配额：峰值 1（呼吸峰朱印）；accent≤5；装饰 2 种（细分隔线+印章）；同屏动效≤2；零噪点零玻璃。
- K·密度节奏：序列=顶栏 L3→峰 L1.5→行区 L4；收紧区 mono 12-13px 台账。K·职责分工：色相/字阶两表见方向卡，母题 3 现。
- K·动效双轨：productive=150ms/≤4px/无回弹；expressive 仅入场 stagger 一次；性格=干脆；reduced-motion 全 instant。

## Z3/K10 审计实修（P0/P1）
1. `--ink-2:#a2978а` 西里尔字符→改 `#a2978a`（P0 渲染错值）
2. bindSeg 初始化触发 onChange→加载误弹 toast（P1）→set(v,fire) 分离
3. 主题未应用存储偏好→刷新丢皮（P1）→补 applyThemeMode() 初始调用
4. 冲突确认键盘不可达（P0 键盘群全灭）→conflict 退出 capture+focus 替换钮+Esc 清理
5. Shift+单字母误判合法绑定（打字误触）（P1）→strong=Ctrl/Alt/⌘ 判定
6. 保留键表含编辑键/Ctrl+N 与出厂绑定矛盾（P1）→重写只留不可拦截键
7. markEl 未转义 innerHTML 注入面（P1）→esc()；origHTML 改懒注册+applyLang clear 防旧语言回填
8. 搜索未覆盖设备/快捷键/统计/危险区行（P1 功能缺口）→统一 `[data-kw]` 候选+全量补挂
9. 触屏目标 <44px（P1）→pointer:coarse 放大 switch/swatch/seg/nav
10. keyerr 后焦点丢失（P1）→focus 归还 rebind 钮；clearKbdStates 统一状态收尾；radiogroup 方向键；mobile scroll-padding 126px；webkit 搜索原生×去重；e2e 联动 syncSub；hint 渲染器统一

## 验证
- verify.py：全部通过（reduced-motion ✓，无死链/缺资源/占位）
- node `new Function` 语法校验 OK；id 无重复、`$('#id')` 引用全命中、data-i18n/T() 键双语全齐（脚本自查输出）
- http.server 起服 200；浏览器预览已开（用户端可验）
- ⬜ 未验证：无 jsdom/puppeteer，真机点击/IME/捕获实测未跑；剩余 P3：mark 只标每元素首命中子串
