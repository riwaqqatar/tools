/* «حلّ وارسم / Solve & Draw» by Riwaq — all questions are made on the device (no AI, no internet, no data saved off the device). */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k, d) { try { const v = localStorage.getItem('solvedraw.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('solvedraw.' + k, JSON.stringify(v)); } catch (e) {} },
};

/* ============================================================ words */
const T = {
  en: {
    navAlbum: 'QATAR ALBUM', navTeach: 'FOR TEACHERS', tag: '™ × RIWAQ × MATHS', h1a: 'SOLVE', h1b: '& DRAW',
    sub: 'SOLVE THE SUM · JOIN THE DOTS · WATCH QATAR APPEAR', go: 'START DRAWING →', goBuild: 'BUILD IN 3D',
    rule: 'DESIGNED BY RIWAQ © 2026  |  FREE · NO SIGN-UP · WORKS OFFLINE', rule2: 'RIWAQ × QATAR × MATHS', ghost: 'QATAR ALBUM',
    small: 'COLLECT THEM ALL', pick: 'PICK A PICTURE', collected: (a, b) => `${a} / ${b} COLLECTED`,
    grades: ['GRADE 1', 'GRADE 2', 'GRADE 3'], gradeShort: g => `GRADE ${g}`, level: l => `LEVEL ${l}`,
    tabDraw: 'SOLVE & DRAW', tabBuild: 'SOLVE & BUILD', dots: n => `${n} DOTS`, steps: n => `${n} STEPS`, isNew: 'NEW',
    qOf: (a, b) => `QUESTION ${a} OF ${b}`, hint: 'PICK THE RIGHT ANSWER · THE LINE MOVES TO THE NEXT DOT', hintB: 'EVERY RIGHT ANSWER ADDS MORE CUBES',
    good: ['Yes!', 'Brilliant!', 'Great job!', 'You got it!', 'Super!', 'Well done!'], start: ["You've got this!", 'Let’s draw!', 'Ready?'], startB: ["You've got this!", 'Let’s build!', 'Ready?'],
    oops: ['Try again!', 'Almost!', 'Not that one!'], look: 'Look for the glowing one!', last: 'Last line… what is it? ✨', lastB: 'Last cubes… ✨',
    howMany: 'How many pearls?',
    doneT: 'YOU DREW IT! 🎉', doneB: 'YOU BUILT IT! 🎉', didYou: 'DID YOU KNOW?', got: (a, b) => `ADDED TO YOUR ALBUM · ${a} / ${b}`,
    next: 'NEXT PICTURE →', again: 'PLAY AGAIN', album: 'ALBUM', right: n => `Yes! ${n} points 👏`,
    teach: `<h3>For teachers</h3>
      <p>Solve &amp; Draw is a free maths game for grades 1–3. Each right answer joins the next dot, and the last dot shows a picture of Qatar with a short fact. In <b>Solve &amp; Build</b>, every right answer adds cubes to a 3D landmark.</p>
      <ul><li><b>Grade 1:</b> add and subtract to 10, then to 20, missing numbers, counting pearls and word problems.</li>
      <li><b>Grade 2:</b> to 100 with tens, carrying and borrowing, three numbers and word problems.</li>
      <li><b>Grade 3:</b> times tables, division, missing factors and word problems.</li></ul>
      <p>The level goes up by itself after 6 right answers in a row. Questions are made on the device, so it works offline on a projector or a class tablet.</p>
      <p>Free · no sign-up · no ads · nothing about the child leaves the device.</p>
      <p><a href="https://riwaqqatar.github.io/tools/draw/hal-warsim.html" download="Solve and Draw.html" style="display:inline-block;margin-top:6px;background:var(--yellow);color:var(--ink);border:4px solid var(--ink);border-radius:999px;padding:10px 20px">⬇ Download the file (works with no internet)</a></p>`,
  },
  ar: {
    navAlbum: 'ألبوم قطر', navTeach: 'للمعلمين', tag: '™ × رِواق × رياضيات', h1a: 'حلّ', h1b: 'وارسم',
    sub: 'حل المسألة… وصّل النقاط… وشوف قطر تطلع قدّامك!', go: 'يلا نرسم ←', goBuild: 'ابنِ بالمكعبات',
    rule: 'صُمّم في رِواق © ٢٠٢٦  |  مجاني • بدون تسجيل • يشتغل بدون نت', rule2: 'رِواق × قطر × رياضيات', ghost: 'ألبوم قطر',
    small: 'اجمعها كلها', pick: 'اختار رسمتك', collected: (a, b) => `جمعت ${a} من ${b}`,
    grades: ['الصف الأول', 'الصف الثاني', 'الصف الثالث'], gradeShort: g => `الصف ${g}`, level: l => `مستوى ${l}`,
    tabDraw: 'حلّ وارسم', tabBuild: 'حلّ وابنِ', dots: n => `${n} نقطة`, steps: n => `${n} خطوة`, isNew: 'جديد',
    qOf: (a, b) => `سؤال ${a} من ${b}`, hint: 'اختار الجواب الصح… والخط يكمل للنقطة الجاية', hintB: 'كل جواب صح يزيد مكعبات',
    good: ['صح!', 'كفو!', 'يا سلام!', 'ممتاز!', 'برافو!', 'عاش!'], start: ['تقدر عليها!', 'يلا نرسم!', 'جاهز؟'], startB: ['تقدر عليها!', 'يلا نبني!', 'جاهز؟'],
    oops: ['حاول مرة ثانية', 'قريب!', 'مب هذا!'], look: 'شوف الجواب اللي ينوّر!', last: 'آخر خط… شنو طلع؟ ✨', lastB: 'آخر مكعبات… ✨',
    howMany: 'كم لولوة؟',
    doneT: 'رسمتها! 🎉', doneB: 'بنيتها! 🎉', didYou: 'تدري؟', got: (a, b) => `انضافت لألبومك • ${a} من ${b}`,
    next: 'الرسمة الجاية ←', again: 'مرة ثانية', album: 'الألبوم', right: n => `صح! ${n} رؤوس 👏`,
    teach: `<h3>للمعلمين</h3>
      <p>«حلّ وارسم» لعبة رياضيات مجانية للصفوف ١–٣. كل جواب صح يوصّل النقطة اللي بعدها، وآخر نقطة تطلّع رسمة من قطر مع معلومة قصيرة. وفي «حلّ وابنِ»، كل جواب صح يزيد مكعبات لين يكتمل معلم من قطر.</p>
      <ul><li><b>الصف الأول:</b> جمع وطرح لين ١٠ ثم ٢٠، العدد الناقص، عدّ اللولو، ومسائل كلامية.</li>
      <li><b>الصف الثاني:</b> لين ١٠٠ بالعشرات، مع الحمل والاستلاف، ثلاث أعداد، ومسائل كلامية.</li>
      <li><b>الصف الثالث:</b> جدول الضرب، القسمة، العامل الناقص، ومسائل كلامية.</li></ul>
      <p>المستوى يرتفع بروحه بعد ٦ أجوبة صح ورا بعض. الأسئلة تنسوّى على الجهاز نفسه، فاللعبة تشتغل بدون نت على البروجكتر أو تابلت الصف.</p>
      <p>مجانية • بدون تسجيل • بدون إعلانات • ولا شي عن الطالب يطلع من الجهاز.</p>
      <p><a href="https://riwaqqatar.github.io/tools/draw/hal-warsim.html" download="حل وارسم.html" style="display:inline-block;margin-top:6px;background:var(--yellow);color:var(--ink);border:4px solid var(--ink);border-radius:999px;padding:10px 20px">⬇ حمّلوا الملف (يشتغل بدون إنترنت)</a></p>`,
  },
};
let lang = store.get('lang', 'en');
let digitsAr = store.get('digitsAr', true);
const t = k => T[lang][k];
const AR = '٠١٢٣٤٥٦٧٨٩';
const N = n => (lang === 'ar' && digitsAr) ? String(n).replace(/\d/g, d => AR[d]) : String(n);
const QM = () => lang === 'ar' ? '؟' : '?';
const nm = p => lang === 'ar' ? p.ar : p.en;

/* ============================================================ questions */
const NAMES = { en: { b: ['Jassim', 'Hamad', 'Saud', 'Ali', 'Khalifa'], g: ['Maryam', 'Noora', 'Lulwa', 'Sheikha', 'Al Anoud'] },
                ar: { b: ['جاسم', 'حمد', 'سعود', 'علي', 'خليفة'], g: ['مريم', 'نورة', 'لولوة', 'شيخة', 'العنود'] } };
const OBJ = [{ s: 'تمرة', p: 'تمرات', e: 'date', ep: 'dates' }, { s: 'لولوة', p: 'لولوات', e: 'pearl', ep: 'pearls' },
             { s: 'قلم', p: 'أقلام', e: 'pencil', ep: 'pencils' }, { s: 'كورة', p: 'كورات', e: 'ball', ep: 'balls' }];
const CA = (n, o) => (n >= 3 && n <= 10) ? `${N(n)} ${o.p}` : `${N(n)} ${o.s}`;      // Arabic counting: 3–10 plural, 11+ singular
const CE = (n, o) => `${n} ${n === 1 ? o.e : o.ep}`;
function person() { const g = Math.random() < .5; return { n: pick(NAMES[lang][g ? 'g' : 'b']), f: g }; }
const ex = (a, op, b, ans, miss) => {
  const s = x => `<span class="qm">${x}</span>`;
  const A = miss === 'a' ? s(QM()) : N(a), B = miss === 'b' ? s(QM()) : N(b), R = (miss === 'r' || !miss) ? s(QM()) : N(ans);
  return `<div class="eq${lang === 'ar' && digitsAr ? ' arabic' : ''}">${A} ${op} ${B} = ${R}</div>`;
};
const ex3 = (a, o1, b, o2, c) => `<div class="eq${lang === 'ar' && digitsAr ? ' arabic' : ''}">${N(a)} ${o1} ${N(b)} ${o2} ${N(c)} = <span class="qm">${QM()}</span></div>`;
const word = (txt, q) => `<div class="word">${txt}<b>${q}</b></div>`;
const W = {
  add(a, b) { const p = person(), o = pick(OBJ);
    return lang === 'ar' ? word(`عند ${p.n} ${CA(a, o)}، ${p.f ? 'واشترت' : 'واشترى'} ${CA(b, o)} بعد.`, `كم صار ${p.f ? 'عندها' : 'عنده'}؟`)
      : word(`${p.n} has ${CE(a, o)} and gets ${b} more.`, 'How many now?'); },
  sub(a, b) { const p = person(), o = pick(OBJ);
    return lang === 'ar' ? word(`عند ${p.n} ${CA(a, o)}، ${p.f ? 'وعطت أختها' : 'وعطى أخوه'} ${CA(b, o)}.`, `كم باقي ${p.f ? 'عندها' : 'عنده'}؟`)
      : word(`${p.n} has ${CE(a, o)} and gives ${b} to ${p.f ? 'her sister' : 'his brother'}.`, 'How many are left?'); },
  mul(a, b) { const p = person(), o = pick(OBJ);
    if (lang === 'ar') { const box = a === 2 ? 'علبتين' : (a <= 10 ? `${N(a)} علب` : `${N(a)} علبة`); return word(`عند ${p.n} ${box}، وفي كل علبة ${CA(b, o)}.`, `كم ${o.s} ${p.f ? 'عندها' : 'عنده'}؟`); }
    return word(`${p.n} has ${a} boxes with ${CE(b, o)} in each box.`, `How many ${o.ep}?`); },
  div(tot, k) { const p = person(), o = pick(OBJ);
    if (lang === 'ar') return word(`عند ${p.n} ${CA(tot, o)}، ${p.f ? 'بتقسمها' : 'بيقسمها'} بالتساوي على ${N(k)} من ${p.f ? 'خواتها' : 'إخوانه'}.`, `كم ${o.s} ${p.f ? 'لكل وحدة' : 'لكل واحد'}؟`);
    return word(`${p.n} shares ${CE(tot, o)} equally with ${k} friends.`, 'How many does each get?'); },
};
function gen(g, L) {
  const r = Math.random();
  if (g === 1) {
    if (L === 1) {
      if (r < .3) { const n = ri(3, 10); return { ans: n, html: `<div class="pearls">${'<i class="pearl"></i>'.repeat(n)}</div><div class="word"><b>${t('howMany')}</b></div>` }; }
      const a = ri(1, 9), b = ri(1, 10 - a); return { ans: a + b, html: ex(a, '+', b) };
    }
    if (L === 2) {
      if (r < .5) { const a = ri(2, 15), b = ri(1, 20 - a); return { ans: a + b, html: ex(a, '+', b) }; }
      const a = ri(5, 20), b = ri(1, a - 1); return { ans: a - b, html: ex(a, '−', b) };
    }
    if (r < .3) { const c = ri(6, 20), a = ri(1, c - 1); return { ans: c - a, html: ex(a, '+', c - a, c, 'b') }; }
    if (r < .45) { const a = ri(8, 20), d = ri(1, a - 2); return { ans: a - d, html: ex(a, '−', a - d, d, 'b') }; }
    if (r < .72) { const a = ri(3, 10), b = ri(3, Math.min(10, 20 - a)); return { ans: a + b, html: W.add(a, b) }; }
    const a = ri(6, 20), b = ri(3, a - 1); return { ans: a - b, html: W.sub(a, b) };
  }
  if (g === 2) {
    if (L === 1) {
      if (r < .3) { const a = ri(1, 8) * 10, b = ri(1, 9 - a / 10) * 10; return { ans: a + b, html: ex(a, '+', b) }; }
      if (r < .65) { const tt = ri(1, 9), u = ri(0, 8), b = ri(1, 9 - u); return { ans: tt * 10 + u + b, html: ex(tt * 10 + u, '+', b) }; }
      const tt = ri(1, 9), u = ri(2, 9), b = ri(1, u); return { ans: tt * 10 + u - b, html: ex(tt * 10 + u, '−', b) };
    }
    if (L === 2) {
      if (r < .5) { let a, b; do { a = ri(11, 79); b = ri(11, 99 - a); } while ((a % 10) + (b % 10) < 10); return { ans: a + b, html: ex(a, '+', b) }; }
      let a, b; do { a = ri(30, 99); b = ri(11, a - 10); } while ((a % 10) >= (b % 10)); return { ans: a - b, html: ex(a, '−', b) };
    }
    if (r < .35) { const c = ri(25, 99), a = ri(10, c - 5); return { ans: c - a, html: ex(a, '+', c - a, c, 'b') }; }
    if (r < .55) { const a = ri(20, 60), b = ri(10, 30), c = ri(5, a + b - 10); return { ans: a + b - c, html: ex3(a, '+', b, '−', c) }; }
    if (r < .8) { const a = ri(11, 45), b = ri(11, 45); return { ans: a + b, html: W.add(a, b) }; }
    const a = ri(30, 90), b = ri(11, a - 5); return { ans: a - b, html: W.sub(a, b) };
  }
  if (L === 1) { const a = pick([2, 3, 4, 5, 10]), b = ri(1, 10); return Math.random() < .5 ? { ans: a * b, html: ex(a, '×', b), f: a } : { ans: a * b, html: ex(b, '×', a), f: a }; }
  if (L === 2) {
    if (r < .6) { const a = ri(2, 10), b = ri(2, 10); return { ans: a * b, html: ex(a, '×', b), f: a }; }
    const b = ri(2, 10), q = ri(2, 10); return { ans: q, html: ex(b * q, '÷', b) };
  }
  if (r < .3) { const a = ri(2, 10), b = ri(2, 10); return { ans: b, html: ex(a, '×', b, a * b, 'b') }; }
  if (r < .5) { const a = ri(2, 9), b = ri(2, 9), c = ri(1, 9); return { ans: a * b + c, html: ex3(a, '×', b, '+', c) }; }
  if (r < .75) { const a = ri(2, 6), b = ri(3, 9); return { ans: a * b, html: W.mul(a, b), f: b }; }
  const k = ri(3, 5), q = ri(3, 9); return { ans: q, html: W.div(k * q, k) };
}
// wrong answers that look right: neighbours, ±10, the next table step
function options(q, g) {
  const n = g === 1 ? 3 : 4, a = q.ans, set = new Set([a]);
  const d = g === 1 ? [1, -1, 2, -2, 3] : g === 2 ? [1, -1, 10, -10, 2, -2, 9, 11] : [1, -1, q.f || 2, -(q.f || 2), 10, 2, -2];
  for (const k of shuffle(d.slice())) { if (set.size >= n) break; const v = a + k; if (v >= 0) set.add(v); }
  let k = 3; while (set.size < n) { set.add(a + k); k++; }
  return shuffle([...set]);
}

/* ============================================================ state */
const PICS = window.PICS, BUILDS = ['mia', 'torch', 'dohatower', 'zubarah', 'barjeel', 'dhow', 'palm', 'flag', 'albayt'];
const byId = id => PICS.find(p => p.id === id);
let grade = store.get('grade', 1), levels = store.get('levels', { 1: 1, 2: 1, 3: 1 }), stars = store.get('stars', {}), sound = store.get('sound', true);
let tab = store.get('tab', 'draw'), pack = 'all';
const SRC = id => (window.IMGDATA && window.IMGDATA[id]) || `img/${id}.webp`;     // the downloadable single file carries its pictures inside
const IMG = {}; const img = id => IMG[id] || (IMG[id] = Object.assign(new Image(), { src: SRC(id) }));
const S = { mode: null, pic: null, fine: [], dots: [], cur: 0, prog: 0, progTo: 0, mistakes: 0, wrongRun: 0, streak: 0, phase: 'idle', t0: 0, q: null, steps: 0, shown: 0, dropFrom: 0, dropT0: 0 };
const cv = $('#cv'), cx = cv.getContext('2d');
let view = { s: 1, ox: 0, oy: 0, dpr: 1, w: 0, h: 0 };
const starKey = (mode, id) => mode + ':' + id;
const totalItems = () => PICS.length + BUILDS.length;
const collected = () => Object.keys(stars).filter(k => stars[k] > 0).length;

/* ============================================================ outline sampling (same idea as v1) */
const svgNS = 'http://www.w3.org/2000/svg';
const svgHost = document.createElementNS(svgNS, 'svg'); svgHost.setAttribute('width', 0); svgHost.setAttribute('height', 0); svgHost.style.position = 'absolute'; document.body.appendChild(svgHost);
function sample(d, n = 1600) {
  const p = document.createElementNS(svgNS, 'path'); p.setAttribute('d', d); svgHost.appendChild(p);
  const L = p.getTotalLength(), out = [];
  for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L * i / n); out.push([q.x, q.y]); }
  svgHost.removeChild(p); return { pts: out, len: L };
}
function chooseDots(fine, want) {
  const n = fine.length - 1, turn = [];
  for (let i = 0; i < n; i++) {
    const a = fine[(i - 8 + n) % n], b = fine[i], c = fine[(i + 8) % n];
    let d = Math.abs(Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(b[1] - a[1], b[0] - a[0])); if (d > Math.PI) d = 2 * Math.PI - d; turn.push(d);
  }
  let corners = [];
  for (let i = 0; i < n; i++) if (turn[i] > .9) { let m = true; for (let k = -18; k <= 18; k++) if (turn[(i + k + n) % n] > turn[i]) m = false; if (m) corners.push(i); }
  // keep only the sharpest corners, at most ~half the dots
  corners = corners.sort((a, b) => turn[b] - turn[a]).slice(0, Math.floor(want / 2)).sort((a, b) => a - b);
  if (!corners.length || corners[0] !== 0) corners.unshift(0);
  const sp = n / want, idx = [];
  for (let k = 0; k < corners.length; k++) {
    const a = corners[k], b = k + 1 < corners.length ? corners[k + 1] : n, parts = Math.max(1, Math.round((b - a) / sp));
    for (let j = 0; j < parts; j++) idx.push(Math.round(a + (b - a) * j / parts));
  }
  // even out: drop dots that sit too close together
  const minGap = n / want * .45, keep = [idx[0]];
  for (const i of idx.slice(1)) if (i - keep[keep.length - 1] >= minGap && n - i >= minGap) keep.push(i);
  return keep;
}

