# armed2-trace · 07 设置页生成第二轮（墨迹 Inkwell）

## 实际读的文档（14 项，K 词条按决策点精读）
00-总索引 → AGENTS → Z1、B87、K16、K12、K11、K7、K18、B62(§1-4)、B75(§六表单)、B76、Z3、K10、B82、B44(扫读)+ cases/07 record.md（上轮反哺：重绑定须分发/设备可移除/预览可输入/过修正边界）。R 闸门：工具页视觉非主表达 → 关闭。

## 结构卡（B87）
页型=工具页（即用即走）；叙事=分区归类+搜索捷径，非论证链；区块报岗：顶栏=定向+捷径，侧栏=扶手，各区=深化，同步=信任，存储=收口+危险后置；风险阶梯替代承诺阶梯；证据件=可输入的编辑器实时预览（contenteditable，演示件×1）；承诺阶梯→零成本改动→中成本同步/导出→高成本清空。

## 分组容器岗选择理由（B87§十一 · 本轮核心修正）
按"同屏需要几组"选型：设置页一次看一组 → **卡片分组**（一块一容器，行内细分隔线）。否定上轮台账长滚——台账只在行级同构数据密集时赢；编号节属长卷导览不适用。叠加**单区聚焦**（nav 切换单区显示，搜索时才展开全部命中区），回应上轮用户终审"卡片分组+单区聚焦更符合即用即走"。

## 方向卡（Z1§0）
气质=书房/克制/纸墨；纸 #f4f0e6 + 暖墨 #2a2517，5 色板（松烟/黛蓝/朱砂/藤黄/藕荷）浅深双校；材质=哑光纸+细分隔线；密度序列=顶栏 L3 → 区头呼吸峰 L1.5（"设置"安静区，唯一放开）→ 卡片行 L3~L4 → 页脚 L4；签名母题=方形朱印「墨」×3（顶栏/快捷键区头/页脚）；色相分工 accent=动作·绛=危险专司·朱=印章·藤黄=警告；字阶 宋=表达 Sans=界面 mono=数据；反面=均匀中密/台账再犯/emoji/假控件/裸 i18n key；动效=干脆 productive≤150ms 无回弹。

## K 词条决策点逐项答案
- K·快捷键体系：①输入域挂起裸键，仅修饰组合放行；②一律修饰键（Shift 单独不算）+F 键例外；③保留表=F5/F11/F12/Ctrl+WQTNR/L/D/Tab、Alt+F4/方向/Home、⌘QWmH、meta+, 等；④设置页即速查表+搜索框 kbd hint 随绑定更新；⑤<30 命令不做 ⌘K；⑥**重绑定闭环落实**：idle→listening→bound/conflict|err，全局分发器按新绑定真执行（聚焦搜索/切深浅/折侧栏/立即同步/导出/跳快捷键区），改键后 chip+搜索 hint 全量更新。
- K·搜索触发链：①本地即时+120ms 防抖+最少 1 字；②compositionstart/end 守卫+上屏补发；③本地无竞态；④行级 <mark> 多命中高亮+大小写归一；卡片级 kw 命中保底；无结果→建议 chips+每查询仅一次 toast；Esc 清、Enter 滚至首个 mark。
- K·撤销与破坏：清空=不可逆→原生 dialog+勾选门槛+真实篇数/MB；设备移除=行内两步确认+Toast 撤销（可逆不打断）。
- K·自动保存：onChange 即存 localStorage+顶栏三态；预览输入按所选间隔真实演示"将于 Ns 内保存→已保存"，手动档走 Ctrl+S。
- K·死控件：本机设备移除钮 disabled+title 说明；无零 handler 元素。
- K·异步链：同步按钮 aria-busy+进度条+防重；导出/导入真实 Blob/文件读取；ZIP store+CRC32 手写。
- K·IME：搜索/捕获/预览 Tab/Ctrl+S 全 isComposing 守卫。
- K·状态机：capture/sync/toast 单状态收敛；K·视觉配额：峰值1=呼吸峰、装饰2=分隔线+印章、accent<5；K·职责分工见方向卡；K·动效双轨全 productive；K·破格不适用未用；K·语义色冲突：朱砂与绛接近→危险更深+图标文案冗余。

## Z3/K10 审计实修（本轮 P0/P1）
1. 暗色 --ink-3 卡片底对比 4.42:1 <4.5（P1）→#8d846c→#968d73；全量 26 组色对 python 复算 ≥4.5。
2. 重绑定钮 onclick 与 addEventListener 双挂→点击"Esc 取消"立即重进捕获（P0）→统一 onclick。
3. 捕获态 Esc 后 `capture` 已清空、焦点丢失（P1）→先存 btn 再 endCapture 归还焦点。
4. 搜索 kbd hint `replace('+',' ')` 只换首个（P1）→split/join；空绑定显示 '—'。
5. 移动端 sidenav sticky top:0 被顶栏遮挡导航全灭（P0）→改 static 横滑条。
6. F5/Ctrl+R 等可绑定却触发刷新（P1）→保留表补 f3/f5/f6/f10/f11/f12/ctrl+r/alt+方向等。
7. 无结果 toast 每键一次刷屏（P1）→lastToastQ 每查询一次。
8. 搜索时卡片容器不隐（空卡壳/预览卡搜不到）（P1）→卡片级显隐+预览 data-kw。
9. iOS 搜索框聚焦自动缩放（P2→P1 观感）→移动档 font-size:16px；webkit 原生 × 去重；色板 sname 被 overflow 裁→改上方；色板补方向键；全部 aria-label 接 i18n；nav aria-current；color-mix 回退；dialog 点背板关闭；footStat 随语言。

## 验证
- verify.py：全部通过（reduced-motion ✓ 无死链/缺资源/占位）。
- node --check 语法 OK；i18n 双语键 diff=0、HTML data-i18n 全覆盖、id 无重复、$() 引用全命中。
- http.server 8765 起服 200，浏览器预览已开。
- ⬜ 未验证：无 Playwright/jsdom，真机点击/IME/捕获分发未实跑（逻辑经逐行审查）；剩余 P3：applyLang 会重建 keyList（捕获中切换语言需重开捕获）。
