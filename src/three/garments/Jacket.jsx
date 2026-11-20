import * as THREE from 'three';
import { useMemo } from 'react';
import { cached, inflateShape } from '../geometry.js';
import { longSleeveShape, roundedRect } from '../shapes.js';
import { useMaterial } from '../materials.js';

const THICK = 0.12;

export default function Jacket({ colors, options = {} }) {
  const shell = options.style === 'shell';
  const geo = useMemo(
    () =>
      cached('jacket', () => ({
        body: inflateShape(longSleeveShape(1.05), { thickness: THICK, round: 0.12, wrinkle: 0.006 }),
        hem: inflateShape(roundedRect(0.64, 0.075, 0.02), { thickness: 0.075, round: 0.035, res: 90 }),
        cuff: inflateShape(roundedRect(0.15, 0.07, 0.02), { thickness: 0.055, round: 0.025, res: 40 }),
        collar: new THREE.TorusGeometry(0.125, 0.03, 16, 64, Math.PI),
        stand: inflateShape(roundedRect(0.3, 0.1, 0.03), { thickness: 0.05, round: 0.03, res: 60 }),
        utility: inflateShape(roundedRect(0.1, 0.12, 0.015), { thickness: 0.02, round: 0.02, res: 40 }),
      })),
    [],
  );
  const body = useMaterial(shell ? 'nylon' : 'satin', colors.primary);
  const trim = useMaterial(shell ? 'nylon' : 'rib', colors.secondary || colors.primary);
  const zip = useMaterial('metal', colors.accent || '#d9dde2', { roughness: 0.12 });

  return (
    <group>
      <mesh geometry={geo.body} material={body} castShadow receiveShadow />
      {shell ? (
        <mesh geometry={geo.stand} material={body} position={[0, 0.43, 0.01]} castShadow />
      ) : (
        <mesh geometry={geo.collar} material={trim} position={[0, 0.41, 0]} rotation={[0, 0, Math.PI]} scale={[1, 0.42, 1.3]} castShadow />
      )}
      <mesh geometry={geo.hem} material={shell ? body : trim} position={[0, -0.39, 0]} castShadow />
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={geo.cuff} material={shell ? body : trim} position={[s * 0.565, -0.305, 0]} rotation={[0, 0, s * 0.39]} castShadow />
      ))}
      {/* zip centrale */}
      <mesh material={zip} position={[0, -0.04, THICK + 0.002]} castShadow>
        <boxGeometry args={[0.012, 0.66, 0.006]} />
      </mesh>
      <mesh material={zip} position={[0, 0.27, THICK + 0.01]} castShadow>
        <boxGeometry args={[0.022, 0.05, 0.008]} />
      </mesh>
      {shell ? (
        // tasche petto con zip diagonale
        [-1, 1].map((s) => (
          <mesh key={s} material={zip} position={[s * 0.16, 0.12, THICK + 0.002]} rotation={[0, 0, s * -0.5]}>
            <boxGeometry args={[0.006, 0.16, 0.005]} />
          </mesh>
        ))
      ) : (
        // tasca utility sulla manica sinistra
        <mesh geometry={geo.utility} material={body} position={[0.43, 0.04, 0.045]} rotation={[0, 0, 0.39]} castShadow />
      )}
    </group>
  );
}