/* ============================================================ layout */
function layout() {
  const r = cv.getBoundingClientRect(); view.dpr = Math.min(2, window.devicePixelRatio || 1);
  view.w = r.width; view.h = r.height; cv.width = Math.round(r.width * view.dpr); cv.height = Math.round(r.height * view.dpr);
  if (S.mode === 'draw' && S.pic) {
    const pts = S.fine.length ? S.fine : sample(window.OUTLINES[S.pic.id], 400).pts;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const m = 70, bw = x1 - x0 + 2 * m, bh = y1 - y0 + 2 * m;
    view.s = Math.min(r.width / bw, r.height / bh) * .92; view.ox = r.width / 2 - (x0 + x1) / 2 * view.s; view.oy = r.height / 2 - (y0 + y1) / 2 * view.s + Math.min(20, r.height * .02);
  }
}
const P2S = (x, y) => [view.ox + x * view.s, view.oy + y * view.s];

/* ============================================================ a round */
const STEPS = { 1: 12, 2: 18, 3: 24 };
function openPlay() { $('#play').classList.remove('hide'); document.body.style.overflow = 'hidden'; }
function startDraw(p) {
  S.mode = 'draw'; S.pic = p; openPlay(); $('#board').classList.remove('vox');
  S.fine = []; layout();
  const sm = sample(window.OUTLINES[p.id]); S.fine = sm.pts; layout();
  const idx = chooseDots(S.fine, STEPS[grade] + 1);
  S.dots = idx.map(i => ({ fi: i, x: S.fine[i][0], y: S.fine[i][1] }));
  S.steps = S.dots.length; // last step closes the shape back to dot 1
  common(); $('#bLab').textContent = `${nm(p)} · ${t('dots')(N(S.dots.length))}`;
}
function startBuild(id) {
  S.mode = 'build'; S.pic = byId(id); openPlay(); $('#board').classList.add('vox'); layout();
  S.model = VOX.get(id); S.steps = STEPS[grade]; S.shown = 0; S.dropFrom = 0; S.dropT0 = performance.now(); S.yaw0 = performance.now();
  common(); $('#bLab').textContent = `${nm(S.pic)} · ${t('steps')(N(S.steps))}`;
}
function common() {
  S.cur = 0; S.prog = S.progTo = 0; S.mistakes = 0; S.wrongRun = 0; S.streak = 0; S.phase = 'play';
  $('#done').classList.add('hide'); $('#pTitle').textContent = nm(S.pic);
  $('#hintt').textContent = S.mode === 'draw' ? t('hint') : t('hintB');
  say(pick(t(S.mode === 'draw' ? 'start' : 'startB'))); updateTop(); nextQ();
}
function nextQ() {
  S.q = gen(grade, levels[grade]);
  $('#qn').textContent = t('qOf')(N(S.cur + 1), N(S.steps));
  $('#qbar').style.width = (S.cur / S.steps * 100) + '%';
  $('#qbody').innerHTML = S.q.html;
  const o = options(S.q, grade), box = $('#ans'); box.className = 'ans' + (o.length === 3 ? ' n3' : ''); box.innerHTML = '';
  for (const v of o) { const b = document.createElement('button'); b.textContent = N(v); b.dataset.v = v; b.onclick = () => answer(b, v); box.appendChild(b); }
}
function answer(btn, v) {
  if (S.phase !== 'play') return;
  initAudio();
  if (v === S.q.ans) {
    beep(true); btn.classList.add('right'); S.wrongRun = 0; S.streak++; S.cur++;
    say(pick(t('good')), true);
    if (S.streak >= 6 && levels[grade] < 3) { levels[grade]++; store.set('levels', levels); S.streak = 0; updateTop(); }
    if (S.mode === 'draw') S.progTo = S.cur >= S.steps ? S.fine.length - 1 : S.dots[S.cur].fi;
    else { S.dropFrom = S.shown; S.shown = Math.round(S.model.cubes.length * S.cur / S.steps); S.dropT0 = performance.now(); }
    $('#qbar').style.width = (S.cur / S.steps * 100) + '%';
    if (S.cur >= S.steps) {
      S.phase = 'closing'; $('#ans').querySelectorAll('button').forEach(b => b.disabled = true);
      $('#qbody').innerHTML = `<div class="word"><b>${S.mode === 'draw' ? t('last') : t('lastB')}</b></div>`;
      if (S.mode === 'build') setTimeout(() => { S.phase = 'reveal'; S.t0 = performance.now(); beepWin(); confetti(); }, 900);
    } else setTimeout(nextQ, 380);
  } else {
    beep(false); btn.classList.add('wrong'); S.mistakes++; S.wrongRun++; S.streak = 0;
    say(S.wrongRun >= 2 ? t('look') : pick(t('oops')));
    if (S.wrongRun >= 2) $('#ans').querySelector(`button[data-v="${S.q.ans}"]`).classList.add('hint');
  }
}
let sayT; function say(txt, hop) {
  const b = $('#bubble'); b.textContent = txt; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  if (hop) { const im = $('#buddyImg'); im.classList.remove('hop'); void im.offsetWidth; im.classList.add('hop'); }
}

