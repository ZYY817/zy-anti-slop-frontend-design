# S1 · WPF 桌面软件视觉设计系统

> 桌面软件（Windows/WPF 为主）视觉设计速查：与 Web 的差异、WPF 视觉架构、Fluent 现代化、材料/密度/动效、桌面特有细节、明暗主题与高 DPI。
> 适用：WPF/.NET 桌面应用；WinUI 3、Avalonia、跨平台桌面另见 S 板块后续文件（待写）。
> 视觉原理部分（配色/字体/层级/反 AI 味）全部复用本库 B/A 板块，本文件只补"桌面特有"的差异面。

---

## 一、桌面 vs Web：必须先知道的差异

| 维度 | Web | 桌面（WPF 等） | 设计影响 |
|---|---|---|---|
| 视口 | 固定视口，移动优先 | **窗口可任意缩放**（含高 DPI 变化） | 布局必须无级自适应，不能用"断点思维" |
| 输入 | 鼠标/触控/触摸板 | **键盘是主输入**（企业用户） | 全功能键控：Tab 顺序、快捷键、方向键导航 |
| 密度 | 移动端偏疏松 | 桌面信息密度高（DataGrid/属性面板） | 紧凑行高 28-32px；提供密度切换（紧凑/常规/舒适） |
| 寿命 | 页面秒级 | **窗口/文档小时级驻留** | 长期使用不疲劳：低对比闪烁、稳定布局、记忆状态 |
| 系统集成 | 浏览器沙箱 | 托盘/任务栏/通知/对话框/拖放/剪贴板 | 视觉上要"接得住"系统 chrome |
| 字体渲染 | 子像素渲染（web 优化） | ClearType/系统字体（Segoe UI Variable） | 桌面优先用系统字体栈，不加载 web 字体 |
| 分辨率 | 高 DPI 由浏览器处理 | **Per-Monitor DPI v2**（96 基准缩放） | 用 DIP（设备无关像素），禁死像素 |

---

## 二、WPF 视觉架构（改外观的三层入口）

| 层 | 是什么 | 改视觉的用法 |
|---|---|---|
| ResourceDictionary | 资源字典（颜色/画刷/样式/模板集中地） | `MergedDictionaries` 合并主题字典；资源命名见下 |
| Implicit Style（隐式样式） | `<Style TargetType="Button">` 无 Key = 全应用该控件 | 不给 Key 即全局套用；给 Key 只作用于引用处 |
| ControlTemplate | 控件"长什么样"的完全定义（视觉树） | 换肤最强手段；改 `Template` 保留 `Style` 触发行为 |
| Trigger/Setter | 状态驱动样式（Hover/Pressed/Disabled/Checked） | WPF 动效/交互感主要靠 Trigger + VisualState |
| 资源命名规范 | 官方 Fluent 用 `ControlBackgroundColor`/`ControlStrokeColorPrimary` 等 | 参考 Microsoft.WinUI 资源命名，别自造 |

> 反模式：把颜色写死在 XAML 控件属性里 → 主题切换失效。一切颜色/尺寸必须走资源。

---

## 三、.NET 9 起：WPF 官方 Fluent 主题（2025-11 随 .NET 9 发布）

- **现状**：.NET 9 起 WPF 内置 Fluent 主题，首次实现第一方 Windows 11 美学（无需第三方库）
- **集成方式**：`ThemeMode` 属性支持 Light/Dark/System；自动跟随系统强调色；明暗两套内置
- **局限**：仅控件级 Fluent 样式，**不含** Mica/Acrylic 穿透背景（那是 Windows.UI.Composition 层能力）
- 决策：新项目要 Windows 11 原生深度集成（Mica/毛玻璃/系统动画）→ WinUI 3；要最大生态/跨 .NET Framework → WPF + 官方 Fluent 或第三方库

### 第三方现代化库速查（WPF 场景）

