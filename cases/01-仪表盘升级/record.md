# record.md · 01-仪表盘升级 对照记录

> 流程：`before.html` → K10 诊断 prompt（audit.md）→ 修复 prompt（决策点逐项作答）→ `after.html`
> 规则：每处改动写清"命中词条 → 决策点逐项答案 → 验证结果"。本次为文档级验证（代码审查），未跑浏览器实测的项标"未验证"。

## P0-1 删除操作：confirm 拦截 → Toast+Undo 软删除

- **命中词条**：K12·撤销与破坏性操作
- **决策点逐项答案**：
  - ① 确认 vs 撤销选型 → **撤销**（订单删除可逆，不打断任务流；真删延后 5s）
  - ② 撤销窗口 → **5s**，带 Action 的 toast 不自动消失，hover 暂停计时
  - ③ 撤销粒度 → **单条**（每行删除独立 toast）
  - ④ 实现模式 → **软删除**：`display:none` 隐藏 + 5s 后 `row.remove()`；撤销=清 timer + 恢复显示原位
- **改动**：before 的 `confirm()` + 直接消失 → after 的 `pendingDeletes` map + toast 撤销按钮
- **验证**：✅ 代码审查通过（timer/map/撤销路径完整）；⬜ 浏览器交互实测未做（待 T1）

## P0-2 搜索框：每键一 toast → 触发链+队列治理

- **命中词条**：K16·搜索触发链、K11·IME组合输入保护、K14·Toast队列
- **决策点逐项答案**：
  - 触发门槛（K16）→ **300ms 防抖 + 最少 2 字符**；少于 2 字符清空结果不发请求不提示
  - 组合期屏蔽（K11）→ **compositionstart 挂起 timer、compositionend 用最终值重启**；中文拼音输入中途零触发
  - 结果反馈 → **无结果才 toast**（3s 自动消失），有结果不打扰（本案例结果在表格内过滤留待扩展）
  - 队列规则（K14）→ **同屏 ≤3 条**（超出 FIFO 移除）；带 Action 不自动消失；hover 暂停计时
- **改动**：before 的 `input → showToast`（每键弹） → after 的 `schedule()` 防抖 + composition 守卫 + `makeToast` 队列
- **验证**：✅ 逻辑审查通过；⬜ 中文输入法真机实测未做

## P1-1 表格视觉规格：三件套叠加 → 分隔三选一+对齐协议

- **命中词条**：K13·表格视觉规格
- **决策点逐项答案**：
  - ① 行分隔语言 → **细线**（`border-bottom: 1px`）+ hover 底色，删斑马纹（不再三件套叠加）
  - ② 列对齐协议 → **文左 / 金额右+tabular-nums / 状态居中 / 操作右**，表头与数据同对齐
  - ③ sticky 决策 → **thead sticky top:0**（长表滚动表头存活）；本例无横向滚动，首列冻结不适用
  - ④ 选中态防跳 → **`outline: 2px; outline-offset: -2px`**（零布局成本）替换 `border: 2px`（跳行源）
  - ⑤ 溢出策略 → `white-space: nowrap` + 容器横向滚动兜底；本例数据短未触发截断
- **验证**：✅ CSS 审查通过（outline 不占盒模型，无跳动）；金额列 tabular-nums+右对齐可目检

## P1-2 视觉配额：slop 四件套 → 单峰克制

- **命中词条**：K18·视觉配额、B82 反 AI 味
- **决策点逐项答案**：
  - ① signature 峰值 → **1 个**（KPI 数字区），其余区域全部让位
  - ② 强调色配额 → `#5e6ad2` 单一靛蓝，出现处：badge、focus环、选中描边、primary按钮、undo链接 = **5 处**
  - ③ 装饰手法 → **0 种**特殊装饰（无渐变无噪点无网格线）——数据产品的克制取向
  - ⑤ 纹理剂量 → **backdrop-blur 全删**（4 处玻璃卡片 → 实底 panel + 1px 边框）
- **改动**：字体 Inter → IBM Plex Sans（非默认脸）；圆角 20/10/8 混用 → `--r-sm:8px/--r-lg:12px` 两档（K2·圆角连续性）
- **验证**：✅ 可数验收——强调色 5 处、装饰手法 0、模糊层 0；紫蓝渐变/Inter/scale hover 三指纹已清除

## P1-3 组件六态：hover 色阶+active+focus-visible+disabled

- **命中词条**：D4 状态矩阵、B76 焦点可见性
- **决策点答案**：hover=色阶加深（不用 scale）；active=`scale(.97)`；focus-visible=`outline 2px+offset 2px`；disabled=`opacity .4+cursor`
- **验证**：✅ 四态均有实现；⬜ 键盘 Tab 顺序实测未做

## P2-1 性能：去玻璃化

- **命中词条**：K18·配额⑤、F3
- **决策点答案**：backdrop-blur ×4 大卡片 → 0（实色 panel）；动画只 transform/opacity（toast-in 符合）
- **验证**：✅ 审查通过（无 blur/filter 残留）

## 未解决风险与未验证项

| 项 | 状态 |
|---|---|
| 移动端断点 | 已加 900px 单档降级（cards 纵排、导航收），未做完整响应式重排 |
| 表格搜索的实际过滤 | 本案例 toast 提示无结果，行级过滤未实现（超出本次修复范围） |
| 浏览器/真机实测 | **未跑**——本次为代码审查级验证，渲染效果待 T1 协议实测 |
| 删除的服务端同步 | 软删除仅前端态，真实产品需对接 API 延迟真删或逆操作 |

## 词条反哺（M2 闭环）

- K14·Toast队列：本案例验证了"同屏≤3+hover暂停+Action不消失"三规则可组合实现，无冲突
- K12·撤销：`pendingDeletes` 模式可作为词条"实现"字段的参考代码片段候选
- K13·视觉规格：⑤溢出策略在本案例未实际触发，词条的"不可截断白名单"决策点仍未被实测——留待案例 03/05 补证