/* ============================================================ drawing loop */
function polyTo(upTo) {
  const f = S.fine, n = Math.floor(upTo); if (upTo <= 0) return null;
  const p = new Path2D(); let [x, y] = P2S(...f[0]); p.moveTo(x, y);
  for (let i = 1; i <= n; i++) { [x, y] = P2S(...f[i]); p.lineTo(x, y); }
  const fr = upTo - n; if (fr > 0 && n + 1 < f.length) { const a = f[n], b = f[n + 1]; [x, y] = P2S(a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr); p.lineTo(x, y); }
  return p;
}
function dot(x, y, r, fill, stroke, lw) { cx.beginPath(); cx.arc(x, y, r, 0, 7); if (fill) { cx.fillStyle = fill; cx.fill(); } if (stroke) { cx.strokeStyle = stroke; cx.lineWidth = lw; cx.stroke(); } }
function drawSticker(now, k) {
  const im = img(S.pic.id); if (!im.complete || !im.naturalWidth) return;
  const w = im.naturalWidth, h = im.naturalHeight, sc = 1000 / Math.max(w, h), bw = w * sc, bh = h * sc;
  const x = view.ox + (1000 - bw) / 2 * view.s, y = view.oy + (1000 - bh) / 2 * view.s, W2 = bw * view.s, H2 = bh * view.s;
  const tt = now / 1000, a = S.pic.anim, pop = 1 + .14 * Math.sin(Math.min(1, k) * Math.PI) * (1 - Math.min(1, k));
  cx.save(); cx.globalAlpha = clamp(k * 1.6, 0, 1);
  const cX = x + W2 / 2, cY = y + H2 / 2, live = clamp((now - S.t0 - 900) / 600, 0, 1);
  cx.translate(cX, cY);
  if (a === 'swim') { cx.translate(Math.sin(tt * 1.3) * 10 * live, Math.sin(tt * 2.6) * 7 * live); cx.rotate(Math.sin(tt * 1.3) * .04 * live); }
  else if (a === 'sway') { cx.translate(0, H2 / 2); cx.rotate(Math.sin(tt * 1.6) * .045 * live); cx.translate(0, -H2 / 2); }
  else if (a === 'hop') { const hp = Math.abs(Math.sin(tt * 3.2)); cx.translate(0, -hp * 16 * live); cx.scale(1 + (1 - hp) * .02 * live, 1 - (1 - hp) * .03 * live); }
  else if (a === 'spin') { cx.rotate(tt * 1.6 * live); }
  else if (a === 'steam' || a === 'shine') { const k2 = 1 + Math.sin(tt * 2.2) * .018 * live; cx.scale(k2, k2); }
  cx.scale(pop, pop);
  if (a === 'wave' && live > 0) {
    const strips = 50;
    for (let i = 0; i < strips; i++) { const u0 = i / strips, u1 = (i + 1) / strips, amp = 9 * live * clamp((u0 - .14) / .86, 0, 1);
      cx.drawImage(im, w * u0, 0, w * (u1 - u0) + 1, h, -W2 / 2 + W2 * u0, -H2 / 2 + Math.sin(tt * 3 - u0 * 8) * amp, W2 * (u1 - u0) + 1, H2); }
  } else cx.drawImage(im, -W2 / 2, -H2 / 2, W2, H2);
  cx.restore();
  // little extras: bubbles, steam, sparkles
  if (live > 0) {
    cx.save(); cx.globalAlpha = live;
    if (a === 'swim') for (let i = 0; i < 7; i++) { const ph = (tt * .45 + i / 7) % 1; dot(cX - W2 * .45 + (i * 97 % 100) / 100 * W2 * .9, y + H2 * (1 - ph) , 4 + i % 3 * 3, 'rgba(255,255,255,.0)', 'rgba(37,99,235,.55)', 2.5); }
    if (a === 'steam') for (let i = 0; i < 3; i++) { const ph = (tt * .5 + i / 3) % 1; cx.globalAlpha = live * (1 - ph) * .6; cx.strokeStyle = '#9aa7c2'; cx.lineWidth = 5; cx.lineCap = 'round'; cx.beginPath();
      const sx = cX + (i - 1) * 26; for (let k3 = 0; k3 <= 10; k3++) { const yy = y - 6 - ph * 70 - k3 * 5; const xx = sx + Math.sin(k3 * .8 + tt * 3 + i) * 7; k3 ? cx.lineTo(xx, yy) : cx.moveTo(xx, yy); } cx.stroke(); }
    if (a === 'shine' || a === 'hop' || a === 'sway' || a === 'spin' || a === 'wave') for (let i = 0; i < 5; i++) { const ph = (tt * .7 + i / 5) % 1, s2 = Math.sin(ph * Math.PI) * 14;
      const sx = cX + Math.cos(i * 2.4) * W2 * .55, sy = cY + Math.sin(i * 2.4) * H2 * .5; star4(sx, sy, s2, i % 2 ? '#ffd23f' : '#2563EB'); }
    cx.restore();
  }
}
function star4(x, y, r, col) { if (r <= .5) return; cx.fillStyle = col; cx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .3 : r; cx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } cx.closePath(); cx.fill(); }
function frame(now) {
  requestAnimationFrame(frame); fxFrame(now);
  if (!S.mode || $('#play').classList.contains('hide')) return;
  const c = cx; c.setTransform(view.dpr, 0, 0, view.dpr, 0, 0); c.clearRect(0, 0, view.w, view.h);
  if (S.mode === 'build') return buildFrame(now);
  if (S.prog < S.progTo) S.prog = Math.min(S.progTo, S.prog + Math.max(4, (S.progTo - S.prog) * .1));
  if (S.phase === 'closing' && S.prog >= S.progTo) { S.phase = 'reveal'; S.t0 = now; beepWin(); confetti(); }
  const rev = (S.phase === 'reveal' || S.phase === 'shown') ? (now - S.t0) / 900 : 0;
  if (S.phase === 'reveal' && now - S.t0 > 2900) { S.phase = 'shown'; finish(); }
  const lw = clamp(7 * view.s, 3, 9), br = clamp(Math.min(view.w, view.h) * .016, 6, 11);
  // all dots (faint), the line, then the dots that are done and the next one
  if (rev < 1) {
    c.save(); c.globalAlpha = 1 - clamp(rev, 0, 1);
    for (let j = S.cur + 1; j < S.dots.length; j++) { const [x, y] = P2S(S.dots[j].x, S.dots[j].y); dot(x, y, br * .7, '#c3c8d4'); }
    c.restore();
  }
  const line = polyTo(S.prog);
  if (line) { c.save(); c.globalAlpha = 1 - clamp(rev, 0, 1) * .9; c.lineJoin = c.lineCap = 'round'; c.strokeStyle = '#16213d'; c.lineWidth = lw; c.stroke(line); c.restore(); }
  if (rev > 0) drawSticker(now, rev);
  if (rev < 1) {
    c.save(); c.globalAlpha = 1 - clamp(rev, 0, 1);
    for (let j = 0; j <= Math.min(S.cur, S.dots.length - 1); j++) { const [x, y] = P2S(S.dots[j].x, S.dots[j].y); dot(x, y, br * .8, '#16213d'); }
    if (S.phase === 'play') {
      const nx = S.dots[S.cur + 1] || S.dots[0], [x, y] = P2S(nx.x, nx.y), pu = .5 + .5 * Math.sin(now / 220);
      dot(x, y, br * 2.4 + pu * 5, null, 'rgba(255,210,63,.5)', 3); dot(x, y, br * 1.35, '#fff', '#ffd23f', 6);
    }
    if (S.cur === 0) { const [x, y] = P2S(S.dots[0].x, S.dots[0].y); star4(x, y - br * 3, br * 1.8, '#ffd23f'); }
    c.restore();
  }
}
function buildFrame(now) {
  const M = S.model, tt = (now - S.yaw0) / 1000;
  const spin = S.phase === 'reveal' || S.phase === 'shown' ? (now - S.t0) / 1000 : 0;
  const yaw = VOX.yaw(S.pic.id) + Math.sin(tt * .5) * .18 + spin * 1.1;
  const dropT = clamp((now - S.dropT0) / 650, 0, 1);
  // shadow plate
  cx.save(); cx.fillStyle = 'rgba(22,33,61,.08)'; cx.beginPath(); cx.ellipse(view.w / 2, view.h * .78, view.w * .32, view.h * .07, 0, 0, 7); cx.fill(); cx.restore();
  VOX.render(cx, M, { w: view.w, h: view.h, yaw, shown: S.shown, dropFrom: S.dropFrom, dropT, zoom: .92 });
  if (S.phase === 'reveal' && now - S.t0 > 3200) { S.phase = 'shown'; finish(); }
}