| 库 | 风格 | 亮点 | 备注 |
|---|---|---|---|
| WPFUI（lepoco） | Fluent（Windows 11） | 77+ 控件、Mica/Acrylic/Tabbed 背景、导航服务、明暗+高对比、Fluent System Icons 字体映射 | MIT；推荐首选；Gallery 有 MS Store 版 |
| MahApps.Metro | Metro 风格 | 成熟稳定、主题切换 API 完善 | 偏旧观感 |
| HandyControl | 混合现代 | 中文社区活跃、控件丰富 | 风格偏自定义 |
| ModernWpf | Fluent 风格控件 | 高仿 WinUI 控件 | 维护放缓 |
| DevExpress WPF | 商业 Fluent 主题（CTP） | design token 架构、Mica、多密度模式、高对比、全局字体设置 | 付费；Blazor/WPF 共享外观 |
| XAML Islands | 官方桥接 | **WPF 内嵌 WinUI 3 控件**（NavigationView/InfoBar/Mica 背景） | Windows App SDK 1.6+ 生产稳定；渐进迁移首选 |

---

## 四、桌面设计语言四支柱（Fluent 2 映射到任何桌面框架）

| 支柱 | 规则 | WPF 落地 |
|---|---|---|
| 材料 Materials | Mica（桌面背景感知）/ Acrylic（浮层半透明）/ 分层以表达深度 | WPFUI 或 DWM 互操作；层级：页面=Mica，浮层/菜单=Acrylic |
| 圆角 | 固定半径体系（4/6/8px 档位），**全控件统一圆角** | 全局 CornerRadius 资源；反模式：圆角大小混用 |
| 密度 | 默认常规密度；企业工具提供紧凑模式 | RowHeight/ItemContainerStyle 走资源，允许全局切换 |
| 动效 | 隐式过渡（属性变化自动动画）、缓动一致、时长 150-300ms | WPF 动画或 Composition 动画；禁瞬变（无过渡跳变） |

---

## 五、桌面特有视觉细节清单（Web 库没有的）

- **窗口 chrome**：标题栏与内容区融合 or 分离；深色模式时标题栏颜色一致（DwmSetWindowAttribute）
- **托盘图标**：16x16 基准，明暗两套图标；工具提示文案
- **任务栏进度**：TaskbarItemInfo 进度条（下载/任务）
- **对话框/浮层**：Acrylic 背景 + 居中 + 可拖拽；与主窗口层级动画
- **右键菜单**：保留系统快捷菜单习惯（列表/网格行上下文）；快捷键提示显示
- **拖放**：拖拽预览（半透明跟随）、放置高亮
- **DataGrid/树**：斑马纹克制、列头排序指示、行选中态明显、冻结列分隔线
- **状态栏**：信息密度分级（常驻信息/操作反馈/错误）
- **滚动**：细滚动条默认，悬停加宽；列表虚拟化时滚动反馈
- **输入焦点**：焦点可见环（键盘用户）——与 Web 的 focus-visible 同理
- **错误提示**：就地 inline + 不打断（非模态优先），模态只用于不可恢复操作

---

## 六、明暗主题与高对比

- 双主题 = 两套颜色资源，**一套布局**（尺寸/间距共享）
- 用语义资源名（`ControlFillColor`/`TextFillColorPrimary`），不用字面色（#FFF）
- 强调色跟随系统（WinRT UISettings 读系统强调色，或 DWM 注册表）
- 高对比模式：检测 SystemParameters.HighContrast，切高对比资源集（WCAG 等价：对比 7:1 起）
- 切换时机：系统级跟随（默认）+ 应用内覆盖（三态：Light/Dark/System）
- 参考本库 B28 暗色设计完全系统（色阶/边框/阴影全部适用，替换色值来源为系统主题）

---

## 七、字体与图标

| 元素 | 选择 | 说明 |
|---|---|---|
| 界面字体 | Segoe UI Variable（Win11）/ Segoe UI（Win10） | 系统字体零加载；中文自动回退微软雅黑 |
| 数字/代码 | Cascadia Mono / Consolas | 数据密度场景 |
| 图标 | Fluent System Icons（Segoe Fluent Icons 字体） | 注意：**字体不能随库分发**（EULA），需自备字体文件；Win10 需手动打包 |
| 图标规范 | Regular/Filled 两套、16/20/24 三档网格、描边 1.5-2px | 勿混用图标风格 |

