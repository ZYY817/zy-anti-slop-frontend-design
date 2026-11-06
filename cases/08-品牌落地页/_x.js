
/* 早挂 .js：reduced-motion 用户不加，隐藏态不生效，杜绝 FOUC 与无 JS 不可见 */
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js')}


(function(){
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 海拔计：按各 data-alt 段顶插值，滚动即下山 ── */
  var marks = Array.prototype.slice.call(document.querySelectorAll('[data-alt]'))
    .map(function(el){ return {y: el.getBoundingClientRect().top + window.scrollY, a: +el.dataset.alt}; })
    .sort(function(a,b){ return a.y - b.y; });
  var cur = document.getElementById('altCur'),
      num = document.getElementById('altNum'),
      numM = document.getElementById('altNumM'),
      shown = marks.length ? marks[0].a : 0,
      target = shown, raf = null, docEnd = 1;

  function altAt(y){
    if (y <= marks[0].y) return marks[0].a;
    for (var i = 0; i < marks.length - 1; i++){
      var m0 = marks[i], m1 = marks[i+1];
      if (y < m1.y){
        var t = (y - m0.y) / Math.max(1, m1.y - m0.y);
        return m0.a + (m1.a - m0.a) * t;
      }
    }
    var last = marks[marks.length-1], endY = docEnd - innerHeight;
    if (last.a > 0 && y > last.y){
      return Math.max(0, last.a * (1 - (y - last.y) / Math.max(1, endY - last.y)));
    }
    return last.a;
  }
  function fmt(v){ return Math.round(v / 10) * 10 >= 1000
      ? (Math.round(v/10)*10).toLocaleString('en-US')
      : String(Math.round(v/10)*10); }
  function frame(){
    shown += (target - shown) * (RM ? 1 : 0.14);
    if (Math.abs(target - shown) < 1) shown = target;
    var t = fmt(shown);
    num.textContent = t; numM.textContent = t;
    /* 读数沿轨滑动：0%→顶 88%→底，对应 2000→0 */
    var span = marks[0].a || 1;
    var p = Math.max(0, Math.min(1, 1 - shown / span));
    cur.style.top = (12 + p * 72) + '%';
    if (shown !== target) raf = requestAnimationFrame(frame); else raf = null;
  }
  function onScroll(){
    docEnd = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    target = altAt(window.scrollY);
    if (raf === null) raf = requestAnimationFrame(frame);
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);
  onScroll(); frame();

  /* ── 雾散：首个视口内滚动，雾层渐薄 ── */
  var fogs = document.querySelectorAll('.fog'), hero = document.getElementById('hero');
  function mist(){
    if (RM) return;
    var p = Math.min(1, window.scrollY / (innerHeight * 0.85));
    for (var i = 0; i < fogs.length; i++){
      fogs[i].style.opacity = String(Math.max(0, 1 - p * (1 + i * 0.25)));
    }
    hero.querySelector('.ridge').style.opacity = String(0.16 + p * 0.2);
  }
  if (!RM) addEventListener('scroll', mist, {passive:true});

  /* ── 入场：IO 只播一次 ── */
  if (!RM && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold: 0.15, rootMargin: '0px 0px -6% 0px'});
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  /* ── 行装：真实的加法与撤销 ── */
  var bag = document.getElementById('bag'), count = 0;
  document.querySelectorAll('[data-add]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var on = btn.classList.toggle('added');
      count += on ? 1 : -1;
      bag.textContent = '行装 · ' + count;
      btn.textContent = on ? '已入行装 — 点击取出' : '装入行装';
      btn.setAttribute('aria-pressed', String(on));
    });
  });
})();
