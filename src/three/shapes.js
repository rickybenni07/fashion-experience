import * as THREE from 'three';

/** Silhouette 2D dei capi (unità ≈ metri, centrate sull'origine). */

export function teeShape(w = 1) {
  const s = new THREE.Shape();
  s.moveTo(-0.12, 0.4);
  s.lineTo(-0.3 * w, 0.36);
  s.quadraticCurveTo(-0.38 * w, 0.33, -0.52 * w, 0.17);
  s.lineTo(-0.42 * w, 0.07);
  s.quadraticCurveTo(-0.33 * w, 0.13, -0.27 * w, 0.15);
  s.quadraticCurveTo(-0.28 * w, -0.1, -0.28 * w, -0.4);
  s.quadraticCurveTo(0, -0.42, 0.28 * w, -0.4);
  s.quadraticCurveTo(0.28 * w, -0.1, 0.27 * w, 0.15);
  s.quadraticCurveTo(0.33 * w, 0.13, 0.42 * w, 0.07);
  s.lineTo(0.52 * w, 0.17);
  s.quadraticCurveTo(0.38 * w, 0.33, 0.3 * w, 0.36);
  s.lineTo(0.12, 0.4);
  s.quadraticCurveTo(0, 0.31, -0.12, 0.4);
  return s;
}

export function longSleeveShape(w = 1) {
  const s = new THREE.Shape();
  s.moveTo(-0.12, 0.41);
  s.lineTo(-0.3 * w, 0.37);
  s.quadraticCurveTo(-0.43 * w, 0.33, -0.48 * w, 0.14);
  s.lineTo(-0.6 * w, -0.3);
  s.lineTo(-0.48 * w, -0.35);
  s.lineTo(-0.3 * w, 0.06);
  s.lineTo(-0.3 * w, -0.4);
  s.quadraticCurveTo(0, -0.42, 0.3 * w, -0.4);
  s.lineTo(0.3 * w, 0.06);
  s.lineTo(0.48 * w, -0.35);
  s.lineTo(0.6 * w, -0.3);
  s.lineTo(0.48 * w, 0.14);
  s.quadraticCurveTo(0.43 * w, 0.33, 0.3 * w, 0.37);
  s.lineTo(0.12, 0.41);
  s.quadraticCurveTo(0, 0.33, -0.12, 0.41);
  return s;
}

export function hoodShape(scale = 1) {
  const s = new THREE.Shape();
  const k = scale;
  s.moveTo(-0.18 * k, 0);
  s.quadraticCurveTo(-0.21 * k, 0.3 * k, 0, 0.32 * k);
  s.quadraticCurveTo(0.21 * k, 0.3 * k, 0.18 * k, 0);
  s.quadraticCurveTo(0, -0.07 * k, -0.18 * k, 0);
  return s;
}

export function pantsShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.24, 0.45);
  s.lineTo(0.24, 0.45);
  s.quadraticCurveTo(0.28, 0.0, 0.26, -0.55);
  s.lineTo(0.055, -0.55);
  s.quadraticCurveTo(0.035, -0.1, 0, 0.08);
  s.quadraticCurveTo(-0.035, -0.1, -0.055, -0.55);
  s.lineTo(-0.26, -0.55);
  s.quadraticCurveTo(-0.28, 0.0, -0.24, 0.45);
  return s;
}

export function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function trapezoid(top, bottom, h) {
  const s = new THREE.Shape();
  s.moveTo(-bottom / 2, -h / 2);
  s.lineTo(bottom / 2, -h / 2);
  s.quadraticCurveTo(bottom / 2 - 0.01, 0, top / 2, h / 2);
  s.lineTo(-top / 2, h / 2);
  s.quadraticCurveTo(-bottom / 2 + 0.01, 0, -bottom / 2, -h / 2);
  return s;
}

/** Impronta della suola vista dall'alto: x = lunghezza, y = larghezza. */
export function footprintShape(scale = 1) {
  const k = scale;
  const s = new THREE.Shape();
  s.moveTo(-0.158 * k, 0);
  s.bezierCurveTo(-0.158 * k, 0.05 * k, -0.09 * k, 0.055 * k, 0, 0.058 * k);
  s.bezierCurveTo(0.09 * k, 0.062 * k, 0.16 * k, 0.05 * k, 0.16 * k, 0);
  s.bezierCurveTo(0.16 * k, -0.05 * k, 0.09 * k, -0.058 * k, 0, -0.052 * k);
  s.bezierCurveTo(-0.09 * k, -0.05 * k, -0.158 * k, -0.05 * k, -0.158 * k, 0);
  return s;
}

/** Visiera del cappello (verrà ruotata in orizzontale). */
export function brimShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.14, 0.085);
  s.bezierCurveTo(-0.155, 0.28, 0.155, 0.28, 0.14, 0.085);
  s.quadraticCurveTo(0, 0.225, -0.14, 0.085);
  return s;
}

export function polygonShape(sides, r, rotation = Math.PI / sides) {
  const s = new THREE.Shape();
  for (let i = 0; i <= sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return s;
}
