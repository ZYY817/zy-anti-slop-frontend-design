# G6 · AI 原生界面场景 Prompt 库

> B50 讲的是 AI 界面的**视觉节点与规格**（输入区/等待态/流式/引用/代码块等）。
> 本文件是**场景级 prompt 模板**——针对 6 种最常见 AI 产品形态，给出可直接喂给 AI 的完整 prompt。
> 结合 2026 年最新模式：streaming + thinking UI、phase-based indicators、mid-stream tool calls、generative UI。

---

## 一、AI 对话助手（ChatGPT / Claude 型）

```
【产品类型】AI 对话助手
【整体风格】{暗色极简 / 浅色温暖 / 中性专业}
【技术栈】React + Tailwind + shadcn/ui

【输入区 Composer】
- 底部固定，圆角 16px，高度自适应（field-sizing: content，最高 6 行）
- 左：附件按钮（@ 提及 / 图片 / 文件），右：发送按钮（idle 时灰色，有内容时品牌色）
- 上方：建议 prompts 横向芯片，首次对话可见，发消息后收起
- 输入框 placeholder: "Ask anything..." 淡灰
- 移动端：发送按钮 48×48，附件区折叠

【等待态 Thinking】
- Phase-based：依次显示 "Thinking..." → "Searching {n} sources..." → "Writing answer..."
- 每个 phase 左侧有小图标（脑/搜索/笔），文字淡入切换
- 动效：三点脉冲 shimmer 或品牌色渐变流光，不用旋转 spinner
- aria-busy="true" 包裹等待区域

【流式输出 Streaming】
- Token-by-token，末尾闪烁光标（2px 竖线，品牌色，ease-in-out 0.5s 闪烁）
- Markdown 实时渲染：标题/列表/加粗即刻可见
- 代码块：等待闭合 ``` 后整块渲染，带语言标签 + 复制按钮
- 输出中显示 "Stop generating" 按钮（右下角悬浮）
- 布局稳定：输出区不回流，新内容追加在底部

【消息气泡】
- 用户消息：右对齐，品牌色浅底，圆角 16px（右上 4px 尖角）
- AI 消息：左对齐，无背景或极浅灰底，最大宽度 720px
- 间距：消息间 16px，同角色连续消息间 8px
- 时间戳：hover 才显示，减少噪音

【引用 Citations】
- 内联数字角标 [1][2][3]，hover 展开引用卡片（标题 + URL + 摘要预览）
- 引用卡片：小阴影，250px 宽，3 行摘要

【反馈区】
- 每条 AI 回复下方：👍👎 + 复制 + 重新生成
- 👎 展开分类（不准确/不相关/有害/其他）+ 可选文字补充

【多轮上下文】
- 对话标题自动生成（首轮后），左侧历史面板可搜索
- 新对话按钮明显（顶部左侧 +）

【无障碍】
- 流式区域 aria-busy="true"，完成后用 aria-live="polite" 播报全文
- 所有按钮有 aria-label，引用角标有 title
- 键盘 Enter 发送，Shift+Enter 换行

【性能】
- 虚拟滚动长对话（>50 条消息用 virtualization）
- 流式用 ReadableStream + 增量 DOM 追加
- 图片 lazy loading，代码块按需高亮
```

---

## 二、AI Agent / 多步骤工具调用（Cursor / Devin 型）

```
【产品类型】AI Agent（多步骤推理 + 工具调用）
【整体风格】暗色专业，代码编辑器氛围
【技术栈】React + Tailwind

【Agent 状态显示】
- 顶部进度条：显示当前阶段（Planning → Searching → Editing → Reviewing）
- 每步展开/折叠：默认折叠中间步骤，展开当前步骤
- 工具调用显示：[🔍 Searching files...] [📝 Editing src/utils.ts] [✓ Tests passed]
- 每步有 mini status badge：running（蓝色脉冲）/ done（绿勾）/ error（红叉）

【思考过程 Thinking UI】
- 折叠区域："Show thinking (12 steps)" 点击展开
- 内部：灰色小字逐步显示推理链
- 可中断："Stop" 按钮在任何步骤可见

【代码变更展示】
- Diff 视图：绿色新增 / 红色删除 / 行号
- 文件路径标签：`src/components/Button.tsx`
- 一键 "Apply" / "Reject" 按钮
- 多文件变更：文件 Tab 横向切换

【终端输出】
- 内嵌终端块：等宽字体，暗底（比消息区更深 2 级）
- 命令显示 `$ npm test` + 输出内容可滚动
- 成功/失败：exit code badge

【用户确认节点】
- Agent 需要确认时：高亮卡片 "Agent wants to: Delete 3 files. Allow?"
- [Allow] [Deny] [Edit] 三按钮，Allow 用品牌色

【Prompt 措辞】
"每一步工具调用都用独立卡片显示，含工具图标+描述+状态badge；
 思考过程默认折叠可展开；代码变更用 diff 视图；
 用户确认节点用高亮卡片+明确按钮"
