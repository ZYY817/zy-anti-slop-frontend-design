# w1-trace.md · 定价页（货架页）生成记录

任务：墨迹 Inkwell 定价页（brief.md）。页型=**货架页**（B87：均权网格合法，比较便利优先于叙事）。延续 case05「深夜书房」色系，另立案名「灯下账本 OPEN LEDGER」（价格写在纸面上）。货架页视觉非主表达 → **R 板块不开闸**，走 Z1 轻量方向卡 + K 词条决策点。对照：已有 w0「价目单」单纸方案——w1 取「三档货架+亮卡」异构解读。

## 实际读取（10 篇 + 2 诊断件）
AGENTS/00-总索引（工作流+路由）· Z2（上下文对象/R 闸门/K 取决策点）· Z1（结构卡六项/轻量方向卡）· **B87**（货架页定义/报岗/首屏四问/承诺阶梯/跳读）· B75 定价节段（三档卡/toggle/对比表三式）· **K18**（治理五组决策点）· K10（审计脊柱/P0 细则）· Z3（五轮清单/实修条款）· H3（信任贴摩擦点/单列/Hick 3 选/暗黑红线）· B76（FAQ 原生 details；切换用 radio 组）· case05 w2.html+w2-trace（品牌 token/mnote/暖黑影/`.js` 早挂）· B82 清单（grep 片段：禁默认脸）。

## 结构卡（先于方向卡）
①页型=货架页；链=定向(哲学主张句)→货架(主件)→台账(深化)→排疑→收口+次级出口。②逐块报岗：intro=定向+勾住（"本地功能永远免费"可证伪主张句）；plans=比较（三档均权+Pro 亮）；cmp=深化（mono 台账 4 组 14 行）；faq=排疑（买断/取消/退款/隐私/差价/团队 7 问）；cta=收口（回扣"字是自己的，钱只花在同步上"+功能页退路）。③首屏四问全答。④show=价目与台账本体，无连续 tell-only。⑤承诺阶梯：切档(零成本)→选档→下载 Free/升级；主 CTA 唯一=免费下载。⑥跳读验收：仅读标题可复述定价哲学 ✅。

## 方向卡
气质=克制/坦诚/笃定；隐喻=灯下账本（墨夜 #16120D/钨丝 #D9A24B/稿纸 #F2EDDF）。反面点名：紫渐变/三卡均权无层级/假划线价/"Best Value"徽标/假紧迫/藏月付/✓海不分组。密度序列：顶栏 L3→intro L2→货架 L2.5→台账 L4→FAQ L3→**CTA L1.5 呼吸峰**→页脚 L3。人性词=坦诚（哲学入首屏）+照管（退款承诺贴价格旁，H3 摩擦点原则）。

## K 词条决策点逐项答案
- **K·视觉配额**：signature=Pro 亮卡（稿纸+钨丝灯晕，货架唯一亮块；CTA 亮面为收口回放副峰=母题"被照亮的一块"）；琥珀静态 ≤5 处（badge/save/thead Pro 列名/2 CTA，面积<3%）；装饰=噪点+hairline 两种；同屏动效≤2；噪点 4.5% 单层。
- **K·破格**：仅 Pro `translateY(-16px)` 纵破横锚，≤960 归零；mnote×3 为成系统编辑手法（同构有锚定）≤1319 回流。
- **K·密度节奏**：序列如上；台账 mono 10–13.5px 密行反衬 CTA 放开。
- **K·职责分工**：色→岗（琥珀=动作·省钱信号；稿纸=亮块母题；墨夜=底）；字→岗（宋=表达，sans=界面，mono=数据·价目·台账）；无闲员无双岗。
- **K·动效双轨**：productive=hover/focus/toggle/summary 150–200ms 无回弹；expressive 仅 1 处=价格换档纵滑 300ms；单一 `--ease`；reduced-motion 全灭+`.js` 不挂。
- **计费切换**：fieldset+sr-only legend+2 radio（原生方向键/读屏/无 JS 可选）；默认年付；JS 只做换数字/单位/副文案+CTA `?cycle=` 同步+`aria-live` 双卡播报（Free 不挂）；无 JS 兜底=年付大数+月付小字常显信息不丢。
- **FAQ**：原生 details/summary（B76 首选），± 转 45°，展开 aIn 220ms；print 强制展开。
- **K·输出视图**：print 浅底/藏导航·切换·按钮/details 展开/卡加 hairline。
- **未命中**：吸附/拖拽/流式/表格编辑无需求 → 不取不答。

## Z3/K10 审计实修（实改非承诺）
P1×5：①`.intro-in` 缺 `position:relative`→mnote 飞出视口，已补；②`.seg span` 40px<44px 触控下限→44px；③`td.no`("—"承载信息) ink-38≈3.4:1 不达 AA→ink-55；④Pro 破格被 `.js .reveal.in{transform:none}`(3 类特异度)抹掉→改 `--settle` 变量，实测落定 -16px 差邻卡 16px；⑤对比表特性列 `td.f` 非行表头→14 行全改 `th scope="row"`+grp `scope="rowgroup"`+配套 CSS 重写。
P2×5：⑥seg focus 环被误并入琥珀-p 组（暗底不可见）→拆回琥珀；⑦移动 `order:-1` 致 DOM/视觉错位→去除仅 transform 回退；⑧Free 静态价挂 aria-live+被 swap 扫→双去；⑨琥珀超配额风险→nav 当前态改墨线+Pro ✓ 改 p-ink-48；⑩打印误藏 tier-micro 信息→保留。P3×1：price-row 末行 th/td 底边不一致→合并。

## 真实验证
verify.py 全过；无头 Chrome iframe 探针实测：双端无横溢、行排/堆叠正确、切月付 pval=8·per=/月·href=cycle=month、details 可展、liveRegions=2、0 死链 0 坏锚；像素断言=月付选中 span 纸白 (242,237,223) 真渲染、亮带=seg pill+Pro 卡+CTA 整面、琥珀稀疏合配额；`--settle` 机制用禁 transition 注入法证定。局限：virtual-time 冻结 IO/transition，改双保险验证。**未验证**：真读屏播报 ⬜ / axe 实测对比度 ⬜ / 动效节奏真机目检 ⬜。

## 五轮结论
R1：Pro 亮卡单峰+CTA 收束，母题第 3 变奏；R2：价格与 brief 全一致，差价数学自洽（省 28/48≈两三成）；R3：原生键盘可达无死控件，375 重排；R4：标签配平/JS check 过/scope 全/focus 双底分色；R5：遮 logo 可辨，与 w0 同系异构。
