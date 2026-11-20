import * as THREE from 'three';

/**
 * Texture procedurali generate su canvas: nessun file esterno, nessuna richiesta di rete.
 * Ogni texture è creata una sola volta e condivisa tra tutte le scene.
 */

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache = new Map();
function once(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function dataTexture(c, { repeat = 1, srgb = false } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.needsUpdate = true;
  return t;
}

/** Trama del tessuto (jersey / fleece): usata come bump e roughness map. */
export const weaveTexture = () =>
  once('weave', () => {
    const size = 256;
    const [c, ctx] = canvas(size);
    const img = ctx.createImageData(size, size);
    const r = rng(7);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const wx = Math.sin((x * Math.PI) / 2) * 0.5 + 0.5;
        const wy = Math.sin((y * Math.PI) / 2) * 0.5 + 0.5;
        const weave = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0 ? wx : wy;
        const v = Math.max(0, Math.min(255, (0.5 + 0.3 * weave + r() * 0.22) * 255));
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return dataTexture(c, { repeat: 3 });
  });

/** Coste verticali per colli, polsini e fondi. */
export const ribTexture = () =>
  once('rib', () => {
    const [c, ctx] = canvas(64);
    for (let x = 0; x < 64; x++) {
      const v = Math.round((0.5 + 0.5 * Math.sin((x / 64) * Math.PI * 2 * 8)) * 200 + 30);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, 0, 1, 64);
    }
    return dataTexture(c, { repeat: 15 });
  });

