import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { cached, extrude, tube } from '../geometry.js';
import { footprintShape } from '../shapes.js';
import { useMaterial } from '../materials.js';

/** Profilo della tomaia: altezza (h) e larghezza (w) in funzione della posizione lungo la scarpa (x ∈ [-1,1]). */
const profile = (style) => ({
  h: (x) => (style === 'court' ? 0.062 - 0.024 * x : 0.07 - 0.03 * x),
  w: (x) => 0.05 + 0.005 * x - 0.006 * x * x,
});

function upperGeometry(style) {
  const { h, w } = profile(style);
  const g = new THREE.SphereGeometry(1, 80, 40);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    let yy = y > 0 ? y * h(x) : y * 0.012;
    if (x > 0.55 && y > 0) yy *= 1 - (x - 0.55) * 0.55; // punta più bassa
    p.setXYZ(i, x * 0.15, yy, z * w(x));
  }
  g.computeVertexNormals();
  return g;
}

/** Altezza della superficie superiore a una certa x (serve per appoggiare i lacci). */
function topAt(style, X) {
  const { h } = profile(style);
  const x = X / 0.15;
  let y = h(x) * Math.sqrt(Math.max(0, 1 - x * x));
  if (x > 0.55) y *= 1 - (x - 0.55) * 0.55;
  return y;
}

function Shoe({ colors, style }) {
  const runner = style === 'runner';
  const geo = useMemo(
    () =>
      cached(`shoe-${style}`, () => {
        const sole = extrude(footprintShape(1), runner ? 0.03 : 0.02, 0.007, 48);
        sole.rotateX(-Math.PI / 2);
        const mid = extrude(footprintShape(1.012), 0.006, 0.002, 48);
        mid.rotateX(-Math.PI / 2);
        const { h, w } = profile(style);
        const stripe = (side) => {
          const pts = [];
          for (let i = 0; i <= 12; i++) {
            const x = -0.85 + (i / 12) * 1.15;
            const frac = 0.3 + (i / 12) * 0.32;
            const yy = h(x) * frac;
            const zz = w(x) * Math.sqrt(Math.max(0, 1 - x * x - frac * frac)) + 0.0025;
            pts.push([x * 0.15, yy, side * zz]);
          }
          return tube(pts, 0.0042, 48);
        };
        return { upper: upperGeometry(style), sole, mid, stripeA: stripe(1), stripeB: stripe(-1) };
      }),
    [style, runner],
  );
  const leather = useMaterial('leather', colors.primary);
  const rubber = useMaterial('rubber', colors.secondary || '#f2f0ea');
  const accent = useMaterial('leather', colors.accent || '#111111');
  const dark = useMaterial('plain', '#0c0c0c', { roughness: 0.9 });
  const lace = useMaterial('plain', colors.secondary || '#f2f0ea', { roughness: 0.8 });

  const soleH = runner ? 0.03 : 0.02;
  const laces = [-0.015, 0.007, 0.029, 0.051, 0.073];

  return (
    <group>
      <mesh geometry={geo.upper} material={leather} castShadow receiveShadow />
      <mesh geometry={geo.sole} material={rubber} position={[0, -0.013 - soleH / 2, 0]} castShadow receiveShadow />
      {runner && <mesh geometry={geo.mid} material={accent} position={[0, -0.008 - soleH * 0.5, 0]} />}
      <mesh geometry={geo.stripeA} material={accent} castShadow />
      <mesh geometry={geo.stripeB} material={accent} castShadow />
      {/* apertura e imbottitura del collo */}
      <mesh material={dark} position={[-0.068, 0.073, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.055, 0.032, 1]}>
        <circleGeometry args={[1, 40]} />
      </mesh>
      <mesh material={leather} position={[-0.068, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.058, 0.035, 0.06]} castShadow>
        <torusGeometry args={[1, 0.2, 12, 48]} />
      </mesh>
      {laces.map((x) => (
        <mesh key={x} material={lace} position={[x, topAt(style, x) + 0.004, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.0042, 0.05, 4, 8]} />
        </mesh>
      ))}
      <RoundedBox args={[0.014, 0.04, 0.03]} radius={0.006} position={[-0.152, 0.045, 0]} material={accent} castShadow />
    </group>
  );
}

export default function Sneakers({ colors, options = {} }) {
  const style = options.style || 'runner';
  return (
    <group rotation={[0, -0.55, 0]} scale={3.1} position={[0, -0.1, 0]}>
      <group position={[0.02, 0, 0.075]} rotation={[0, 0.18, 0]}>
        <Shoe colors={colors} style={style} />
      </group>
      <group position={[-0.045, 0, -0.07]} rotation={[0, 0.05, 0]}>
        <Shoe colors={colors} style={style} />
      </group>
    </group>
  );
}
