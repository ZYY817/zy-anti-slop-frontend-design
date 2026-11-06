# armed3-trace.md — 墨迹设置页 · 状态指征经济（K18 新增决策对象）实装轮

页型：工具页；R 闸关（预算全给状态/交互）。基座 armed2.html，本轮重做微观状态层+修审计 P1。

## 状态通道清单（静态通道 ≤2；脉冲属时间维信号单列）

| 态 | 通道数 | 手段 |
|---|---|---|
| 导航 hover | 1 | `--surface-2` 底 tint |
| 导航 active/selected | 2 | `--accent-soft` 同色底 + `--accent-strong` 同色字；禁左色条/白底/阴影/字重 |
| 导航命中计数 `.hit` | 1 | mono 灰小字（外围通道，不占 accent 色面） |
| 搜索高亮 `mark` | 1 | `--mark` 藤黄底（荧光笔隐喻）；禁下划线/描边（下划线=链接语义） |
| 分段控件选中 / hover | 2 / 1 | thumb 底+字色（暗色 thumb 取 surface-3）/ 字色加深；去阴影去字重 |
| 开关 on / hover | 2 / 1 | accent 底+拇指位移（开闭语义）/ 边框加深 |
| 色板选中 / hover | 1 / 1 | 勾图标（暗色反黑勾+暗色 tile，所见即所应用）/ 边框；禁位移（尺寸最贵） |
| 快捷键捕获中 | 2+脉冲 | accent-soft 底+同色字+pulse（与 sync-dot 同源时间信号） |
| 设备标签 / 逾期 | 1 / 2 | mono 灰字 / 警示色+文字（语义豁免，非堆叠） |
| 保存·同步点 | 1~2 | 灰→accent；进行中=警示色+pulse（语义） |
| 按钮 hover/primary/danger | 1 | 底 tint；主/危用语义色（豁免） |
| focus-visible / ::selection | — / 1 | 无障碍描边环（不计内容态预算）/ accent-soft 底 |
| 冲突条/危险卡（容器级） | ≤3 | danger-soft 底+danger-line 边+文字（语义区豁免） |

## 分组容器岗（B87）判定

设置页逐组浏览 → 一屏一组 + 组卡聚合 + 行级分隔：6 个 `.sec` 单显，导航定位；卡片=分组容器，
危险区=同模式红色变体。上轮整页长账本是过度修正——工具页需要组边界与空状态归属。

## 实修（Z3 五轮 → P0/P1 已修，不只承诺）

- `runAction('theme')` 未同步 roving tabindex → 新选项 tabindex=0。
- `.sidenav` display:none 留 236px 空列 → `.shell.no-nav` 换列模板。
- `aria-current="location"` 非法 → "page"；`renderKeys` 清悬挂 capture。
- `keyErr`/`toast` 计时器叠加/瞬时移除 → clearTimeout、opacity 过渡再 remove。
- `S.*` 直引 DEF → 深拷贝隔离；select chevron/色板 tile 暗色假显色 → 暗色变体；死样式删。

## 验证与边界

`cases/verify.py` 全过；`node --check` OK；i18n zh/en 键对齐；无重复 id；主态对比度 ≥4.97:1（浅）/7.2:1（暗）。
环境无 Playwright/jsdom，点击级行为待人工走查。已知边界：无结果 toast 每词一次（节流）；
同步中切语言 `#syncLabel` 被 applyLang 重置（P3 记录在案）。
