# R14 · WebGPU与计算管线（提示词库 L 组）

> **定位**：下一代 GPU 能力。当 WebGL 的粒子/流体/体积撞到性能墙时，WebGPU 用 compute shader 把量级抬高一到两个数量级。
> **覆盖层**：L2 气 + L3 肉（性能维度贯穿全层）
> **条目卡格式**：`条目名 · L 层级 · 档位（基础/进阶/电影级）· 成本(低/中/高)`，其下依次为「视觉收益 / 强度档位 / 同族拓展 / 提示词片段」，可按需只取提示词片段直接投喂生成模型。
> **来源说明**：本文迁移自外部「视觉提示词库」L 组（v1.x，2026-08-16）。原库的组字母（A-R）与本库板块字母语义不同，文内所有组间引用已改写为 `R{编号}·{原引用}` 形式，总索引对应 `R0`。
> **关键判断（原库保留）**：**撞到性能墙才用本组**。为了用而用 WebGPU 只会增加白屏风险。

---

## 使用说明

L 组不是"新效果"，而是"同样的效果做得更大、更快、或原本做不到"。判断你需不需要它：

- 粒子数量 >50 万且要交互 → 需要（compute shader）
- 实时流体/软体/大规模物理 → 需要
- 后期链很长（>6 pass）想合并 → 需要
- 只是做个渐变按钮 → **不需要**，用 CSS（`R9` CSS能力与UI材质）

关键前提：**WebGPU 支持度仍在爬坡**（2026 年桌面 Chrome/Edge/Safari 已可用，部分移动端仍需回退）。**必须写 WebGL 回退路径**，否则一批用户白屏。

```
L1 WebGPU 基础与回退      L4 存储缓冲与数据结构
L2 计算着色器            L5 渲染管线与 WGSL
L3 GPGPU 大规模粒子      L6 性能与调度
```

**与本库其他文档的取用口径**：

| 你想做的事 | 去哪里取 | 口径 |
|---|---|---|
| 检查是否有"AI 味"、是否踩视觉禁忌 | `B82`、`B44` | **参考清单，不是硬性铁律，按项目自行取舍**——GPU 重效果场景本身就偏离常规分母，不必逐条对齐 |
| 确定风格谱系 / 视觉方向 | `B16`、`E1` | 先定方向再决定是否需要 WebGPU 级别的算力 |
| 检查视觉维度是否覆盖完整 | `B15` | 全维度清单，用于自检遗漏 |

---

## L1 WebGPU 基础与回退（Setup & Fallback）

- **能力检测与降级（Capability Detection）** · L5 · 基础 · 成本:低
  - 视觉收益：不支持时优雅退回 WebGL2/CSS，而非白屏
  - 同族拓展：`navigator.gpu`、`requestAdapter`、`adapter.features`、three.js WebGPURenderer 的自动回退、WebGL2 fallback
  - 提示词片段：`先检测 navigator.gpu 与 adapter；不可用则回退到 WebGL2 路径（同一视觉的低配版）；两条路径都要测`

- **WebGPU 渲染器（three.js WebGPURenderer / TSL）** · L3 · 进阶 · 成本:中
  - 视觉收益：用 three.js 的节点材质系统（TSL）写一次，自动编译到 WGSL 或 GLSL
  - 同族拓展：TSL（Three Shading Language）、WebGPURenderer、node materials、自动 WebGL2 回退
  - 提示词片段：`用 three.js TSL 写材质（一次编写，自动输出 WGSL/GLSL）；用 WebGPURenderer 且开启 WebGL2 fallback`

- **异步初始化（Async Init）** · L5 · 基础 · 成本:低
  - 视觉收益：WebGPU 初始化是异步的，要有 loading 态衔接（见 `R11·F6`）
  - 提示词片段：`WebGPU 异步初始化期间显示 loading（见 R11·F6 零黑屏）；device lost 时监听并重建`

---

## L2 计算着色器（Compute Shaders）

- **通用计算（Compute Pass）** · L2 · 电影级 · 成本:中
  - 视觉收益：脱离渲染管线的纯计算，用于粒子更新、物理、图像处理，无需 ping-pong 纹理 hack
  - 同族拓展：workgroup、`@compute @workgroup_size`、dispatch、compute vs fragment 的区别（compute 可任意读写、无光栅化开销）
  - 提示词片段：`粒子/物理更新用 compute shader（workgroup_size 64），直接读写 storage buffer，替代 WebGL 的纹理 ping-pong`

- **工作组与共享内存（Workgroups & Shared Memory）** · L2 · 电影级 · 成本:高
  - 视觉收益：workgroup 内共享内存做归约/前缀和/邻域查询，大幅加速
  - 同族拓展：`var<workgroup>`、barrier 同步、parallel reduction、tile-based 处理
  - 提示词片段：`用 workgroup 共享内存做邻域查询（如流体/boids 的空间哈希），减少全局内存访问`