/** Grana della pelle. */
export const leatherTexture = () =>
  once('leather', () => {
    const size = 256;
    const [c, ctx] = canvas(size);
    ctx.fillStyle = '#9a9a9a';
    ctx.fillRect(0, 0, size, size);
    const r = rng(21);
    for (let i = 0; i < 2600; i++) {
      const x = r() * size;
      const y = r() * size;
      const rad = 1 + r() * 3.5;
      const v = Math.round(110 + r() * 110);
      ctx.fillStyle = `rgba(${v},${v},${v},0.55)`;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    return dataTexture(c, { repeat: 4 });
  });

/** Muro di mattoni per la scena urbana (colore). */
export const brickTexture = () =>
  once('brick', () => {
    const [c, ctx] = canvas(512);
    ctx.fillStyle = '#2a2022';
    ctx.fillRect(0, 0, 512, 512);
    const r = rng(3);
    const bw = 64;
    const bh = 28;
    for (let row = 0; row < 512 / bh + 1; row++) {
      const off = row % 2 ? bw / 2 : 0;
      for (let col = -1; col < 512 / bw + 1; col++) {
        const tone = 52 + r() * 34;
        ctx.fillStyle = `rgb(${tone + 18},${tone * 0.62},${tone * 0.55})`;
        ctx.fillRect(col * bw + off + 2, row * bh + 2, bw - 4, bh - 4);
        // macchie e usura
        for (let k = 0; k < 6; k++) {
          ctx.fillStyle = `rgba(0,0,0,${r() * 0.18})`;
          ctx.fillRect(col * bw + off + r() * bw, row * bh + r() * bh, 4 + r() * 10, 2 + r() * 5);
        }
      }
    }
    return dataTexture(c, { repeat: 2, srgb: true });
  });

/** Variazione di rugosità per l'asfalto bagnato (pozzanghere). */
export const wetRoughnessTexture = () =>
  once('wet', () => {
    const [c, ctx] = canvas(512);
    ctx.fillStyle = '#d8d8d8';
    ctx.fillRect(0, 0, 512, 512);
    const r = rng(11);
    for (let i = 0; i < 40; i++) {
      const x = r() * 512;
      const y = r() * 512;
      const rad = 20 + r() * 90;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, 'rgba(20,20,20,0.95)');
      g.addColorStop(1, 'rgba(20,20,20,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    return dataTexture(c, { repeat: 3 });
  });

/** Cielo al tramonto (sfondo della scena urbana). */
export const duskSkyTexture = () =>
  once('sky', () => {
    const [c, ctx] = canvas(4, 512);
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#07061a');
    g.addColorStop(0.38, '#25123f');
    g.addColorStop(0.55, '#6a1f5e');
    g.addColorStop(0.66, '#e8456b');
    g.addColorStop(0.74, '#ff9a5c');
    g.addColorStop(0.8, '#2a1530');
    g.addColorStop(1, '#120a14');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 512);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });

/** Alone morbido (finto bloom) per neon e lampioni. */
export const glowTexture = () =>
  once('glow', () => {
    const [c, ctx] = canvas(128);
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });

/** Ombra a macchia economica per le card 3D. */
export const blobShadowTexture = () =>
  once('blob', () => {
    const [c, ctx] = canvas(128);
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(0,0,0,0.55)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });

/**
 * Pelle con tatuaggi disegnati proceduralmente (rose a spirale, scritte, fasce, dotwork).
 * Mappata sulle capsule di avambracci, mani e collo del personaggio.
 */
export const tattooSkinTexture = (skin = '#a8714f') =>
  once(`tattoo-${skin}`, () => {
    const W = 1024;
    const H = 512;
    const [c, ctx] = canvas(W, H);
    const r = rng(42);
    ctx.fillStyle = skin;
    ctx.fillRect(0, 0, W, H);
    // variazione della pelle
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = `rgba(${r() > 0.5 ? '255,210,190' : '90,40,30'},${r() * 0.05})`;
      ctx.fillRect(r() * W, r() * H, 2 + r() * 8, 2 + r() * 8);
    }
    const ink = (a) => `rgba(18,16,24,${a})`;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // rose a spirale
    const rose = (cx, cy, R) => {
      ctx.strokeStyle = ink(0.88);
      ctx.lineWidth = 3;
      for (let k = 0; k < 7; k++) {
        const rr = R * (0.25 + k * 0.12);
        ctx.beginPath();
        ctx.arc(cx + (r() - 0.5) * 4, cy + (r() - 0.5) * 4, rr, r() * 6, r() * 6 + 4.2);
        ctx.stroke();
      }
      ctx.fillStyle = ink(0.35);
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.28, 0, Math.PI * 2);
      ctx.fill();
      for (let l = 0; l < 3; l++) {
        const a = r() * Math.PI * 2;
        const lx = cx + Math.cos(a) * R * 1.2;
        const ly = cy + Math.sin(a) * R * 1.2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8);
        ctx.quadraticCurveTo(lx + 18, ly - 14, lx + Math.cos(a) * 30, ly + Math.sin(a) * 30);
        ctx.quadraticCurveTo(lx - 14, ly + 18, cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8);
        ctx.fillStyle = ink(0.7);
        ctx.fill();
      }
    };
    // scritta corsiva astratta
    const script = (x, y, len) => {
      ctx.strokeStyle = ink(0.9);
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      let px = x;
      while (px < x + len) {
        const w = 10 + r() * 14;
        ctx.bezierCurveTo(px + w * 0.3, y - 22 * r(), px + w * 0.7, y + 12 * r(), px + w, y + (r() - 0.5) * 6);
        px += w;
      }
      ctx.stroke();
    };
    // fasce geometriche
    const band = (y, h) => {
      ctx.fillStyle = ink(0.9);
      ctx.fillRect(0, y, W, h);
      ctx.fillRect(0, y + h + 8, W, 3);
      for (let x = 0; x < W; x += 26) {
        ctx.beginPath();
        ctx.moveTo(x, y + h + 14);
        ctx.lineTo(x + 13, y + h + 30);
        ctx.lineTo(x + 26, y + h + 14);
        ctx.fill();
      }
    };
    // dotwork / sfumature
    const dots = (cx, cy, R, n) => {
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.pow(r(), 0.6) * R;
        ctx.fillStyle = ink(0.25 + r() * 0.5);
        ctx.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.6, 1.6);
      }
    };
    const star = (cx, cy, R) => {
      ctx.fillStyle = ink(0.92);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 ? R * 0.42 : R;
        ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    };

    band(H - 70, 16);
    rose(180, 170, 64);
    rose(700, 210, 54);
    dots(180, 170, 120, 900);
    dots(700, 210, 100, 700);
    script(340, 120, 260);
    script(360, 330, 220);
    script(820, 380, 160);
    star(520, 230, 24);
    star(940, 120, 18);
    star(80, 360, 16);
    // mandala geometrica
    ctx.strokeStyle = ink(0.8);
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(470, 360);
      ctx.lineTo(470 + Math.cos(a) * 60, 360 + Math.sin(a) * 60);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(470, 360, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(470, 360, 34, 0, Math.PI * 2);
    ctx.stroke();

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.wrapS = THREE.RepeatWrapping;
    return t;
  });

/** Stampa "sole al tramonto" per la t-shirt grafica, rigenerata per ogni combinazione di colori. */
export const sunPrintTexture = (a, b, ink) =>
  once(`sun-${a}-${b}-${ink}`, () => {
    const [c, ctx] = canvas(512);
    const g = ctx.createLinearGradient(0, 60, 0, 452);
    g.addColorStop(0, a);
    g.addColorStop(1, b);
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 196, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    // tagli orizzontali in stile retrò
    for (let i = 0; i < 7; i++) {
      const y = 280 + i * 26;
      ctx.clearRect(0, y, 512, 4 + i * 2.2);
    }
    ctx.restore();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 214, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.fillRect(96, 470, 320, 6);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  });
