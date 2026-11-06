# w0-trace.md · 墨迹 Inkwell 定价页

- 沿用 case05「深夜书房」设计系统（墨夜/钨丝/稿纸三角色、serif-sans-mono 分工、灯晕+噪点、双轨动效），按 B87「定价页=货架页」收敛：比较便利 > 叙事。
- 关键决策①：三档不做"三张卡"——整幅稿纸**价目单**（sheet-head 铅字行+hairline 分列+sheet-foot 注脚），Pro 列淡钨底+描边戳记"多数人的选择"，全页唯一带灯晕的 signature 亮块。
- 关键决策②：对照表按产品哲学分两个 tbody 组——「本地写作·永远免费」/「同步与协作·订阅项」，分组即论证；thead 挂实时价，Pro 列竖向通道线+琥珀顶线。
- 关键决策③：月/年切换用真 radio+label（原生可点、方向键原生可走、`:focus-visible+label` 聚焦环），价格/备注切换走 `body:has()` CSS——无 JS 照样换价；JS 只补：.is-m 兜底类、结算链接 `billing=` 参数同步、`role=status` 读屏播报。
- 关键决策④：FAQ 用原生 details/summary（无 JS 可折叠、首条默认开展示 affordance）；CTA 全为真实链接：#dl 锚点、checkout?plan=…&billing=…、downloads/*.dmg、mailto。
- 诚实计价：年付备注 "≈¥5.7/月·省¥28"、月付备注 "改年付立省¥28"，无划线假锚、无倒计时；"三条直说"区把不卖断/不画饼写成条款。
- 自检（headless Chrome 实测）：1280px 下 10 项功能断言全过（换价/href 跟随/播报/折叠/无横向溢出）；375px 经 iframe 真视口验证——cols=1 叠列、表内横滑 sw620>cw454、页面零溢出；标签配平、锚点全活、`node --check` 通过。
- 自检发现并实修：`.tbl .hot td` 选择器写反致 Pro 列通道线失效（→`td.hot`）；内联 style 一处（→`.tgl-sub`）；`.sheet-foot` 误标 aria-hidden 藏真实信息（→去除）；切换器触控高 38→42px。
- 未验证项：真实屏幕阅读器播报顺序 ⬜；对比度为手工估算未过 axe ⬜；Chrome 之外浏览器未实测 :has()（已有 .is-m 兜底）⬜。
