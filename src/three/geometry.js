import * as THREE from 'three';

const cache = new Map();
/** Le geometrie sono costose da generare: vengono create una volta e condivise da tutte le viste. */
export function cached(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

/**
 * "Gonfia" una silhouette 2D in un volume morbido, come un capo su manichino invisibile.
 * Una griglia fitta viene ritagliata sulla forma; ogni punto interno riceve uno spessore
 * che cresce con la distanza dal bordo (profilo circolare), più eventuali pieghe.
 * Fronte e retro condividono i vertici del bordo, quindi le normali restano continue.
 */
export function inflateShape(shape, { thickness = 0.1, round = 0.12, res = 120, wrinkle = 0, divisions = 360 } = {}) {
  const pts = shape.getSpacedPoints(divisions);
  const n = pts.length;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const pad = 0.01;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;
  const w = maxX - minX;
  const h = maxY - minY;
  const nx = res;
  const ny = Math.max(8, Math.round((res * h) / w));
  const N = (nx + 1) * (ny + 1);

  const front = new Float32Array(N * 3);
  const inside = new Uint8Array(N);
  let insideCount = 0;

  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      const x = minX + (w * i) / nx;
      const y = minY + (h * j) / ny;
      let best = Infinity;
      let bx = x;
      let by = y;
      let ins = false;
      for (let k = 0, l = n - 1; k < n; l = k++) {
        const a = pts[l];
        const b = pts[k];
        if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) ins = !ins;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const L = dx * dx + dy * dy || 1e-9;
        let t = ((x - a.x) * dx + (y - a.y) * dy) / L;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = a.x + dx * t;
        const qy = a.y + dy * t;
        const d = (x - qx) * (x - qx) + (y - qy) * (y - qy);
        if (d < best) {
          best = d;
          bx = qx;
          by = qy;
        }
      }
      const k = j * (nx + 1) + i;
      if (ins) {
        const d = Math.sqrt(best);
        const t = Math.min(d / round, 1);
        const prof = Math.sqrt(1 - (1 - t) * (1 - t));
        let z = thickness * prof;
        if (wrinkle) z += wrinkle * prof * Math.sin(x * 23 + Math.sin(y * 9) * 2) * Math.cos(y * 19 + x * 4);
        front[k * 3] = x;
        front[k * 3 + 1] = y;
        front[k * 3 + 2] = z;
        inside[k] = 1;
        insideCount++;
      } else {
        front[k * 3] = bx;
        front[k * 3 + 1] = by;
        front[k * 3 + 2] = 0;
      }
    }
  }

  const total = N + insideCount;
  const pos = new Float32Array(total * 3);
  const uv = new Float32Array(total * 2);
  const back = new Uint32Array(N);
  pos.set(front);
  let c = N;
  for (let k = 0; k < N; k++) {
    uv[k * 2] = front[k * 3];
    uv[k * 2 + 1] = front[k * 3 + 1];
    if (inside[k]) {
      pos[c * 3] = front[k * 3];
      pos[c * 3 + 1] = front[k * 3 + 1];
      pos[c * 3 + 2] = -front[k * 3 + 2];
      uv[c * 2] = -front[k * 3];
      uv[c * 2 + 1] = front[k * 3 + 1];
      back[k] = c++;
    } else back[k] = k;
  }

  const idx = [];
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      const b = a + 1;
      const d = a + nx + 1;
      const cc = d + 1;
      if (!(inside[a] || inside[b] || inside[cc] || inside[d])) continue;
      idx.push(a, b, cc, a, cc, d);
      idx.push(back[a], back[cc], back[b], back[a], back[d], back[cc]);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

/** Estrusione con smusso, centrata sull'asse Z. */
export function extrude(shape, depth, bevel, curveSegments = 32) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 5,
    curveSegments,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** Tubo lungo una lista di punti (cuciture, lacci, tracolle). */
export function tube(points, radius, segments = 64, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), closed);
  return new THREE.TubeGeometry(curve, segments, radius, 10, closed);
}
