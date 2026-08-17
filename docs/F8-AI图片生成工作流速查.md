# F8 · AI 图片生成工作流速查

> 2026 前端视觉素材的主要来源已从"图库/约稿"转向"**生成 + 精修 + 集成**"。本文件给可落地的三步流水线 + 一致性工程方法。
> 别当老虎机（Thinkpeak：从"generated"到"engineered"）——一致性是系统工程，不是运气。
> 与 B78(摄影艺术指导)、B79(插画系统)、B32(图片媒体处理)、F6(版权)、F7(提示词库) 衔接。

---

## 一、三步流水线（概念 → 精修 → 集成）

| 步骤 | 工具 | 做什么 | 要点 |
|---|---|---|---|
| 1 概念生成 | Midjourney / SD / DALL·E | moodboard、色彩探索、概念图、hero | 每概念 4-8 变体，精选放大；用 `--sref`（风格参考）保持一致性 |
| 2 生产精修 | Canva Magic Studio / Photoshop | 去底、微调、文字叠加、多尺寸导出 | Magic Erase 换背景；品牌元素叠加；批量导出 Web 优化格式 |
| 3 UI 集成 | Figma AI / 前端代码 | 入界面、响应式、组件一致性 | 先把共享色板定好；Figma AI 自动布局建议加速 |

> 实测案例：SaaS 落地页 2 小时完成（20 hero 概念 15 分钟 → 选 3 精修 30 分钟 → Figma 构建 45 分钟），传统做法 2-3 天。

---

## 二、Prompt 工程要点（图专用）

- **指定尺寸与宽高比**：hero 用 16:9 或更宽；社交卡用平台精确尺寸；**按目标分辨率生成，不要放大**（放大必糊）
- **场景参数**：`--ar 16:9`（宽高比）、`--tile`（无缝纹理）、`--style raw`（更写实）、`--no`（排除项）
- 风格一致性：跨 prompt 复用**同一风格描述 + 同一色板 + 同一艺术参考**（这是最便宜的一致性手段）
- 文字渲染场景（banner/logo/带 slogan 的 hero）：选 **Ideogram**（文字渲染最准，多数模型在这栽跟头）

---

## 三、一致性工程（从"生成"到"工程"）

| 层级 | 方法 | 适用 | 要点 |
|---|---|---|---|
| L1 提示词级 | 统一风格描述/色板/参考图 | 所有场景 | 最便宜；先试这个 |
| L2 图像参考 | `--sref` / IP-Adapter | 快速一致 | IP-Adapter FaceID Plus v2 为标准：1 张主参考图 + 权重 0.6-0.8 + 生成前 70% 步数生效 |
| L3 结构控制 | ControlNet OpenPose / Depth | 动作/构图一致 | OpenPose 管姿势（The Action）、Depth 管环境（The Space），可叠加 |
| L4 微调 | LoRA | 品牌专属角色/纹样 | 15-30 张高质量图（含特写/全身/不同光照）、1024×1024、配触发词；Kohya 参数：repeats 10 / epochs 10-15 / lr 1e-4 |
| L5 自动化 | ComfyUI 流水线 | 批量生产 | 节点化编排：参考图 + ControlNet + 修脸修手（ADetailer）自动回贴 |

> **Identity drift**（身份漂移）是头号敌人：同一角色第二张图眼睛颜色就变了。从 L1 开始逐级加固，直到漂移可接受。

---

## 四、工具选型（按用途）

| 工具 | 强项 | 弱项/注意 |
|---|---|---|
| Midjourney | 美学质量、风格广度 | 需付费订阅；无 IP 免责承诺（用 `--no` 规避） |
| Stable Diffusion | 定制/微调/自托管、生态大 | 门槛高；需控制权时（LoRA/ControlNet）选它 |
| DALL·E（OpenAI） | 指令准确、迭代自然（"加个无人机"） | 审美偏平庸；商用条款见 F6 |
| Adobe Firefly | 商用安全（训练数据授权） | 风格广度受限 |
| Ideogram | **文字渲染** | banner/logo 场景首选 |

---

## 五、规模化（团队级）

- **建 prompt 库**（schema：name / description / use case / style / lighting / negative prompts / aspect ratio / version / notes），种下几个高分示例持续迭代
- 流程纪律：prompt 库 → 元数据 → 评审关卡（review gates）→ DAM 收录（Skywork）
- 版权：生成素材按 F6 阶梯管理（概念稿随意/客户交付付费版/包装要赔偿条款）；不泄露客户专有概念

---

## 六、防翻车清单

- [ ] hero/社交卡按目标尺寸生成，不放大
- [ ] 全站图片风格描述/色板一致（L1 起步）
- [ ] 品牌角色做了身份锚定（L2-L4），无漂移
- [ ] 文字类图片用 Ideogram 或复核文字
- [ ] 商用许可覆盖当前用途阶梯（F6）
- [ ] 图片体积按 F3/B32 优化（AVIF/WebP），不拖垮 CWV
- [ ] 生成图经 B78/B79 风格校准，符合品牌语言

---

## 七、与库内衔接

| 文件 | 衔接点 |
|---|---|
| B78 | 摄影与影像艺术指导（风格定义 + prompt 模板 = 本文件 L1 的输入） |
| B79 | 插画系统六层（生成插画与 UI 层级关系） |
| B32 | 图片媒体视觉处理（格式/性能/响应式） |
| F6 | 商用阶梯与版权条款（生成素材的合法使用边界） |
| F7 | 提示词库管理方法论（本文件的 schema 同源） |
| F3/B73 | CWV 与图片性能预算 |

---

## 参考资料（第三轮深挖）

- hubpy "AI Design Workflow 2026"（2026-02）：Midjourney→Canva→Figma 三步流水线、每步 prompt 策略表、2 小时落地页案例、--sref 一致性
- Thinkpeak "Stable Diffusion Character Consistency 2026"（2026-02）：identity drift、Character DNA、Name Anchoring、IP-Adapter FaceID Plus v2（权重 0.6-0.8/70% 步数）、ControlNet 叠加（OpenPose/DEPTH）、LoRA（15-30 张/触发词/Kohya 参数）、ComfyUI 工厂化
- Outright CRM "11 Best AI Image Generators for Web Design 2026"：Midjourney 绘画感、DALL·E 迭代准确性、SD 自托管定制、Ideogram 文字渲染
- no-edit/EPIC "AI in Web Design 2026"：hero 16:9+、社交卡平台尺寸、按需分辨率生成、跨 prompt 一致性原则
- Skywork "How to Scale Your Design Workflow with AI Image Generator"（2026-02）：prompt 库 schema（name/use case/style/lighting/negative/aspect ratio/version/notes）、评审关卡、DAM 收录
- line25 "Best AI Design Tools 2026"（2026-04）：Midjourney --style raw、--no 规避、商用许可注意