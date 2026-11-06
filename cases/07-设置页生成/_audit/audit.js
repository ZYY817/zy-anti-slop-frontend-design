const { chromium } = require('C:/Users/v_yuqqisun/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const CASE = 'D:\\计划\\zy-anti-slop-frontend-design\\cases\\07-设置页生成';
const BASE = 'http://localhost:8877';
const OUT = [];

function log(...a) { const s = a.join(' '); OUT.push(s); console.log(s); }
function lum(rgb) {
  const m = rgb.match(/[\d.]+/g).map(Number);
  const [r, g, b] = m.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(c1, c2) { const l1 = lum(c1), l2 = lum(c2); const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1]; return ((a + 0.05) / (b + 0.05)).toFixed(2); }

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: path.join(CASE, name), ...opts });
  log('  [shot]', name);
}

async function visibleNavCount(page, sel) {
  return page.$$eval(sel, els => els.filter(e => e.offsetParent !== null && e.getBoundingClientRect().width > 0).length);
}

async function auditP(browser) {
  log('\n================ armP ================');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto(BASE + '/armP.html', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(500);

  // --- 桌面首屏 + 分区 ---
  await shot(page, 'P-01-desktop-general.png');
  for (const sec of ['editor', 'appearance', 'sync', 'keys', 'data']) {
    await page.click(`#sec-${sec}`).catch(() => {});
    // P nav items are generated buttons; click via text
  }
  // navigate via nav buttons
  const navTo = async (name) => {
    await page.$$eval('#navList .nav-item', (els, n) => {
      const el = els.find(e => e.textContent.includes(n)); if (el) el.click();
    }, name);
    await page.waitForTimeout(350);
  };
  for (const [sec, label] of [['editor', '编辑器'], ['appearance', '外观'], ['sync', '同步'], ['keys', '快捷键'], ['data', '存储']]) {
    await navTo(label);
    await shot(page, `P-sec-${sec}.png`);
  }
  await navTo('通用');

  // --- 搜索测试 ---
  log('--- P 搜索 ---');
  const navAll = await visibleNavCount(page, '#navList .nav-item');
  log('nav items (无查询):', navAll);
  await page.fill('#searchInput', '快捷');
  await page.waitForTimeout(300);
  const navF = await visibleNavCount(page, '#navList .nav-item');
  const subs = await visibleNavCount(page, '#navList .nav-sub');
  const cntTxt = await page.$eval('#navList .nav-item .cnt', e => e.textContent).catch(() => 'none');
  log(`输入"快捷"后: nav=${navF}, sub项=${subs}, 计数=${cntTxt}`);
  await shot(page, 'P-search-kuaijie.png');
  // 点击子项是否跳转并闪高亮
  await page.$$eval('#navList .nav-sub', els => els[0] && els[0].click());
  await page.waitForTimeout(400);
  const activeSec = await page.$eval('.section.active', e => e.dataset.sec);
  const flash = await page.$eval('.row.flash', e => e.querySelector('.row-label').textContent).catch(() => 'no-flash');
  log('点击搜索子项后 active section:', activeSec, '| flash row:', flash);
  // 清空
  await page.fill('#searchInput', '');
  await page.waitForTimeout(300);
  const navR = await visibleNavCount(page, '#navList .nav-item');
  log('清空后 nav items:', navR, navR === navAll ? 'PASS' : 'FAIL');
  // 无匹配
  await page.fill('#searchInput', 'zzqwx');
  await page.waitForTimeout(300);
  const empty = await page.$eval('#navEmpty', e => ({ hidden: e.hidden, text: e.textContent }));
  log('无匹配空态:', JSON.stringify(empty));
  await page.fill('#searchInput', '');
  await page.waitForTimeout(200);

  // --- 主题/色板/密度 ---
  log('--- P 外观 ---');
  await navTo('外观');
  const bgBefore = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.$$eval('[data-setting="theme"] .seg-btn', els => els.find(b => b.dataset.value === 'dark').click());
  await page.waitForTimeout(400);
  const themeAttr = await page.evaluate(() => document.documentElement.dataset.theme);
  const bgDark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  log(`深色: data-theme=${themeAttr}, bg ${bgBefore} -> ${bgDark}`);
  await shot(page, 'P-dark.png');
  await page.$$eval('[data-setting="theme"] .seg-btn', els => els.find(b => b.dataset.value === 'light').click());
  await page.waitForTimeout(300);
  // 色板
  const accent0 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent'));
  await page.$$eval('.swatch', els => els[2].click()); // cinnabar
  await page.waitForTimeout(200);
  const accent1 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent'));
  log(`accent: "${accent0.trim()}" -> "${accent1.trim()}"`, accent0 !== accent1 ? 'PASS' : 'FAIL');
  // 密度
  const rowH0 = await page.$eval('.section.active .row', e => e.getBoundingClientRect().height);
  await page.$$eval('[data-setting="density"] .seg-btn', els => els.find(b => b.dataset.value === 'compact').click());
  await page.waitForTimeout(250);
  const rowH1 = await page.$eval('.section.active .row', e => e.getBoundingClientRect().height);
  await page.$$eval('[data-setting="density"] .seg-btn', els => els.find(b => b.dataset.value === 'relaxed').click());
  await page.waitForTimeout(250);
  const rowH2 = await page.$eval('.section.active .row', e => e.getBoundingClientRect().height);
  log(`密度行高: standard=${rowH0}px compact=${rowH1}px relaxed=${rowH2}px`, (rowH1 < rowH0 && rowH2 > rowH0) ? 'PASS' : 'FAIL');
  await page.$$eval('[data-setting="density"] .seg-btn', els => els.find(b => b.dataset.value === 'standard').click());

  // --- 控件抽查 ---
  log('--- P 控件 ---');
  await navTo('通用');
  const sw0 = await page.$eval('[data-setting="checkUpdate"]', e => e.getAttribute('aria-checked'));
  await page.click('[data-setting="checkUpdate"]');
  const sw1 = await page.$eval('[data-setting="checkUpdate"]', e => e.getAttribute('aria-checked'));
  log(`开关 checkUpdate: ${sw0} -> ${sw1}`, sw0 !== sw1 ? 'PASS' : 'FAIL');
  await page.selectOption('[data-setting="startup"]', 'daily');
  const stV = await page.$eval('[data-setting="startup"]', e => e.value);
  log(`下拉 startup: ${stV}`, stV === 'daily' ? 'PASS' : 'FAIL');
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('inkwell.prefs')).startup);
  log('localStorage 持久化 startup =', persisted);
  // 编辑器滑杆 + 预览
  await navTo('编辑器');
  const fsBefore = await page.$eval('#previewText', e => getComputedStyle(e).fontSize);
  await page.$eval('#fontSizeRange', e => { e.value = 20; e.dispatchEvent(new Event('input', { bubbles: true })); });
  const fsAfter = await page.$eval('#previewText', e => getComputedStyle(e).fontSize);
  const fsVal = await page.$eval('#fontSizeVal', e => e.textContent);
  log(`字号滑杆: preview ${fsBefore} -> ${fsAfter}, 显示=${fsVal}`, fsBefore !== fsAfter ? 'PASS' : 'FAIL');
  await page.$$eval('[data-setting="lineWidth"] .seg-btn', els => els.find(b => b.dataset.value === 'narrow').click());
  const mw = await page.$eval('#previewText', e => e.style.maxWidth);
  log('行宽 seg -> preview maxWidth:', mw);
  await page.$$eval('[data-setting="lineWidth"] .seg-btn', els => els.find(b => b.dataset.value === 'standard').click());

  // --- 快捷键 ---
  log('--- P 快捷键 ---');
  await navTo('快捷键');
  const keyRows = await page.$$eval('#keysList .keycap-btn', els => els.length);
  const fixedRows = await page.$$eval('#keysList .keycap-static', els => els.length);
  log(`可重绑 ${keyRows} 条, 固定 ${fixedRows} 条`);
  // 录制新绑定: 第2条(newNote) 按 Ctrl+Alt+J
  await page.$$eval('#keysList .keycap-btn', els => els[1].click());
  await page.waitForTimeout(150);
  const rec = await page.$eval('#keysList .keycap-btn.recording', e => e.textContent).catch(() => 'NO-REC');
  log('录制态文案:', rec.trim());
  await page.keyboard.press('Control+Alt+j');
  await page.waitForTimeout(300);
  const bound2 = await page.$$eval('#keysList .keycap-btn', els => els[1].textContent.replace(/\s+/g, ''));
  log('绑定结果(第2条):', bound2, bound2.includes('J') ? 'PASS' : 'FAIL');
  // 冲突: 第3条(search) 按 Ctrl+S (与 save 冲突)
  await page.$$eval('#keysList .keycap-btn', els => els[2].click());
  await page.keyboard.press('Control+s');
  await page.waitForTimeout(300);
  const conflict = await page.$eval('#keysList .row.has-conflict .conflict-msg', e => e.textContent).catch(() => 'NO-CONFLICT');
  const searchStill = await page.$$eval('#keysList .keycap-btn', els => els[2].textContent.replace(/\s+/g, ''));
  log('冲突提示:', conflict, '| search 仍为:', searchStill);
  await shot(page, 'P-key-conflict.png');
  // 绑定真实生效: 按 Ctrl+K 应聚焦搜索框
  await page.keyboard.press('Escape').catch(() => {});
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(200);
  const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
  log('按 Ctrl+K 后焦点:', focused, focused === 'searchInput' ? 'PASS' : 'FAIL');
  // Ctrl+\ 切侧栏
  await page.keyboard.press('Escape');
  await page.keyboard.down('Control'); await page.keyboard.press('Backslash'); await page.keyboard.up('Control');
  await page.waitForTimeout(300);
  const collapsed = await page.$eval('#layout', e => e.classList.contains('sidebar-collapsed'));
  log('按 Ctrl+\\ 侧栏收起:', collapsed ? 'PASS' : 'FAIL');
  await page.keyboard.down('Control'); await page.keyboard.press('Backslash'); await page.keyboard.up('Control');

  // --- 同步 ---
  log('--- P 同步 ---');
  await navTo('同步');
  const devs = await page.$$eval('#deviceList .row', els => els.length);
  log('设备数:', devs);
  await page.click('#syncNowBtn');
  await page.waitForTimeout(250);
  const syncingTxt = await page.$eval('#syncTitle', e => e.textContent);
  const btnDis = await page.$eval('#syncNowBtn', e => e.disabled);
  log(`同步中态: title="${syncingTxt}" btn.disabled=${btnDis}`);
  await shot(page, 'P-syncing.png');
  await page.waitForTimeout(1800);
  const syncDone = await page.$eval('#syncTitle', e => e.textContent);
  const syncSub = await page.$eval('#syncSub', e => e.textContent);
  const toastT = await page.$eval('#toasts .toast', e => e.textContent).catch(() => 'no-toast');
  log(`同步完成: title="${syncDone}" sub="${syncSub}" toast="${toastT}"`);
  // 设备移除
  await page.$$eval('#deviceList .dev-remove', els => els[0] && els[0].click());
  await page.waitForTimeout(200);
  const hasConfirm = await page.$('#deviceList .dev-confirm .yes') !== null;
  log('设备移除二次确认:', hasConfirm ? 'PASS' : 'FAIL');
  await page.$$eval('#deviceList .dev-confirm .no', els => els[0] && els[0].click());
  await page.waitForTimeout(200);
  const devsAfter = await page.$$eval('#deviceList .row', els => els.length);
  log('取消移除后设备数:', devsAfter);
  // e2e 开关
  const e2e0 = await page.$eval('[data-setting="e2e"]', e => e.getAttribute('aria-checked'));
  await page.click('[data-setting="e2e"]');
  const e2e1 = await page.$eval('[data-setting="e2e"]', e => e.getAttribute('aria-checked'));
  log(`e2e 开关: ${e2e0} -> ${e2e1}`, e2e0 !== e2e1 ? 'PASS' : 'FAIL');

  // --- 存储/导出/危险区 ---
  log('--- P 存储 ---');
  await navTo('存储');
  const docs0 = await page.$eval('#statDocs', e => e.textContent);
  // 导出真 zip
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
    page.click('#exportBtn'),
  ]);
  if (dl) {
    const fp = path.join(CASE, '_audit', 'P-export.zip');
    await dl.saveAs(fp);
    const head = fs.readFileSync(fp).slice(0, 4);
    log(`导出: ${dl.suggestedFilename()}, ${fs.statSync(fp).size}B, 魔数=${head.toString('hex')} ${head[0] === 0x50 && head[1] === 0x4b ? '(真ZIP) PASS' : 'FAIL'}`);
  } else log('导出: 无下载 FAIL');
  // 导入
  fs.writeFileSync(path.join(CASE, '_audit', 'imp-test.md'), '# 导入测试\n\nhello inkwell');
  await page.setInputFiles('#fileInput', path.join(CASE, '_audit', 'imp-test.md'));
  await page.waitForTimeout(400);
  const docs1 = await page.$eval('#statDocs', e => e.textContent);
  log(`导入: docs ${docs0} -> ${docs1}`, +docs1 === +docs0 + 1 ? 'PASS' : 'FAIL');
  // 危险区: 先取消
  await page.click('#eraseBtn');
  await page.waitForTimeout(200);
  const modalVis = await page.$eval('#overlay', e => !e.hidden);
  const mBody = await page.$eval('#mBody', e => e.textContent);
  log('模态打开:', modalVis, '| 文案:', mBody.slice(0, 60));
  await shot(page, 'P-modal.png');
  await page.click('#mCancel');
  await page.waitForTimeout(200);
  const modalGone = await page.$eval('#overlay', e => e.hidden);
  const docsCancel = await page.$eval('#statDocs', e => e.textContent);
  log(`取消: 模态关闭=${modalGone}, docs 仍=${docsCancel}`);
  // 真清空
  await page.click('#eraseBtn');
  await page.click('#mConfirm');
  await page.waitForTimeout(400);
  const docs2 = await page.$eval('#statDocs', e => e.textContent);
  const devs2 = await page.$$eval('#deviceList .row', els => els.length).catch(() => '-');
  log(`确认清空: docs=${docs2}`, docs2 === '0' ? 'PASS' : 'FAIL');
  await shot(page, 'P-after-clear.png');

  // 对比度
  const cP = await page.evaluate(() => ({
    desc: [getComputedStyle(document.querySelector('.row-desc') || document.body).color, getComputedStyle(document.body).backgroundColor],
    nav: [getComputedStyle(document.querySelector('#navList .nav-item')).color, getComputedStyle(document.body).backgroundColor],
  }));
  log(`对比度 P: desc ${contrast(cP.desc[0], cP.desc[1])}:1, nav ${contrast(cP.nav[0], cP.nav[1])}:1`);

  // localStorage 持久化验证（theme 早前改过 light/dark）
  const savedPrefs = await page.evaluate(() => localStorage.getItem('inkwell.prefs'));
  log('prefs 持久化存在:', !!savedPrefs);

  log('JS errors:', errors.length ? errors.join(' | ') : 'none');
  await shot(page, 'full-armP.png', { fullPage: true });
  await ctx.close();

  // --- 375 移动 ---
  const mctx = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/armP.html', { waitUntil: 'load' });
  await mp.waitForTimeout(700);
  await shot(mp, 'pw-P-375.png', { fullPage: true });
  const ov = await mp.evaluate(() => ({
    sw: document.documentElement.scrollWidth, iw: window.innerWidth,
    wide: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 5).map(e => e.className + '|' + Math.round(e.getBoundingClientRect().right))
  }));
  log(`P@375: scrollWidth=${ov.sw} innerWidth=${ov.iw} ${ov.sw <= ov.iw ? '无横向溢出 PASS' : '溢出 FAIL -> ' + JSON.stringify(ov.wide)}`);
  // 移动导航是否可操作
  const mNav = await visibleNavCount(mp, '#navList .nav-item');
  await mp.$$eval('#navList .nav-item', els => { const e = els.find(x => x.textContent.includes('快捷')); e && e.click(); });
  await mp.waitForTimeout(300);
  const mSec = await mp.$eval('.section.active', e => e.dataset.sec);
  log(`P@375 横向导航可用: items=${mNav}, 点击"快捷键"后 active=${mSec}`);
  await shot(mp, 'P-375-keys.png');
  // 移动搜索
  await mp.fill('#searchInput', '导出');
  await mp.waitForTimeout(300);
  const mNavF = await visibleNavCount(mp, '#navList .nav-item');
  log(`P@375 搜"导出": nav=${mNavF}`);
  await mctx.close();
}