/* ============================================================ the end of a picture */
function finish() {
  const st = S.mistakes <= 1 ? 3 : S.mistakes <= 4 ? 2 : 1, key = starKey(S.mode, S.pic.id);
  stars[key] = Math.max(stars[key] || 0, st); store.set('stars', stars); updateTop(); renderAlbum();
  $('#dKick').textContent = S.mode === 'draw' ? t('doneT') : t('doneB'); $('#dTitle').textContent = nm(S.pic);
  $('#dStars').innerHTML = [0, 1, 2].map(i => `<i>${i < st ? '★' : '☆'}</i>`).join('');
  $('#dFact').textContent = digits(lang === 'ar' ? S.pic.far : S.pic.fen);
  const pic = $('#dPic'); pic.innerHTML = '';
  if (S.mode === 'draw') { const im = new Image(); im.src = SRC(S.pic.id); pic.appendChild(im); }
  else pic.appendChild(VOX.thumb(S.pic.id, 520, .9));
  $('#dGot').textContent = t('got')(N(collected()), N(totalItems()));
  const qz = $('#dQuiz'); qz.innerHTML = '';
  if (S.pic.quiz && S.mode === 'draw') {
    const Q = S.pic.quiz; qz.innerHTML = `<p>${lang === 'ar' ? Q.ar : Q.en}</p><div class="opts">${shuffle(Q.opts.slice()).map(v => `<button data-v="${v}">${N(v)}</button>`).join('')}</div>`;
    qz.querySelectorAll('button').forEach(b => b.onclick = () => {
      if (+b.dataset.v === Q.ans) { beep(true); b.classList.add('right'); qz.querySelector('p').textContent = t('right')(N(Q.ans)); qz.querySelectorAll('button').forEach(x => x.disabled = true); confetti(); }
      else { beep(false); b.classList.add('wrong'); b.disabled = true; }
    });
  }
  $('#dNext').textContent = t('next'); $('#dAgain').textContent = t('again'); $('#dAlbum').textContent = t('album');
  $('#done').classList.remove('hide');
}
const digits = s => (lang === 'ar' && digitsAr) ? s.replace(/\d/g, d => AR[d]) : s;
function nextItem() {
  if (S.mode === 'draw') { const i = PICS.indexOf(S.pic); startDraw(PICS[(i + 1) % PICS.length]); }
  else { const i = BUILDS.indexOf(S.pic.id); startBuild(BUILDS[(i + 1) % BUILDS.length]); }
}
function closePlay() { S.mode = null; S.phase = 'idle'; $('#play').classList.add('hide'); $('#done').classList.add('hide'); document.body.style.overflow = ''; renderAlbum(); }

