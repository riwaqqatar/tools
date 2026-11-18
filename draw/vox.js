/* «حلّ وارسم» — Build mode: Qatar landmarks made of cubes, drawn on a plain canvas (no library).
   Each model is a list of cubes [x, y, z, colour]; y is up. VOX.render() draws them with a turning camera. */
(() => {
  'use strict';
  const C = {
    sand: '#d9b98a', sand2: '#c49a64', sand3: '#e8d3ac', cream: '#f1e6cf', white: '#f8f8f6', grey: '#c9ccd4', dark: '#2a2f3d',
    navy: '#16213d', blue: '#2563EB', blue2: '#4f86f7', sky: '#9cc2ff', yellow: '#ffd23f', orange: '#ff9f1c', maroon: '#8A1538',
    brown: '#8a5a34', brown2: '#6e4526', black: '#1b1b20', sea: '#3d7bd9', sea2: '#6fa0ee', glass: '#2a3f6e',
  };
  function model() {
    const m = new Map();
    const key = (x, y, z) => x + ',' + y + ',' + z;
    return {
      set(x, y, z, c) { x = Math.round(x); y = Math.round(y); z = Math.round(z); if (c) m.set(key(x, y, z), [x, y, z, c]); else m.delete(key(x, y, z)); },
      has(x, y, z) { return m.has(key(x, y, z)); },
      box(x0, y0, z0, x1, y1, z1, c) { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) this.set(x, y, z, typeof c === 'function' ? c(x, y, z) : c); },
      cyl(cx, cz, r, y0, y1, c) { for (let y = y0; y <= y1; y++) { const rr = typeof r === 'function' ? r(y) : r; for (let x = Math.floor(cx - rr); x <= Math.ceil(cx + rr); x++) for (let z = Math.floor(cz - rr); z <= Math.ceil(cz + rr); z++) if ((x - cx) ** 2 + (z - cz) ** 2 <= rr * rr + .3) this.set(x, y, z, typeof c === 'function' ? c(x, y, z, rr) : c); } },
      list() { return [...m.values()]; },
    };
  }

  /* ---------------------------------------------------------------- the models */
  const MODELS = {
    mia() {                       // Museum of Islamic Art: stepped cream blocks, the top cube with its two "eyes"
      const M = model();
      M.box(-13, 0, -13, 13, 0, 13, C.cream);
      M.box(-10, 1, -10, 10, 6, 10, C.sand);
      M.box(-7, 7, -7, 7, 10, 7, C.sand3);
      M.box(-5, 11, -5, 5, 14, 5, C.sand);
      M.box(-3, 15, -3, 3, 21, 3, C.sand3);
      for (let x = -2; x <= 2; x++) if (x !== 0) { M.set(x, 18, 4, C.dark); M.set(x, 19, 4, x === -2 || x === 2 ? null : C.dark); }
      M.set(-2, 18, 4, C.dark); M.set(2, 18, 4, C.dark); M.set(-1, 19, 4, C.dark); M.set(1, 19, 4, C.dark);
      M.box(-1, 1, 11, 1, 4, 11, C.dark); M.set(0, 5, 11, C.dark);                       // arched door
      for (let x = -8; x <= 8; x += 4) M.box(x, 3, 11, x, 4, 11, C.glass);
      for (let i = -12; i <= 12; i += 3) M.set(i, 1, 13, C.blue2);                       // lights along the front
      return M.list();
    },
    torch() {                     // Torch Tower: slim tower, flared top, flame
      const M = model();
      M.cyl(0, 0, 5, 0, 0, C.grey);
      M.cyl(0, 0, y => y < 6 ? 3.2 : y < 22 ? 2.4 : y < 26 ? 2.4 + (y - 22) * .55 : 4.6, 1, 28,
        (x, y) => (y % 9 === 0 || y === 27) ? C.blue : (y > 24 ? C.navy : C.sand3));
      for (let y = 29; y <= 35; y++) { const r = y < 32 ? 3 : 2.6 - (y - 32) * .7; M.cyl(0, 0, Math.max(.5, r), y, y, (x, yy, z) => ((x * 7 + z * 3 + y) % 3 === 0) ? C.yellow : C.orange); }
      return M.list();
    },
    dohatower() {                 // Doha Tower: round tower with the mashrabiya lattice, dome on top
      const M = model();
      M.cyl(0, 0, 7, 0, 0, C.grey);
      M.cyl(0, 0, 5.2, 1, 27, (x, y, z) => {
        const u = Math.round((Math.atan2(z, x) + Math.PI) * 5.2);
        return ((u + y) % 4 === 0 || (u - y + 400) % 4 === 0) ? C.sand3 : C.navy;
      });
      for (let y = 28; y <= 32; y++) M.cyl(0, 0, 5.2 * Math.sqrt(Math.max(0, 1 - ((y - 27) / 5.6) ** 2)), y, y, C.blue);
      M.box(0, 33, 0, 0, 35, 0, C.grey);
      return M.list();
    },
    zubarah() {                   // Al Zubarah Fort: square walls, 3 round towers, 1 tall square tower
      const M = model(), S = 10;
      M.box(-S - 3, 0, -S - 3, S + 3, 0, S + 3, C.sand3);
      for (let x = -S; x <= S; x++) for (let z = -S; z <= S; z++) if (Math.abs(x) === S || Math.abs(z) === S) {
        M.box(x, 1, z, x, 6, z, C.sand); if ((x + z) % 2 === 0) M.set(x, 7, z, C.sand2);
      }
      for (const [cx, cz] of [[-S, -S], [S, -S], [-S, S]]) {
        M.cyl(cx, cz, 2.6, 1, 9, C.sand2);
        for (let a = 0; a < 8; a++) if (a % 2 === 0) M.set(cx + Math.round(Math.cos(a * Math.PI / 4) * 2.6), 10, cz + Math.round(Math.sin(a * Math.PI / 4) * 2.6), C.sand);
      }
      M.box(S - 2, 1, S - 2, S + 2, 12, S + 2, C.sand2);
      for (let x = S - 2; x <= S + 2; x += 2) M.set(x, 13, S + 2, C.sand); for (let z = S - 2; z <= S + 2; z += 2) M.set(S + 2, 13, z, C.sand);
      M.box(S - 1, 8, S + 2, S - 1, 10, S + 2, C.dark); M.box(S + 1, 8, S + 2, S + 1, 10, S + 2, C.dark);
      M.box(-2, 1, S, 2, 4, S, C.dark);                                                    // gate
      for (let x = -7; x <= 7; x += 7) if (x) M.box(x, 4, S, x, 5, S, C.dark);
      return M.list();
    },
    barjeel() {                   // old house with a wind tower (البادجير)
      const M = model();
      M.box(-11, 0, -8, 11, 0, 8, C.sand3);
      M.box(-9, 1, -6, 9, 7, 6, (x) => x > 2 ? C.white : C.sand);
      for (let x = -9; x <= 9; x += 2) { M.set(x, 8, 6, x > 2 ? C.white : C.sand); M.set(x, 8, -6, x > 2 ? C.white : C.sand); }
      M.box(4, 1, 6, 6, 4, 6, C.dark);                                                     // door
      M.set(-6, 4, 6, C.dark); M.set(-3, 4, 6, C.dark);
      M.box(-6, 8, -2, -2, 17, 2, C.sand2);                                                // the tower
      for (const z of [-2, 2]) for (let x = -5; x <= -3; x++) M.box(x, 12, z, x, 16, z, x === -4 ? C.sand2 : C.dark);
      for (const x of [-6, -2]) for (let z = -1; z <= 1; z++) M.box(x, 12, z, x, 16, z, z === 0 ? C.sand2 : C.dark);
      M.box(-7, 18, -3, -1, 18, 3, C.sand);
      return M.list();
    },
    dhow() {                      // pearling dhow on the sea
      const M = model();
      M.box(-15, 0, -8, 15, 0, 8, (x, y, z) => ((x + z * 2) % 7 === 0) ? C.sea2 : C.sea);
      for (let x = -12; x <= 12; x++) {
        const w = Math.max(1, Math.round(4.6 * Math.sqrt(Math.max(0, 1 - (x / 13.5) ** 2))));
        const lift = x > 7 ? Math.round((x - 7) * .8) : x < -9 ? Math.round((-9 - x) * .6) : 0;
        for (let z = -w; z <= w; z++) for (let y = 1; y <= 3 + lift; y++) {
          const edge = Math.abs(z) === w || y === 1;
          if (edge || y === 3 + lift) M.set(x, y, z, y === 3 + lift ? C.brown2 : (y % 2 ? C.brown : C.sand2));
        }
      }
      M.box(1, 4, 0, 1, 22, 0, C.brown2);                                                  // mast
      for (let y = 6; y <= 21; y++) { const t = (y - 6) / 15; const x0 = Math.round(-9 + t * 9), x1 = Math.round(1 + (1 - t) * 8 - 6 * (1 - t) * (1 - t)); for (let x = x0; x <= Math.max(x0, x1); x++) if (x !== 1) M.set(x, y, 0, (y === 12 || y === 13) ? C.blue : C.white); }
      M.box(2, 22, 0, 4, 23, 0, C.maroon);
      return M.list();
    },
    palm() {                      // date palm with dates
      const M = model();
      M.cyl(0, 0, 7, 0, 0, C.sand3);
      for (let y = 1; y <= 17; y++) { const dx = Math.round(Math.sin(y / 6) * 1.2); M.box(dx, y, 0, dx + 1, y, 1, y % 3 === 0 ? C.brown2 : C.brown); }
      const top = 18, cx = Math.round(Math.sin(17 / 6) * 1.2);
      M.box(cx - 1, top, -1, cx + 2, top + 1, 2, C.navy);
      for (let k = 0; k < 8; k++) {
        const a = k * Math.PI / 4 + .2, dx = Math.cos(a), dz = Math.sin(a);
        for (let s = 1; s <= 9; s++) {
          const x = cx + .5 + dx * s, z = .5 + dz * s, y = top + 2 - Math.round(.06 * s * s) + (s < 3 ? 1 : 0);
          M.set(x, y, z, k % 2 ? C.blue : C.navy);
          if (s > 2 && s < 8) { M.set(x - dz, y - 1, z + dx, C.blue2); M.set(x + dz, y - 1, z - dx, C.blue2); }
        }
      }
      for (const [x, z] of [[cx - 1, -2], [cx + 3, 1], [cx, 3]]) M.box(x, top - 3, z, x + 1, top - 1, z, C.yellow);
      return M.list();
    },
    flag() {                      // Qatar flag: 9 white points (3 rows each), maroon fly
      const M = model();
      M.box(-3, 0, -3, 3, 1, 3, C.grey);
      M.box(0, 2, 0, 0, 36, 0, C.yellow); M.box(-1, 37, -1, 1, 38, 1, C.yellow);
      const yTop = 35, rows = 27;
      for (let i = 0; i < rows; i++) {
        const y = yTop - i, tip = (i % 3) === 1;
        const wb = 6 + (tip ? 2 : (i % 3 === 0 ? 0 : 0));
        for (let x = 1; x <= 22; x++) {
          const z = Math.round(1.6 * Math.sin(x / 3.2));
          M.set(x, y, z, x <= wb ? C.white : C.maroon);
        }
      }
      return M.list();
    },
    albayt() {                    // Al Bayt Stadium: a tent with sadu stripes, white roof with the pitch opening
      const M = model(), SX = 13, SZ = 10;
      M.box(-SX - 3, 0, -SZ - 3, SX + 3, 0, SZ + 3, C.sand3);
      const band = y => [C.black, C.white, C.maroon, C.white, C.black, C.sand, C.black, C.white][y % 8];
      for (let x = -SX; x <= SX; x++) for (let z = -SZ; z <= SZ; z++) if (Math.abs(x) === SX || Math.abs(z) === SZ) for (let y = 1; y <= 8; y++) {
        const zig = ((x + z + y * 2) % 6 === 0) && y > 2 && y < 7;
        M.set(x, y, z, zig ? C.maroon : band(y));
      }
      for (let x = -SX; x <= SX; x++) for (let z = -SZ; z <= SZ; z++) {
        const ex = Math.abs(x) / SX, ez = Math.abs(z) / SZ, inner = (x / 8) ** 2 + (z / 5.5) ** 2 < 1;
        const y = 9 + Math.round(2 * Math.max(ex, ez) ** 3) - (Math.abs(x) < 3 || Math.abs(z) < 2 ? 0 : 0);
        if (inner) { M.set(x, 3, z, (x + z) % 2 ? '#3f9a54' : '#4caf62'); continue; }
        M.set(x, y, z, C.white);
      }
      for (const [x, z] of [[-SX, -SZ], [SX, -SZ], [-SX, SZ], [SX, SZ]]) M.box(x, 9, z, x, 13, z, C.white);
      return M.list();
    },
  };

  /* ---------------------------------------------------------------- renderer */
  const LIGHT = { top: 1.0, x: .9, z: .78 };
  function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`; }
  function prep(cubes) {
    let xmin = 1e9, xmax = -1e9, ymin = 1e9, ymax = -1e9, zmin = 1e9, zmax = -1e9;
    for (const [x, y, z] of cubes) { xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); zmin = Math.min(zmin, z); zmax = Math.max(zmax, z); }
    const cx = (xmin + xmax) / 2, cz = (zmin + zmax) / 2, cy = (ymin + ymax) / 2;
    const out = cubes.map(([x, y, z, col]) => ({
      gx: x, gy: y, gz: z, x: x - cx, y: y - ymin, z: z - cz, col,
      sh: { t: shade(col, LIGHT.top), x: shade(col, LIGHT.x), z: shade(col, LIGHT.z), x2: shade(col, LIGHT.x * .92), z2: shade(col, LIGHT.z * .92) },
    }));
    // build order: bottom to top, and inside a layer by angle (so a layer "grows" around)
    out.sort((a, b) => (a.y - b.y) || (Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x)));
    // neighbour index per face (-1 = nothing there). A face shows when its neighbour is not placed YET,
    // so the top of the layer being built always looks solid.
    const at = new Map(out.map((c, i) => [c.gx + ',' + c.gy + ',' + c.gz, i]));
    const nb = (x, y, z) => { const v = at.get(x + ',' + y + ',' + z); return v === undefined ? -1 : v; };
    for (const c of out) c.nb = { t: nb(c.gx, c.gy + 1, c.gz), px: nb(c.gx + 1, c.gy, c.gz), nx: nb(c.gx - 1, c.gy, c.gz), pz: nb(c.gx, c.gy, c.gz + 1), nz: nb(c.gx, c.gy, c.gz - 1) };
    const R = Math.max(xmax - xmin, zmax - zmin) / 2 + 1, H = ymax - ymin + 1;
    return { cubes: out, R, H, cy: cy - ymin };
  }
  // draw: t = time (s); yaw (rad); shown = how many cubes are placed; drop = {from, at} the newest chunk falls in
  function render(ctx, M, o) {
    const { w, h, yaw, shown, dropFrom = shown, dropT = 1, pitch = .55 } = o;
    const span = Math.max(M.R * 2 * 1.05, M.H * Math.cos(pitch) + M.R * 2 * Math.sin(pitch));
    const s = Math.min(w, h) / (span + 4) * (o.zoom || 1), cX = w / 2, cY = h / 2 + (M.H * Math.cos(pitch)) * s / 2 - M.R * Math.sin(pitch) * s * .1;
    const cs = Math.cos(yaw), sn = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const P = (x, y, z) => { const X = x * cs - z * sn, Z = x * sn + z * cs; return [cX + X * s, cY - y * cp * s + Z * sp * s, Z * cp + y * sp]; };
    const list = [];
    const n = Math.min(shown, M.cubes.length);
    const vis = { px: sn > 0, nx: sn < 0, pz: cs > 0, nz: cs < 0 };
    const open = (j) => j < 0 || j >= dropFrom;           // neighbour missing, or still falling in
    for (let i = 0; i < n; i++) {
      const c = M.cubes[i], b = c.nb;
      const o2 = { t: open(b.t), px: vis.px && open(b.px), nx: vis.nx && open(b.nx), pz: vis.pz && open(b.pz), nz: vis.nz && open(b.nz) };
      if (!(o2.t || o2.px || o2.nx || o2.pz || o2.nz) && i < dropFrom) continue;
      c.o = i >= dropFrom ? { t: true, px: vis.px, nx: vis.nx, pz: vis.pz, nz: vis.nz } : o2;
      let y = c.y;
      if (i >= dropFrom) { const k = (i - dropFrom) / Math.max(1, n - dropFrom); const t = Math.min(1, Math.max(0, dropT * 1.6 - k * .6)); if (t <= 0) continue; y += (1 - (1 - (1 - t) ** 3)) * 9; }
      const Zc = (c.x * sn + c.z * cs) * cp + y * sp;
      list.push([Zc, c, y]);
    }
    list.sort((a, b) => a[0] - b[0]);
    ctx.lineJoin = 'round';
    const quad = (a, b, cc, d, fill) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(cc[0], cc[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = fill; ctx.lineWidth = .7; ctx.stroke(); };
    for (const [, c, y] of list) {
      const x0 = c.x - .5, x1 = c.x + .5, z0 = c.z - .5, z1 = c.z + .5, y0 = y - .5, y1 = y + .5, o3 = c.o;
      if (o3.px) quad(P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), c.sh.x);
      if (o3.nx) quad(P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1), P(x0, y1, z0), c.sh.x2);
      if (o3.pz) quad(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1), c.sh.z);
      if (o3.nz) quad(P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0), c.sh.z2);
      if (o3.t) quad(P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1), c.sh.t);
    }
  }
  const cache = {};
  const YAW = { flag: .22, dhow: .45 };                 // models that read best from the front
  window.VOX = {
    ids: Object.keys(MODELS),
    yaw(id) { return YAW[id] ?? .75; },
    get(id) { return cache[id] || (cache[id] = prep(MODELS[id]())); },
    render,
    thumb(id, size, zoom = 1.12) {
      const cv = document.createElement('canvas'); cv.width = cv.height = size; const g = cv.getContext('2d');
      render(g, this.get(id), { w: size, h: size, yaw: this.yaw(id), shown: 1e9, zoom }); return cv;
    },
  };
})();