---

## 八、高 DPI 与缩放

- 全部尺寸用 DIP（WPF 默认），禁止按像素写死（除 1px 边框线）
- 项目声明 PerMonitorV2（app.manifest），多显示器混合缩放时界面清晰
- 图片：矢量优先（SVG/Path）；位图提供 1x/1.25x/1.5x/2x 或使用 ImageService
- 测试矩阵：100%/125%/150%/200% 缩放 + 不同主显示器

---

## 九、无障碍（桌面必做）

- 每个控件 `AutomationProperties.Name`（读屏名称）
- 完整键盘导航：Tab 顺序、方向键、快捷键、Esc 关闭、Enter 确认
- 焦点可见 + 焦点移到浮层时正确切换
- 对比度：正文 4.5:1，大字 3:1，图标 3:1
- 动效尊重系统"关闭动画"设置（SystemParameters.ClientAreaAnimation）

---

## 十、动效原则（桌面版）

- 时长：150ms（悬停/按下）～ 300ms（页面/窗口过渡）；大型过渡 500ms 封顶
- 缓动：出 ease-out，入 ease-in-out；禁止线性默认
- 隐式动画：属性变化给过渡（颜色/尺寸/位置），比 Web 更强调"状态连续"
- 页面导航：滑入/淡入二选一，全应用统一（Fluent 官方 4ms 内响应、120fps 组合）
- 重操作反馈：进度条/环形进度替代转圈（长时间任务），见 B14 边界情况

---

## 十一、与本库衔接

| 本库文件 | 怎么用 |
|---|---|
| B1 字体 / B2 色彩 / A1 原理 / B82 反 AI 味 | 视觉法则全部通用，直接迁移 |
| B28 暗色设计完全系统 | 桌面双主题配色复用 |
| B14 边界情况美学 | 加载/错误/空态通用 |
| B11 入场编排 / V10 滚动视觉 | 导航/页面过渡改写成 Composition 动画 |
| F6 素材版权 | 图标字体 EULA（Segoe Fluent Icons）注意点 |
| G 板块场景 prompt | 换成 XAML 资源/模板输出即可 |
| C8 隐私 | 桌面也有同意对话框/隐私策略（Win10+ 通知权限） |

---

## 十二、决策速查（2026 现状）

| 需求 | 选型 |
|---|---|
| Windows 11 深度原生体验（Mica/系统动画/商店分发） | WinUI 3（Windows App SDK） |
| 存量 WPF 大工程要现代化 | WPF + .NET 9 Fluent 主题 / WPFUI / XAML Islands 渐进 |
| 跨平台（Win/macOS/Linux） | Avalonia（Skia 渲染）；或 Electron/Tauri（Web 技术栈） |
| 企业数据密集工具（DataGrid/报表） | WPF + 商业控件（DevExpress/Telerik）生态最全 |
| 老系统兼容（Win7/8） | WPF（WinUI 3 不支持） |

---

## 参考资料（本轮搜索）

- Microsoft Learn：WPF .NET 9 What's new（2026-02）：Fluent 主题 + ThemeMode、硬件加速改进
- Microsoft Learn：WinUI 3 / Windows App SDK：Composition 渲染、Mica/Acrylic、XAML Islands 1.6+ 生产稳定
- Fluent 2 Design System（fluent2.microsoft.design）：设计语言官方定义
- lepoco/wpfui（GitHub，v4.2，MIT）：架构文档（77+ 控件、主题系统、Win32 互操作、图标映射）
- CTCO Blog "WinUI vs WPF in 2026"（2026-04）：框架对比表、XAML Islands 渐进迁移
- Avalonia "WinUI vs WPF vs UWP"（2025-05）：三框架优缺与迁移策略
- DevExpress WPF Roadmap v26.1（2026-02）：Fluent Theme CTP（token 架构/Mica/密度/高对比）
- Uno Platform "WPF Modernization in 2026"（2026-04）：现代化-in-place vs 迁移决策
- 博客园 wpfui 系列（2024-2026）：WPF 中使用 Fluent 主题、MergedDictionaries 用法