/* ============================================================ confetti */
const fxc = $('#fx'), fx = fxc.getContext('2d'); let bits = [];
function confetti() {
  const W = innerWidth, H = innerHeight; fxc.width = W * view.dpr || W; fxc.height = H * view.dpr || H;
  const cols = ['#2563EB', '#ffd23f', '#8A1538', '#ffffff', '#16213d', '#ff5a5f'];
  for (let i = 0; i < 160; i++) bits.push({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .45, vx: (Math.random() - .5) * 18, vy: -Math.random() * 18 - 6, r: Math.random() * 7, w: 8 + Math.random() * 8, h: 5 + Math.random() * 6, c: pick(cols), s: Math.random() * .3 - .15 });
}
function fxFrame() {
  if (!bits.length) return; const d = view.dpr || 1; fx.setTransform(d, 0, 0, d, 0, 0); fx.clearRect(0, 0, innerWidth, innerHeight);
  for (const b of bits) { b.vy += .45; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += b.s; fx.save(); fx.translate(b.x, b.y); fx.rotate(b.r); fx.fillStyle = b.c; fx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); fx.restore(); }
  bits = bits.filter(b => b.y < innerHeight + 40);
  if (!bits.length) fx.clearRect(0, 0, innerWidth, innerHeight);
}