- **间接派发（Indirect Dispatch）** · L2 · 电影级 · 成本:高
  - 视觉收益：GPU 自己决定绘制多少（如剔除后的可见粒子数），CPU 不参与
  - 同族拓展：`drawIndirect`、GPU-driven rendering、compaction
  - 提示词片段：`用 indirect dispatch 让 GPU 决定绘制数量（视锥剔除后），CPU 零回读`

---

## L3 GPGPU 大规模粒子（Massive Particles）

- **百万级粒子（Million+ Particles）** · L3 · 电影级 · 成本:高
  - 视觉收益：WebGL 的 GPGPU 上限约 100 万且笨重；WebGPU 轻松百万到千万
  - 强度档位：10 万（WebGL 也行）/ 100 万（WebGPU 舒适）/ 1000 万（高端）
  - 同族拓展：见 `R4·B7` GPGPU、storage buffer 存粒子、instanced rendering、point/quad 渲染
  - 提示词片段：`用 WebGPU compute 更新 100 万粒子（位置/速度/生命存 storage buffer），instanced 渲染；WebGL 回退降到 6.5 万`

- **粒子排序（Particle Sorting）** · L2 · 电影级 · 成本:高
  - 视觉收益：透明粒子需按深度排序才正确混合；GPU 排序（bitonic）才够快
  - 同族拓展：bitonic sort、radix sort、按视深排序、或用加性混合避开排序
  - 提示词片段：`透明粒子用 GPU bitonic sort 按深度排序；或全用加性混合避开排序需求`

- **空间加速结构（Spatial Structures）** · L2 · 电影级 · 成本:高
  - 视觉收益：粒子间交互（碰撞/群体/SPH）需要邻域查询，靠空间哈希/网格加速
  - 同族拓展：spatial hash grid、uniform grid、见 `R8·J4` boids/流体
  - 提示词片段：`粒子交互用 GPU 空间哈希网格加速邻域查询，避免 O(n²)`

---

## L4 存储缓冲与数据结构（Storage & Data）

- **存储缓冲（Storage Buffers）** · L2 · 进阶 · 成本:中
  - 视觉收益：任意结构化读写，比纹理灵活得多
  - 同族拓展：`var<storage, read_write>`、struct 布局、对齐规则（16 字节对齐坑）、SSBO
  - 提示词片段：`粒子数据用 storage buffer 的 struct 数组；注意 vec3 的 16 字节对齐（用 vec4 或显式 padding）`

- **纹理与采样（Textures & Samplers）** · L3 · 进阶 · 成本:中
  - 视觉收益：storage textures 可在 compute 里写，做图像处理/GPU 生成纹理
  - 同族拓展：storage texture、mipmap 生成、`textureLoad/textureStore`
  - 提示词片段：`程序化纹理用 compute 写 storage texture（如生成 3D 噪声体积供体积渲染采样）`

- **Uniform 与绑定组（Bind Groups）** · L5 · 基础 · 成本:低
  - 视觉收益：组织资源绑定，切换开销小
  - 同族拓展：bind group layout、动态偏移、`@group @binding`
  - 提示词片段：`把常改参数放一个 bind group、静态资源放另一个，减少切换开销`

---

## L5 渲染管线与 WGSL（Render Pipeline & WGSL）

- **WGSL 着色语言** · L2 · 进阶 · 成本:中
  - 视觉收益：WebGPU 的着色语言，比 GLSL 更严格更现代
  - 同族拓展：与 GLSL 的差异（无隐式转换、显式 stage 属性）、`textureSample` vs `texture()`、内置函数映射
  - 提示词片段：`用 WGSL 写着色器；注意与 GLSL 差异（无隐式类型转换、需显式 @location/@builtin）`

- **多渲染目标与合并 pass（MRT & Pass Merging）** · L5 · 电影级 · 成本:中
  - 视觉收益：一次绘制输出多个缓冲（G-buffer），或合并后期减少带宽
  - 同族拓展：MRT、deferred rendering、render bundles（预录制命令）
  - 提示词片段：`延迟渲染用 MRT 输出 G-buffer；重复的绘制命令用 render bundle 预录制`

- **HDR 与画布配置（Canvas HDR）** · L4 · 电影级 · 成本:低
  - 视觉收益：WebGPU 支持真 HDR 画布输出（`rgba16float` + HDR 显示）
  - 同族拓展：`configure({ format, toneMapping })`、`rec2100-hlg`/`display-p3` 输出、见 `R5·C8`
  - 提示词片段：`画布配 rgba16float + HDR 显示模式（如支持）；否则走 tone mapping 到 sRGB（见 R5·C6）`

---

## L6 性能与调度（Performance & Scheduling）