```

---

## 三、AI 搜索（Perplexity / AI Overview 型）

```
【产品类型】AI 搜索 + 综合回答
【整体风格】中性清爽，信息密度中等

【搜索输入】
- 居中大输入框（Hero 式），圆角 24px
- 下方 trending/建议 queries 横向芯片
- 搜索后输入框缩小到顶部固定

【回答区结构】
答案（markdown 正文）
├── 内联引用 [1][2][3]
├── 引用来源卡片区（右侧栏或底部横向）
├── 相关图片（可展开画廊）
└── "Ask follow-up" 输入框

【引用来源展示】
- 右侧栏：favicon + 域名 + 标题，竖向排列
- 或底部：横向卡片，150px 宽，favicon + 标题 + 一句摘要
- 当前正被引用的来源高亮

【Follow-up】
- 底部输入框 + 建议追问（3 条芯片）
- 追问后新答案追加在下方，旧答案折叠

【可信度信号】
- "Sources: 8 web pages" 标注
- 日期标注（"Information as of July 2026"）
- 不确定时："I'm not sure about this" 标注 + 建议验证
```

---

## 四、AI 生成界面（v0 / Bolt 型）

```
【产品类型】AI 前端代码/界面生成器
【整体风格】暗色 + 预览区浅色对比

【输入方式】
- 自然语言输入（底部 composer）
- 支持拖入图片/截图作为参考
- 支持附加 design.md 文件

【实时预览】
- 右侧/上方实时预览 iframe，随代码生成实时更新
- 预览区有 responsive 切换（desktop/tablet/mobile）
- 预览 + 代码 split view，可拖拽分割线

【代码输出】
- 左侧代码面板：文件树 + 编辑器（syntax highlight）
- 流式写入代码（光标闪烁追加）
- 文件 Tab 切换，新文件自动创建

【迭代对话】
- "Make the header sticky" → AI 只修改相关部分（diff 高亮）
- 版本历史：每轮生成一个版本，可回退

【导出】
- "Copy code" / "Download ZIP" / "Deploy to Vercel" 按钮
- 技术栈标注（React + Tailwind + shadcn）
```

---

## 五、AI 写作助手（Notion AI / Grammarly 型）

```
【产品类型】AI 写作 / 编辑增强
【整体风格】极简，不抢正文注意力

【触发方式】
- 选中文字 → 悬浮工具条出现（"Improve" / "Shorter" / "Translate"）
- 空行输入 "/" 或 "space" → AI 命令菜单
- 侧边栏常驻 AI 面板（可选）

【内联建议】
- 紫色/蓝色虚线下划线标注 AI 建议位置
- hover 显示建议内容 + [Accept] [Dismiss]
- Accept 后：平滑替换（crossfade 200ms）

【生成区】
- AI 生成的新文字用浅色高亮底色（品牌色 10% opacity）
- 底部 [Keep] [Discard] [Try again]
- 生成中有 shimmer 边框

【侧边栏模式】
- 右侧窄面板（280px），与正文同步
- 输入框 + AI 回复，不影响正文焦点
- 点击建议后插入到正文光标位置
```

---

## 六、AI 数据分析 / 仪表盘（Julius / ChatBI 型）

```
【产品类型】AI 数据分析 / 自然语言查询
【整体风格】专业中性，数据可视化友好

【输入】
- "Ask about your data..." 输入框
- 建议 queries："What's the revenue trend?" / "Compare Q1 vs Q2"
- 支持 @mention 数据表/字段

【输出结构】
自然语言回答（一句话总结）
├── 自动生成图表（柱状/折线/饼图 适配数据类型）
├── 数据表格（可排序/筛选）
├── SQL/代码显示（折叠，"Show query"）
└── 后续建议 ("You might also want to see...")

【图表】
- 自动选型（数值趋势→折线；分类对比→柱状；占比→饼图）
- 可切换图表类型（按钮组）
- 可下载（PNG/CSV）
- Tooltip 交互完整

【数据安全信号】
- "Querying: sales_2024.csv (local, not uploaded)" 标注
- 敏感数据脱敏显示
```

---

## 七、通用检验清单（所有 AI 界面）

- [ ] 流式输出有闪烁光标 + 布局不回流
- [ ] 等待态有 phase-based 进度（不是空白等待）
- [ ] 有 "Stop generating" / 中断机制
- [ ] 引用/来源有展开预览
- [ ] 反馈机制（👍👎 + 分类）
- [ ] 错误处理：网络断开 → 可重试；超时 → 友好提示
- [ ] 流式区域 aria-busy + 完成后 aria-live
- [ ] 长对话有虚拟滚动或折叠
- [ ] 移动端输入框不被键盘遮挡
- [ ] prefers-reduced-motion 下流式光标改为静态指示
- [ ] AI 生成内容有明确标识（"AI-generated"）
- [ ] 提供"复制全文"功能