/* ============================================================ sound: tiny generated tones */
let AC = null; function initAudio() { if (!AC) try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
function tone(f, t0, d, type = 'sine', v = .1) { if (!sound || !AC) return; const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, AC.currentTime + t0); g.gain.linearRampToValueAtTime(v, AC.currentTime + t0 + .02); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + t0 + d);
  o.connect(g); g.connect(AC.destination); o.start(AC.currentTime + t0); o.stop(AC.currentTime + t0 + d + .05); }
function beep(ok) { ok ? (tone(660, 0, .12), tone(990, .07, .16)) : tone(200, 0, .2, 'triangle', .07); }
function beepWin() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * .1, .32, 'triangle', .09)); }

/* ============================================================ home + album */
function applyLang() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.body.classList.toggle('ar', lang === 'ar');
  document.querySelectorAll('[data-t]').forEach(e => { const v = t(e.dataset.t); if (typeof v === 'string') e.textContent = v; });
  $('#langBtn').innerHTML = lang === 'ar' ? '<span>EN</span><b>ع</b>' : '<b>EN</b><span>ع</span>';
  $('#teachBody').innerHTML = t('teach'); renderAlbum(); updateTop();
}
function renderAlbum() {
  $('#circles').innerHTML = ['falcon', 'dhow', 'dallah', 'oryx', 'mia', 'palm'].map(i => `<span><img src="${SRC(i)}" alt=""></span>`).join('');
  $('#grades').innerHTML = t('grades').map((g, i) => `<button class="pill${grade === i + 1 ? ' on' : ''}" data-g="${i + 1}">${g}</button>`).join('');
  $('#tabs').innerHTML = [['draw', t('tabDraw'), PICS.length], ['build', t('tabBuild'), BUILDS.length]].map(([k, l, n]) => `<button class="pill${tab === k ? ' on' : ''}" data-tab="${k}">${l} <small>${N(n)}</small></button>`).join('');
  $('#packs').innerHTML = tab === 'draw' ? window.PACKS.map(p => `<button class="pill${pack === p.id ? ' on' : ''}" data-pack="${p.id}">${lang === 'ar' ? p.ar : p.en}</button>`).join('') : '';
  const list = tab === 'draw' ? PICS.filter(p => pack === 'all' || p.pack === pack) : BUILDS.map(byId);
  const box = $('#cards'); box.innerHTML = '';
  list.forEach((p, k) => {
    const st = stars[starKey(tab, p.id)] || 0, b = document.createElement('button'); b.className = 'card';
    const num = String((tab === 'draw' ? PICS.indexOf(p) : k) + 1).padStart(2, '0');
    b.innerHTML = `<div class="art c${k % 3 + 1}"><span class="n">${N(num)}</span>${st ? '' : `<span class="badge">${t('isNew')}</span>`}</div>
      <div class="row"><div><div class="nm">${nm(p)}</div><div class="meta lab">${tab === 'draw' ? t('dots')(N(STEPS[grade] + 1)) : t('steps')(N(STEPS[grade]))} · <span style="color:#e0a526">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span></div></div><span class="go">→</span></div>`;
    const art = b.querySelector('.art');
    if (tab === 'draw') { const im = new Image(); im.src = SRC(p.id); im.alt = ''; im.loading = 'lazy'; art.appendChild(im); }
    else { const th = VOX.thumb(p.id, 300); art.appendChild(th); }
    b.onclick = () => { initAudio(); tab === 'draw' ? startDraw(p) : startBuild(p.id); };
    box.appendChild(b);
  });
  const c = collected(), tot = totalItems();
  $('#progBar').style.width = (c / tot * 100) + '%'; $('#progTxt').textContent = t('collected')(N(c), N(tot));
}
function updateTop() {
  const tot = Object.values(stars).reduce((a, b) => a + b, 0);
  $('#pStars').textContent = `★ ${N(tot)}`;
  $('#pLevel').textContent = `${t('gradeShort')(N(grade))} · ${t('level')(N(levels[grade]))}`;
  $('#sndBtn').textContent = sound ? '🔊' : '🔇';
  $('#digBtn').textContent = digitsAr ? '١٢٣' : '123'; $('#digBtn').style.display = lang === 'ar' ? '' : 'none';
}