async function auditQ(browser) {
  log('\n================ armQ ================');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto(BASE + '/armQ.html', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(900);
  const fontStatus = await page.evaluate(() => document.fonts.status);
  log('字体加载状态:', fontStatus);

  await shot(page, 'Q-01-desktop-hero.png');
  await shot(page, 'full-armQ.png', { fullPage: true });
  // 分区滚动截图
  for (const sec of ['editor', 'appearance', 'sync', 'keys', 'data', 'about']) {
    await page.$eval('#sec-' + sec, e => e.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(400);
    await shot(page, `Q-sec-${sec}.png`);
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  // --- 搜索 ---
  log('--- Q 搜索 ---');
  const navAll = await visibleNavCount(page, '#navList .nav-item');
  log('nav items(无查询):', navAll);
  await page.fill('#search', '快捷');
  await page.waitForTimeout(350);
  const navF = await visibleNavCount(page, '#navList .nav-item');
  const hits = await page.$$eval('#navList .nav-item .hit', els => els.map(e => e.textContent));
  const visRows = await page.$$eval('#sec-keys .row', els => els.filter(e => !e.hidden).length);
  const marks = await page.$$eval('mark', els => els.length);
  const meta = await page.$eval('#searchMeta', e => e.textContent);
  log(`输入"快捷": nav=${navF}, hit计数=${JSON.stringify(hits)}, keys区可见行=${visRows}, <mark>=${marks}, meta="${meta}"`);
  await shot(page, 'Q-search-kuaijie.png');
  await page.fill('#search', '');
  await page.waitForTimeout(300);
  const navR = await visibleNavCount(page, '#navList .nav-item');
  const rowsR = await page.$$eval('.panel [data-kw]', els => els.filter(e => !e.hidden).length);
  log(`清空: nav=${navR} (原${navAll}), 可见data-kw行=${rowsR}`, navR === navAll ? 'PASS' : 'FAIL');
  await page.fill('#search', 'zzqwx');
  await page.waitForTimeout(350);
  const emptyShow = await page.$eval('#navEmpty', e => e.classList.contains('show'));
  const sug = await page.$$eval('#navSuggest button', els => els.map(e => e.textContent));
  log(`无匹配: 空态=${emptyShow}, 建议词=${JSON.stringify(sug)}`);
  await shot(page, 'Q-search-empty.png');
  // 建议词可点
  if (sug.length) {
    await page.$$eval('#navSuggest button', els => els[0].click());
    await page.waitForTimeout(300);
    log('点建议词后搜索值:', await page.$eval('#search', e => e.value));
    await page.fill('#search', '');
  }
  await page.fill('#search', '');
  await page.waitForTimeout(200);

  // --- 外观 ---
  log('--- Q 外观 ---');
  const bgBefore = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.$$eval('#segTheme button', els => els.find(b => b.dataset.v === 'dark').click());
  await page.waitForTimeout(400);
  const themeAttr = await page.evaluate(() => document.documentElement.dataset.theme);
  const bgDark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  log(`深色: data-theme=${themeAttr}, bg ${bgBefore} -> ${bgDark}`);
  await shot(page, 'Q-dark.png');
  await page.$$eval('#segTheme button', els => els.find(b => b.dataset.v === 'light').click());
  await page.waitForTimeout(300);
  const acc0 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent'));
  await page.$$eval('.swatch', els => els.find(b => b.dataset.v === 'vermilion').click());
  await page.waitForTimeout(200);
  const acc1 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent'));
  const accAttr = await page.evaluate(() => document.documentElement.dataset.accent);
  log(`accent: "${acc0.trim()}" -> "${acc1.trim()}" (data-accent=${accAttr})`, acc0 !== acc1 ? 'PASS' : 'FAIL');
  const rowH0 = await page.$eval('#sec-general .row', e => e.getBoundingClientRect().height);
  await page.$$eval('#segDensity button', els => els.find(b => b.dataset.v === 'compact').click());
  await page.waitForTimeout(250);
  const rowH1 = await page.$eval('#sec-general .row', e => e.getBoundingClientRect().height);
  await page.$$eval('#segDensity button', els => els.find(b => b.dataset.v === 'comfortable').click());
  await page.waitForTimeout(250);
  const rowH2 = await page.$eval('#sec-general .row', e => e.getBoundingClientRect().height);
  log(`密度行高: default=${rowH0}px compact=${rowH1}px comfortable=${rowH2}px`, (rowH1 < rowH0 && rowH2 > rowH0) ? 'PASS' : 'FAIL');
  await page.$$eval('#segDensity button', els => els.find(b => b.dataset.v === 'default').click());

  // --- 控件抽查 ---
  log('--- Q 控件 ---');
  const e2e0 = await page.$eval('#swE2e', e => e.getAttribute('aria-checked'));
  const e2eDesc0 = await page.$eval('#e2eDesc', e => e.textContent);
  await page.click('#swE2e');
  await page.waitForTimeout(200);
  const e2e1 = await page.$eval('#swE2e', e => e.getAttribute('aria-checked'));
  const e2eDesc1 = await page.$eval('#e2eDesc', e => e.textContent);
  log(`e2e: ${e2e0}->${e2e1}, desc "${e2eDesc0.slice(0, 18)}…" -> "${e2eDesc1.slice(0, 18)}…"`, e2e0 !== e2e1 ? 'PASS' : 'FAIL');
  await page.click('#swE2e'); // 开回
  const swType0 = await page.$eval('#swType', e => e.getAttribute('aria-checked'));
  await page.click('#swType');
  const swType1 = await page.$eval('#swType', e => e.getAttribute('aria-checked'));
  const curLine = await page.$eval('#pvCur', e => e.classList.contains('cur-line'));
  log(`打字机开关: ${swType0}->${swType1}, 预览高亮行=${curLine}`, swType0 !== swType1 ? 'PASS' : 'FAIL');
  await page.selectOption('#selBoot', 'lib');
  const bootHint = await page.$eval('#bootHint', e => e.textContent);
  log(`启动行为 select: hint="${bootHint}"`, bootHint.includes('文稿库') ? 'PASS' : 'FAIL');
  const fsB = await page.$eval('#pvBody', e => getComputedStyle(e).fontSize);
  await page.$eval('#rngSize', e => { e.value = 20; e.dispatchEvent(new Event('input', { bubbles: true })); });
  const fsA = await page.$eval('#pvBody', e => getComputedStyle(e).fontSize);
  const pvCfg = await page.$eval('#pvCfg', e => e.textContent);
  log(`字号滑杆: preview ${fsB}->${fsA}, cfg="${pvCfg}"`, fsB !== fsA ? 'PASS' : 'FAIL');

  // --- 快捷键 ---
  log('--- Q 快捷键 ---');
  const kbdRows = await page.$$eval('.kbd-row', els => els.length);
  const rebinds = await page.$$eval('.kbd-row .rebind', els => els.length);
  log(`快捷键行 ${kbdRows}, 可重绑 ${rebinds}`);
  // 录制: 第1条(new) 按 Ctrl+Alt+J
  await page.$$eval('.kbd-row .rebind', els => els[0].click());
  await page.waitForTimeout(200);
  const listening = await page.$eval('.kbd-row.listening .kbd-capture', e => e.textContent.trim()).catch(() => 'NO-LISTEN');
  log('录制态:', listening.slice(0, 50));
  await page.keyboard.press('Control+Alt+j');
  await page.waitForTimeout(350);
  const k0 = await page.$eval('.kbd-row[data-kid="new"] kbd', e => e.textContent);
  log('绑定结果(new):', k0, k0.includes('J') ? 'PASS' : 'FAIL');
  // 无修饰键拒绝: save 按 S
  await page.$eval('.kbd-row[data-kid="save"] .rebind', e => e.click());
  await page.keyboard.press('s');
  await page.waitForTimeout(250);
  const errTxt = await page.$eval('.kbd-row.keyerr .kbd-err', e => e.textContent).catch(() => 'NO-ERR');
  const saveK = await page.$eval('.kbd-row[data-kid="save"] kbd', e => e.textContent);
  log(`无修饰键: err="${errTxt}" save仍=${saveK}`);
  // 保留键: find 按 Ctrl+W
  await page.$eval('.kbd-row[data-kid="find"] .rebind', e => e.click());
  await page.keyboard.press('Control+w');
  await page.waitForTimeout(250);
  const errTxt2 = await page.$eval('.kbd-row.keyerr .kbd-err', e => e.textContent).catch(() => 'NO-ERR');
  log(`保留键 Ctrl+W: err="${errTxt2}"`);
  // 冲突: side 按 Ctrl+N (与 new 已被改为 Ctrl+Alt+J, 故与 save? 不—save是Ctrl+S) -> 用 Ctrl+Shift+F 与 find 冲突
  await page.$eval('.kbd-row[data-kid="side"] .rebind', e => e.click());
  await page.keyboard.press('Control+Shift+f');
  await page.waitForTimeout(300);
  const cf = await page.$eval('.kbd-row.conflict .kbd-conflict', e => e.textContent.trim()).catch(() => 'NO-CONFLICT');
  log('冲突二次确认:', cf.slice(0, 80));
  await shot(page, 'Q-key-conflict.png');
  // 点替换
  await page.$eval('[data-cf="replace"]', e => e.click());
  await page.waitForTimeout(300);
  const sideK = await page.$eval('.kbd-row[data-kid="side"] kbd', e => e.textContent);
  const findK = await page.$eval('.kbd-row[data-kid="find"] kbd', e => e.textContent);
  log(`替换后: side=${sideK}, find=${findK} (find应变为未绑定)`);
  // 恢复默认
  await page.click('#btnKbdReset');
  await page.waitForTimeout(300);
  const newK = await page.$eval('.kbd-row[data-kid="new"] kbd', e => e.textContent);
  log('恢复默认后 new:', newK);
  // 绑定的键在页面上是否有实际作用?
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(200);
  const activeEl = await page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.tagName));
  log('按 Ctrl+K(命令面板绑定) 后焦点:', activeEl, '(绑定是否真执行动作)');

  // --- 同步 ---
  log('--- Q 同步 ---');
  const devs = await page.$$eval('#devList .device', els => els.length);
  log('设备数:', devs);
  const subB = await page.$eval('#syncSub', e => e.textContent);
  await page.click('#btnSync');
  await page.waitForTimeout(300);
  const sMain = await page.$eval('#syncMain', e => e.textContent);
  const sDis = await page.$eval('#btnSync', e => e.disabled);
  const dot = await page.$eval('#syncDot', e => e.className);
  log(`同步中: main="${sMain}" disabled=${sDis} dot="${dot}"`);
  await shot(page, 'Q-syncing.png');
  await page.waitForTimeout(1600);
  const sMain2 = await page.$eval('#syncMain', e => e.textContent);
  const subA = await page.$eval('#syncSub', e => e.textContent);
  const devAgo = await page.$$eval('#devList .dstate', els => els.map(e => e.textContent));
  log(`同步完成: main="${sMain2}" sub "${subB}" -> "${subA}", 设备态=${JSON.stringify(devAgo)}`);

  // --- 存储/导出/危险区 ---
  log('--- Q 存储 ---');
  const docs0 = await page.$eval('#stDocs', e => e.textContent);
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
    page.click('#btnExport'),
  ]);
  if (dl) {
    const fp = path.join(CASE, '_audit', 'Q-export.zip');
    await dl.saveAs(fp);
    const head = fs.readFileSync(fp).slice(0, 4);
    log(`导出: ${dl.suggestedFilename()}, ${fs.statSync(fp).size}B, 魔数=${head.toString('hex')} ${head[0] === 0x50 ? '(真ZIP) PASS' : 'FAIL'}`);
  } else log('导出: 无下载 FAIL');
  await page.setInputFiles('#fileImp', path.join(CASE, '_audit', 'imp-test.md'));
  await page.waitForTimeout(400);
  const docs1 = await page.$eval('#stDocs', e => e.textContent);
  log(`导入: docs ${docs0} -> ${docs1}`);
  // 危险区: dialog + checkbox 门槛
  await page.$eval('#sec-data', e => e.scrollIntoView());
  await page.click('#btnClear');
  await page.waitForTimeout(300);
  const dlgOpen = await page.$eval('#dlgClear', e => e.open);
  const okDis = await page.$eval('#dlgOk', e => e.disabled);
  const dlgTxt = await page.$eval('#dlgD', e => e.textContent);
  log(`dialog.open=${dlgOpen}, 确认钮disabled=${okDis} (需勾选)`, );
  log('dialog 文案:', dlgTxt.slice(0, 70));
  await shot(page, 'Q-modal.png');
  await page.click('#dlgCancel');
  await page.waitForTimeout(200);
  const dlgClosed = await page.$eval('#dlgClear', e => !e.open);
  const docsC = await page.$eval('#stDocs', e => e.textContent);
  log(`取消: closed=${dlgClosed}, docs仍=${docsC}`);
  // 不勾选点确认(应无效) -> 重开后勾选再确认
  await page.click('#btnClear');
  await page.waitForTimeout(200);
  await page.$eval('#dlgOk', e => e.click()); // disabled，应无效
  const docsStill = await page.$eval('#stDocs', e => e.textContent);
  await page.check('#dlgChk');
  await page.waitForTimeout(150);
  const okEn = await page.$eval('#dlgOk', e => !e.disabled);
  await page.click('#dlgOk');
  await page.waitForTimeout(1300);
  const docs2 = await page.$eval('#stDocs', e => e.textContent);
  log(`门槛: 未勾选点确认后docs=${docsStill}; 勾选后确认可点=${okEn}; 清空后docs=${docs2}`);

  // 关于区按钮
  await page.click('#btnUpdate');
  await page.waitForTimeout(200);
  const tUpd = await page.$eval('#toasts .toast', e => e.textContent).catch(() => 'no-toast');
  log('检查更新 toast:', tUpd);
  const [dl2] = await Promise.all([
    page.waitForEvent('download', { timeout: 4000 }).catch(() => null),
    page.click('#btnDiag'),
  ]);
  log('诊断日志下载:', dl2 ? dl2.suggestedFilename() : '无 FAIL');

  // 语言切换
  await page.selectOption('#selLang', 'en');
  await page.waitForTimeout(400);
  const h1 = await page.$eval('.peak h1', e => e.textContent);
  const nav1 = await page.$eval('#navList .nav-item', e => e.textContent);
  log(`切英文: h1="${h1}" nav1="${nav1}"`, h1 === 'Settings' ? 'PASS' : 'FAIL');
  await shot(page, 'Q-en.png');
  await page.selectOption('#selLang', 'zh');
  await page.waitForTimeout(300);

  // 锚点/链接
  const links = await page.$$eval('a[href]', els => els.map(e => e.getAttribute('href')));
  log('页面链接:', JSON.stringify(links));
  const topExists = await page.$('#top') !== null;
  log('#top 锚点目标存在:', topExists);

  // scrollspy
  await page.$eval('#sec-keys', e => e.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(600);
  const spyActive = await page.$eval('#navList .nav-item.active', e => e.dataset.sec);
  log('滚动到 keys 后 scrollspy active =', spyActive, spyActive === 'keys' ? 'PASS' : 'FAIL');

  // 对比度
  const cQ = await page.evaluate(() => ({
    desc: [getComputedStyle(document.querySelector('#sec-general .desc')).color, getComputedStyle(document.body).backgroundColor],
    nav: [getComputedStyle(document.querySelector('#navList .nav-item')).color, getComputedStyle(document.body).backgroundColor],
    hint: [getComputedStyle(document.querySelector('.keys-note')).color, getComputedStyle(document.body).backgroundColor],
  }));
  log(`对比度 Q: desc ${contrast(cQ.desc[0], cQ.desc[1])}:1, nav ${contrast(cQ.nav[0], cQ.nav[1])}:1, note ${contrast(cQ.hint[0], cQ.hint[1])}:1`);

  // 保存指示状态流转
  const st = await page.$eval('#saveState', e => e.dataset.st);
  log('save-state 当前:', st);

  log('JS errors:', errors.length ? errors.join(' | ') : 'none');
  await ctx.close();

  // --- 375 移动 ---
  const mctx = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/armQ.html', { waitUntil: 'load' });
  await mp.waitForTimeout(1200);
  await shot(mp, 'pw-Q-375.png', { fullPage: true });
  const ov = await mp.evaluate(() => ({
    sw: document.documentElement.scrollWidth, iw: window.innerWidth,
    wide: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 6).map(e => (e.id ? '#' + e.id : e.className) + '|' + Math.round(e.getBoundingClientRect().right))
  }));
  log(`Q@375: scrollWidth=${ov.sw} innerWidth=${ov.iw} ${ov.sw <= ov.iw ? '无横向溢出 PASS' : '溢出 FAIL -> ' + JSON.stringify(ov.wide)}`);
  // 移动: 紧凑密度是否被钳制(触屏)
  await mp.$$eval('#segDensity button', els => els.find(b => b.dataset.v === 'compact').click());
  await mp.waitForTimeout(250);
  const dAttr = await mp.evaluate(() => document.documentElement.dataset.density);
  log(`Q@375 触屏点"紧凑"后 density=${dAttr} (应被钳为 default)`);
  // 移动导航点击
  await mp.$$eval('#navList .nav-item', els => { const e = els.find(x => x.dataset.sec === 'keys'); e && e.click(); });
  await mp.waitForTimeout(500);
  const mActive = await mp.$eval('#navList .nav-item.active', e => e.dataset.sec);
  log('Q@375 导航点击后 active:', mActive);
  await shot(mp, 'Q-375-keys.png');
  // 移动搜索
  await mp.fill('#search', '导出');
  await mp.waitForTimeout(350);
  const mNavF = await visibleNavCount(mp, '#navList .nav-item');
  log(`Q@375 搜"导出": nav=${mNavF}`);
  await mctx.close();

  // --- reduced-motion 模拟 ---
  const rctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const rp = await rctx.newPage();
  await rp.goto(BASE + '/armQ.html', { waitUntil: 'load' });
  await rp.waitForTimeout(400);
  const peakOp = await rp.$eval('.peak', e => getComputedStyle(e).opacity);
  log(`Q reduced-motion 下 .peak opacity=${peakOp} (入场编排应跳过=1)`);
  await rctx.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await auditP(browser);
    await auditQ(browser);
  } catch (e) {
    log('FATAL:', e.stack);
  }
  await browser.close();
  fs.writeFileSync(path.join(CASE, '_audit', 'audit-log.txt'), OUT.join('\n'));
  console.log('\nDONE -> _audit/audit-log.txt');
})();