- **时间戳查询（Timestamp Queries）** · L5 · 进阶 · 成本:低
  - 视觉收益：精确测量每个 pass 的 GPU 耗时，指导优化
  - 同族拓展：`timestamp-query` feature、GPU 计时、pipeline statistics
  - 提示词片段：`用 timestamp query 测量各 pass GPU 耗时，据此决定降档策略（见 R6·D8）`

- **避免 CPU-GPU 同步（Avoid Stalls）** · L5 · 进阶 · 成本:低
  - 视觉收益：回读 GPU 数据（mapAsync）会造成 stall，尽量让数据留在 GPU
  - 同族拓展：staging buffer、double buffering、异步回读、GPU-driven（见 `R14·L2`）
  - 提示词片段：`避免每帧回读 GPU 数据；必须回读时用 double-buffered staging buffer 异步进行`

- **与 `R6·D8` 的衔接（Tiering）** · L5 · 基础 · 成本:低
  - 视觉收益：WebGPU 路径也要有质量档位与降级
  - 提示词片段：`WebGPU 路径同样分 Standard/High/Cinematic（见 R6·D8），主要调粒子数与 compute 迭代次数`

---

## L 组 · 组合速查

| 想要的效果 | 组合 |
|---|---|
| 千万级粒子星河 | `R14·L3` 百万粒子 + `R14·L2` compute + `R14·L3` 空间结构 + `R4·B7` 拖尾 |
| 实时大规模流体 | `R14·L2` compute + `R14·L4` storage texture + `R4·B5` stable fluids |
| GPU 驱动渲染 | `R14·L2` indirect dispatch + `R14·L5` render bundle + `R14·L3` 排序 |
| HDR 体积渲染 | `R14·L4` storage texture(3D噪声) + `R14·L5` HDR 画布 + `R4·B1` 体积 |

**常见坑**：

- 一批用户白屏 → `R14·L1` 没写 WebGL 回退
- vec3 数据错乱 → `R14·L4` 忽略了 16 字节对齐
- 每帧卡顿 → `R14·L6` 有 CPU-GPU 同步回读
- 移动端跑不了 → WebGPU 移动支持有限，必须回退

> **判断心法**：WebGPU 是"撞墙后"的工具。先用 WebGL/CSS 把效果做出来，只在明确撞到性能墙时才迁移到本组。为了用而用 WebGPU 只会增加白屏风险。

---

## 与库内衔接

| 本文小节 | 目标库相关文档 | 关系 |
|---|---|---|
| L6 性能与调度（timestamp query、避免 stall、质量档位） | `F3` 性能与 Core Web Vitals | 地基——GPU 耗时预算必须回落到 LCP/INP/CLS 的整体性能约束里 |
| L3 GPGPU 大规模粒子、L2 计算着色器 | `V12` 粒子与动态 | 扩展——`V12` 给的是粒子视觉语汇，本文把其量级从十万级抬到百万至千万级 |
| L5 渲染管线与 WGSL、L4 存储缓冲 | `F1` CSS 术语 | 地基——先用 `F1` 的 CSS/合成层术语确认能不能不上 GPU 管线，再决定是否进本文 |
| L1 WebGPU 基础与回退、使用说明中的"只是做个渐变按钮 → 不需要" | `V14` 现代 CSS 视觉玩法 | 验证——回退路径与轻量替代方案的首选出处；能用现代 CSS 达成的效果不要走 WebGPU |
| L1 支持度爬坡判断、L5 HDR 画布 | `E2` 2025-2026 趋势 | 验证——用趋势文档校准 WebGPU / HDR 输出的落地时机与用户覆盖率预期 |

补充取用：需要判断是否踩视觉禁忌时看 `B82`、`B44`（参考清单，不是硬性铁律，按项目自行取舍）；确定风格方向看 `B16`、`E1`；自检视觉维度覆盖度看 `B15`。

---

## 参考资料

- 本文融合自外部「视觉提示词库」L 组：WebGPU 与计算管线（v1.x，日期 2026-08-16），做忠实迁移 + 本库命名与交叉引用规范适配。
- 原库组间引用（A-R 组、总索引）已统一改写为本库 `R{编号}·{原引用}` 形式，本组自引用写作 `R14·L{n}`。
- 技术术语（WGSL、compute shader、storage buffer、workgroup、bind group、GPGPU、MRT、render bundle、bitonic sort、spatial hash grid 等）与参数值（`workgroup_size 64`、16 字节对齐、10 万/100 万/1000 万粒子档位、WebGL 回退 6.5 万、`rgba16float`、`rec2100-hlg`/`display-p3`、>6 pass 后期链阈值）**来自该库原始调研，未新增未经验证的数据**。

---

_迁移版本：R14（源：提示词库 L 组 v1.x）_
_源日期：2026-08-16_
_前提：必须写 WebGL 回退，否则一批用户白屏_
