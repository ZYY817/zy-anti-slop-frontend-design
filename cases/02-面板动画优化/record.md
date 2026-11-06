# record.md · 02-面板动画优化 对照记录

> 流程：`before.html` → K10 诊断（audit.md）→ 决策点逐项作答 → `after.html`
> 本案主线是**动效域**——3 项 P0 全在 K5/K1。验证为代码审查级，浏览器/真机实测未跑。

## P0-1 手风琴：max-height 代理 → 实测高度动画

- **命中词条**：K5·动画中断与接续、B45（时长缓动）
- **决策点逐项答案**：
  - ① 高度动画方案 → **scrollHeight 实测 + WAAPI**；弃用 `max-height:500px`（实际内容 ~180px，动画在 500-180px 不可见区间空跑=展开过快+收起前半段"隐形"延迟感）
  - ② 终态写入 → 展开完写 `height:auto`（内容再变高不裁切），收起写 `0`；动画期间用显式 px
  - ③ 时长刻度 → BASE 280ms + **距离比例**：`dur = 280 × |start-target|/scrollHeight`，下限 80ms
  - ④ 缓动 → `cubic-bezier(.4,0,.2,1)` 标准缓出（B45 展开用 ease-out 族）
- **验证**：✅ 代码审查——无 max-height 代理残留，缓动全时长作用于可见区间；隐形动画段消除

## P0-2 底部面板：位置阈值 → 三档吸附 + 速度裁决

- **命中词条**：K1·停靠、K1·吸附、K1·几何约束
- **决策点逐项答案**：
  - ① 档位集合 → **三档语义 detents**：`full(8%) / peek(55%) / closed(100%)`，替代"随手拍的 30%"
  - ② 吸附裁决 → **速度权重**：150ms 窗口采样算 v（px/ms），`|v|>0.5` 为 flick——方向胜，往相邻档位走；慢速 → 按 releaseTy 就近吸附
  - ③ 边缘阻尼 → 拖过 top 边界 `dy/3` 阻力（K1·几何约束的过界处理）
  - ④ 跟手协议 → 拖拽中 `transition:none` + transform 直写（1:1 跟手）；松手统一走落定动画 `cubic-bezier(.32,.72,0,1)`，时长 160+dist×4（≤320ms）
- **验证**：✅ 逻辑审查——flick 与慢速两条路径分离；档位语义化；**审查中自捕 1 个 bug**：速度样本 `samples.shift()` 误丢拖拽起点导致 dy 基准漂移 → 拆出独立 `downY`（这正是 record 存在的意义）

## P0-3 中断接管：全程满时长 → 剩余距离比例

- **命中词条**：K5·中断与接续、K7·状态机
- **决策点逐项答案**：
  - ① 中断接管 → `anim.cancel()` 旧动画，`getComputedStyle` 读**当前实际高度**为新起点
  - ② 接续时长 → 同一比例公式天然覆盖中断场景（从 60% 位置反向收起 = 280×60%≈170ms，不再是满 350ms）
  - ③ 元素同步 → icon 用同 `--dur-panel`/同 `--ease-panel` CSS transition，与 body 天然同步（双向都从当前位置反转）
  - ④ backdrop 联动 → `opacity = 1 - ty` 进度联动 + `pointer-events` 闸，替代 `display:none` 瞬切
- **验证**：✅ 审查通过——连点路径：cancel → 实测起点 → 比例时长，无跳变无状态错位

## P1 项：aria 同步 / Esc / 焦点 / 降级

- **aria-expanded**：点击时更新（状态=意图，不等动画完）——K7 决策点
- **Esc 关闭 + 焦点归还**：sheet `role="dialog" aria-modal`，Esc→closeSheet+`trigger.focus()` 归还——K14/B76
- **reduced-motion**：`matchMedia` 一次判定，所有动画路径有 instant 分支——B76/C7
- **实现注记**：`void offsetHeight` 强制立帧后再恢复 transition——防止浏览器把"无动画定位"和"恢复 transition"合批导致跳变

## 未解决风险与未验证项

| 项 | 状态 |
|---|---|
| 真机 touch/pointer 行为 | ⬜ 未测（iOS Safari pointer event 差异、`touch-action:none` 兼容性） |
| 手风琴内部内容动态变化 | 未处理（展开中内容变高会裁切——MutationObserver 属增强项） |
| 速度采样精度 | 150ms/4 样本启发式，未与原生滚动惯性调参对比 |
| 多手风琴互斥（手风琴模式） | 未实现——独立开合符合"设置中心"语义，模式选择本身是 K 词条级问题 |

## 词条反哺（M2 闭环）

- **K5·中断接续**：本案验证"实测起点 + 距离比例时长"双决策点可合并为一条实现路径（WAAPI cancel → computed → 比例 dur），建议词条"实现"字段收此模式
- **K1·停靠**：三档 detents + 速度窗口（150ms/0.5px/ms）参数域可作为词条参数示例候选
- **K14·浮层**：backdrop `opacity=f(progress)` 联动验证了"浮层进度驱动背板"决策点的可实现性
- **新暴露的待决点**：手风琴互斥模式（accordion vs 独立开合）是词条未覆盖的模式选型——候选入 K5 或 K 新词条，待更多案例佐证后定
