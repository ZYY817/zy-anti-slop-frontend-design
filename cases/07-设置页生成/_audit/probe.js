const { chromium } = require('C:/Users/v_yuqqisun/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // Q: 搜"快捷"时哪些行命中
  await page.goto('http://localhost:8877/armQ.html', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  await page.evaluate(() => localStorage.clear());
  await page.fill('#search', '快捷');
  await page.waitForTimeout(400);
  const hits = await page.$$eval('.panel [data-kw]', els =>
    els.filter(e => !e.hidden).map(e => ({
      kw: (e.dataset.kw || '').slice(0, 40),
      lab: (e.querySelector('.lab,.dname,.main,.cap') || {}).textContent || e.className
    })));
  console.log('Q "快捷" 命中行数:', hits.length);
  hits.forEach(h => console.log('  -', h.lab.trim().slice(0, 30), '| kw:', h.kw));
  const hiddenRows = await page.$$eval('.panel [data-kw]', els => els.filter(e => e.hidden).length);
  console.log('Q "快捷" 被隐藏行数:', hiddenRows);

  // Q: 字号滑杆延迟复测
  await page.fill('#search', '');
  await page.$eval('#rngSize', e => { e.value = 20; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(400);
  console.log('Q 滑杆后 preview fontSize:', await page.$eval('#pvBody', e => getComputedStyle(e).fontSize));

  // P: 字号滑杆延迟复测
  const p2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await p2.goto('http://localhost:8877/armP.html', { waitUntil: 'load' });
  await p2.waitForTimeout(600);
  await p2.evaluate(() => localStorage.clear());
  await p2.$$eval('#navList .nav-item', els => els.find(e => e.textContent.includes('编辑器')).click());
  await p2.waitForTimeout(300);
  await p2.$eval('#fontSizeRange', e => { e.value = 20; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await p2.waitForTimeout(400);
  console.log('P 滑杆后 preview fontSize:', await p2.$eval('#previewText', e => getComputedStyle(e).fontSize));
  console.log('P 滑杆后 inline style:', await p2.$eval('#previewText', e => e.style.fontSize));

  // P 快捷键: Esc 取消录制
  await p2.$$eval('#navList .nav-item', els => els.find(e => e.textContent.includes('快捷键')).click());
  await p2.waitForTimeout(300);
  await p2.$$eval('#keysList .keycap-btn', els => els[0].click());
  await p2.keyboard.press('Escape');
  await p2.waitForTimeout(200);
  const escK = await p2.$$eval('#keysList .keycap-btn', els => els[0].textContent.replace(/\s+/g, ''));
  console.log('P Esc取消录制后绑定仍:', escK);

  // P: 语言切换英文
  await p2.$$eval('#navList .nav-item', els => els.find(e => e.textContent.includes('通用')).click());
  await p2.$$eval('[data-setting="lang"] .seg-btn', els => els.find(b => b.dataset.value === 'en').click());
  await p2.waitForTimeout(400);
  console.log('P 切英文 h1:', await p2.$eval('.section.active h1', e => e.textContent));
  await p2.screenshot({ path: 'D:\\计划\\zy-anti-slop-frontend-design\\cases\\07-设置页生成\\P-en.png' });

  // 对比度补充: P text-3, Q ink-3, Q hint, Q 顶部版本号
  function lum(rgb) {
    const m = rgb.match(/[\d.]+/g).map(Number);
    const [r, g, b] = m.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const cr = (c1, c2) => { const l1 = lum(c1), l2 = lum(c2); const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1]; return ((a + 0.05) / (b + 0.05)).toFixed(2); };
  const pC = await p2.evaluate(() => ({
    t3: getComputedStyle(document.querySelector('.range-val') || document.body).color,
    bg: getComputedStyle(document.body).backgroundColor,
    cnt: getComputedStyle(document.querySelector('.brand-sub')).color,
  }));
  console.log('P text-3类颜色 on bg:', cr(pC.t3, pC.bg) + ':1');
  const qC = await page.evaluate(() => ({
    ink3: getComputedStyle(document.querySelector('.hint') || document.body).color,
    bg: getComputedStyle(document.body).backgroundColor,
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent'),
    accentInk: getComputedStyle(document.documentElement).getPropertyValue('--accent-ink'),
  }));
  console.log('Q ink-3(hint) on bg:', cr(qC.ink3, qC.bg) + ':1');
  console.log('Q accent-ink on accent:', cr(qC.accentInk, qC.accent) + ':1');
  const pA = await p2.evaluate(() => ({
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent'),
  }));
  console.log('P 白字 on accent:', cr('#ffffff', pA.accent) + ':1');

  // P: reduced-motion 媒体查询是否存在
  const fs = require('fs');
  const srcP = fs.readFileSync('D:\\计划\\zy-anti-slop-frontend-design\\cases\\07-设置页生成\\armP.html', 'utf8');
  const srcQ = fs.readFileSync('D:\\计划\\zy-anti-slop-frontend-design\\cases\\07-设置页生成\\armQ.html', 'utf8');
  console.log('P prefers-reduced-motion:', srcP.includes('prefers-reduced-motion') ? '有' : '无');
  console.log('Q prefers-reduced-motion:', srcQ.includes('prefers-reduced-motion') ? '有' : '无');

  // P: toast 在同步后是否真的出现(重新测,避开旧toast干扰)
  await p2.evaluate(() => localStorage.clear());
  await p2.reload({ waitUntil: 'load' });
  await p2.waitForTimeout(500);
  await p2.$$eval('#navList .nav-item', els => els.find(e => e.textContent.includes('同步')).click());
  await p2.click('#syncNowBtn');
  await p2.waitForTimeout(2000);
  const toastNow = await p2.$$eval('#toasts .toast', els => els.map(e => e.textContent));
  console.log('P 同步后 toast:', JSON.stringify(toastNow));

  // Q: 键帽在 nav 上 Ctrl+K 不执行动作 —— 确认 Q 无动作分派(再看源码确认)
  console.log('Q 是否有绑定动作执行逻辑(搜 keydown 中 kbdMap 查找):', /kbdMap\[.*\]===.*combo|bound.*action|dispatch/i.test(srcQ));
  // 精确点: Q 的全局 keydown 只在 capture!=null 时处理录制; 空闲时仅处理 Esc 清理 -> 确认绑定键无副作用
  const hasDispatch = srcQ.split('addEventListener(\'keydown\'').length > 0 &&
    /if\(!capture\)\{[\s\S]{0,400}?(focus|click|toast|dispatch)/.test(srcQ);
  console.log('Q 空闲态按键是否触发绑定动作:', hasDispatch);

  await browser.close();
})();
