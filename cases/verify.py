#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""cases 真实验证回路 — 静态+无头检查（非代码审查，是真实检查）
用法: python verify.py <file.html>
"""
import io, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

def check(path):
    t = io.open(path, encoding='utf-8').read()
    name = os.path.basename(path)
    issues, warns, oks = [], [], []

    # ── P0 级 ─────────────────────────────────────────
    # 1. 死链/自指锚点
    ids = set(re.findall(r'id=["\']([^"\']+)["\']', t))
    for m in re.finditer(r'href=["\']#([^"\']*)["\']', t):
        a = m.group(1)
        if a == '':
            issues.append(f'href="#" 空锚点（死控件）')
        elif a not in ids:
            issues.append(f'href="#{a}" 指向不存在的锚点')
    # 自指：锚点 href 指向其所在元素自身的 id（点了没反应）
    for m in re.finditer(r'<a[^>]+id=["\']([^"\']+)["\'][^>]*href=["\']#\1["\']', t):
        issues.append(f'元素 id={m.group(1)} 自指死链')

    # 2. 外部资源缺失（downloads/相对路径文件）
    for m in re.finditer(r'(?:href|src)=["\'](?!https?://|data:|mailto:|tel:|#)([^"\']+)["\']', t):
        res = m.group(1).split('?')[0].split('#')[0]
        if res and not os.path.exists(os.path.join(os.path.dirname(path), res)):
            issues.append(f'引用不存在文件: {res}')

    # 3. 交互件真伪：button/a 无 href 无 onclick 无 JS 监听
    bare_btns = len(re.findall(r'<button(?![^>]*(?:onclick|id|class))[^>]*>', t))
    if '<button' in t:
        has_js = re.search(r'<script[^>]*>', t)
        has_details = '<details' in t
        if not has_js and not has_details:
            warns.append('存在 <button> 但页面无任何 <script>/<details>——疑似死控件')

    # ── P1 级 ─────────────────────────────────────────
    # 4. reduced-motion 降级
    if re.search(r'@media[^{]*prefers-reduced-motion', t):
        oks.append('prefers-reduced-motion 降级存在')
    elif re.search(r'animation|transition', t):
        warns.append('有动画但无 prefers-reduced-motion 降级（安全项）')

    # 5. viewport/lang/字符集
    if 'name="viewport"' not in t:
        warns.append('缺 viewport meta')
    if not re.search(r'<html[^>]*lang=', t):
        warns.append('html 无 lang 属性')
    if 'charset' not in t:
        warns.append('缺 charset 声明')

    # 6. lorem/占位内容
    if re.search(r'lorem|ipsum|占位文字|placeholder text', t, re.I):
        warns.append('存在占位文案')

    # 7. 基础对比度快查（body 背景 vs 正文色，粗略）
    mm = re.search(r'body\s*\{[^}]*background[^;:]*:\s*#([0-9a-fA-F]{6})', t)
    cc = re.search(r'body\s*\{[^}]*color:\s*#([0-9a-fA-F]{6})', t)
    if mm and cc:
        def lum(h):
            c = [int(h[i:i+2],16)/255 for i in (0,2,4)]
            c = [x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
            return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
        L1,L2 = sorted([lum(mm.group(1)),lum(cc.group(1))],reverse=True)
        r = (L1+0.05)/(L2+0.05)
        if r < 4.5:
            issues.append(f'body 背景/正文对比度 {r:.1f}:1 < 4.5:1')
        else:
            oks.append(f'body 对比度 {r:.1f}:1 ✓')

    # 8. 年付/月付等切换控件是否有真实处理（针对 pricing 类）
    if re.search(r'(toggle|switch|月付|年付|monthly|yearly)', t, re.I):
        if re.search(r'(monthly|yearly|month|year|annual)', t, re.I) and not re.search(r'<script', t):
            warns.append('疑似计费切换但无 JS——切换可能是摆设')

    # 9. 入场空窗（B44#53 · case08 实证：hero 主张 2.4s 不可见）
    # 粗判：hero/h1/display 相关规则里的 animation-delay + 时长 >1.5s 即命中
    for m in re.finditer(r'([^{}]+)\{([^{}]*animation[^{}]*)\}', t):
        sel, body = m.group(1), m.group(2)
        if not re.search(r'hero|h1|display|claim|headline|title', sel, re.I):
            continue
        delay = max([float(x) for x in re.findall(r'animation-delay:\s*([\d.]+)s', body)] or [0])
        dur = max([float(x) for x in re.findall(r'animation(?:-duration)?:[^;]*?([\d.]+)s', body)] or [0])
        is_claim = re.search(r'h1|display|claim|headline', sel, re.I)
        if is_claim and delay + dur > 1.5:
            issues.append(f'入场空窗嫌疑：{sel.strip()[:40]} 延迟{delay}s+时长{dur}s>1.5s——首屏主张可见过晚')
        elif is_claim and delay + dur > 1.0:
            warns.append(f'入场偏慢：{sel.strip()[:40]} 延迟{delay}s+时长{dur}s——主张文字应 ≤1s 可读')
        elif delay + dur > 2.5:
            warns.append(f'入场过迟：{sel.strip()[:40]} 延迟{delay}s+时长{dur}s——辅助元素勿晚于主张 1s+')

    # 10. 病名快查：字体默认（校准用——brief 指定则豁免）
    if re.search(r"font[^;{]*(?:'|\")?(Inter|Roboto|Helvetica Neue|SF Pro)\b", t) and 'system-ui' not in t:
        warns.append('字体含 Inter/Roboto 系默认——若是 brief 指定忽略本项')

    return name, issues, warns, oks


def shot(paths):
    """截图渲染维：找本机 Chrome/Edge 拍 1440/390 两视口到 _shots/，输出'期望vs实际'模板"""
    import subprocess, shutil
    cands = [
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    ] + [shutil.which(b) for b in ('chrome', 'msedge', 'chromium') if shutil.which(b)]
    exe = next((c for c in cands if c and os.path.exists(c)), None)
    if not exe:
        print('  [shot] 未找到 Chrome/Edge，跳过截图维')
        return
    for p in paths:
        d = os.path.join(os.path.dirname(os.path.abspath(p)), '_shots')
        os.makedirs(d, exist_ok=True)
        base = os.path.splitext(os.path.basename(p))[0]
        uri = 'file:///' + os.path.abspath(p).replace('\\', '/')
        for w in (1440, 390):
            out = os.path.join(d, f'{base}-{w}.png')
            subprocess.run([exe, '--headless', '--disable-gpu', '--hide-scrollbars',
                            f'--window-size={w},900', '--virtual-time-budget=6000',
                            f'--screenshot={out}', uri],
                           capture_output=True, timeout=60)
            print(f'  [shot] {out}' + ('' if os.path.exists(out) else '  ← 未生成'))
    print('''  ┌ 期望 vs 实际（截图自审必填，每条一个 issue）──────────
  │ 1. 期望：______（设计计划里写了什么）
  │    实际：______（截图里看到什么）
  │    处置：修复 / 接受并注明理由
  │ ※ 修完必须复检重拍——没复检不回交付（AUV-Bench 判断-行动鸿沟）
  └──────────────────────────────────────────────''')

if __name__ == '__main__':
    argv = sys.argv[1:]
    do_shot = '--shot' in argv
    paths = [a for a in argv if not a.startswith('--')]
    for p in paths:
        name, issues, warns, oks = check(p)
        print(f'=== {name} ===')
        for x in issues: print(f'  [P0/P1] {x}')
        for x in warns:  print(f'  [P2]    {x}')
        for x in oks:    print(f'  [OK]    {x}')
        if not issues and not warns: print('  全部通过')
        print()
    if do_shot:
        shot(paths)