/* ============================================================ events */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-g]'); if (g) { grade = +g.dataset.g; store.set('grade', grade); renderAlbum(); updateTop(); return; }
  const tb = e.target.closest('[data-tab]'); if (tb) { tab = tb.dataset.tab; store.set('tab', tab); renderAlbum(); return; }
  const pk = e.target.closest('[data-pack]'); if (pk) { pack = pk.dataset.pack; renderAlbum(); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  if (a.dataset.act === 'teach') $('#teach').classList.remove('hide');
  if (a.dataset.act === 'close') $('#teach').classList.add('hide');
  if (a.dataset.act === 'build') { tab = 'build'; store.set('tab', tab); renderAlbum(); $('#album').scrollIntoView(); }
});
$('#teach').addEventListener('click', e => { if (e.target.id === 'teach') $('#teach').classList.add('hide'); });
$('#langBtn').onclick = () => { lang = lang === 'en' ? 'ar' : 'en'; store.set('lang', lang); applyLang(); };
$('#homeBtn').onclick = closePlay; $('#dAlbum').onclick = () => { closePlay(); $('#album').scrollIntoView(); };
$('#dAgain').onclick = () => S.mode === 'draw' ? startDraw(S.pic) : startBuild(S.pic.id);
$('#dNext').onclick = nextItem;
$('#sndBtn').onclick = () => { sound = !sound; store.set('sound', sound); updateTop(); };
$('#digBtn').onclick = () => { digitsAr = !digitsAr; store.set('digitsAr', digitsAr); updateTop(); if (S.phase === 'play') nextQ(); };
addEventListener('resize', () => { if (S.mode) layout(); });
applyLang(); requestAnimationFrame(frame);
window.__SD = { S, start: id => startDraw(byId(id)), setGrade: g => { grade = g; }, right: () => { const b = document.querySelector(`#ans button[data-v="${S.q.ans}"]`); if (b && !b.disabled) b.click(); } };   // for testing
PICS.forEach(p => img(p.id));                              // warm the image cache
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
// test hooks: #draw=falcon&g=2  |  #build=mia  |  #reveal=dhow  |  #lang=ar
(() => { const h = new URLSearchParams(location.hash.slice(1));
  if (h.has('still')) document.body.classList.add('still');
  if (h.get('lang')) { lang = h.get('lang'); applyLang(); }
  if (h.get('g')) grade = +h.get('g');
  if (h.get('draw')) startDraw(byId(h.get('draw')));
  if (h.get('build')) startBuild(h.get('build'));
  if (h.get('reveal')) { startDraw(byId(h.get('reveal'))); S.cur = S.steps; S.prog = S.progTo = S.fine.length - 1; S.phase = 'closing'; }
  if (h.get('at') && S.mode === 'build') { const k = +h.get('at'); S.cur = k; S.shown = S.dropFrom = Math.round(S.model.cubes.length * k / S.steps); nextQ(); }
  else if (h.get('at')) { const k = +h.get('at'); for (let i = 0; i < k; i++) { S.cur++; S.progTo = S.dots[S.cur].fi; } S.prog = S.progTo; nextQ(); }
  if (h.get('done')) { startDraw(byId(h.get('done'))); S.phase = 'shown'; S.cur = S.steps; S.prog = S.progTo = S.fine.length - 1; S.t0 = performance.now() - 5000; finish(); }
  if (h.get('rebuild')) { startBuild(h.get('rebuild')); S.cur = S.steps; S.shown = S.model.cubes.length; S.phase = 'reveal'; S.t0 = performance.now(); }
})();
})();
