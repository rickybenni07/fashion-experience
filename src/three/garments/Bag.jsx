import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { cached, tube } from '../geometry.js';
import { useMaterial } from '../materials.js';

export default function Bag({ colors }) {
  const strap = useMemo(
    () =>
      cached('bag-strap', () =>
        tube(
          [
            [-0.16, 0.08, 0],
            [-0.22, 0.3, -0.02],
            [-0.1, 0.5, -0.03],
            [0.1, 0.5, -0.03],
            [0.22, 0.3, -0.02],
            [0.16, 0.08, 0],
          ],
          0.011,
          80,
        ),
      ),
    [],
  );
  const leather = useMaterial('leather', colors.primary);
  const edge = useMaterial('leather', colors.secondary || colors.primary, { roughness: 0.35 });
  const brass = useMaterial('gold', colors.accent || '#c9a45c', { roughness: 0.25 });

  return (
    <group position={[0, -0.12, 0]} scale={1.55} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[0.34, 0.22, 0.1]} radius={0.035} smoothness={6} material={leather} castShadow receiveShadow />
      {/* patta */}
      <RoundedBox args={[0.346, 0.13, 0.014]} radius={0.006} smoothness={4} material={edge} position={[0, 0.045, 0.053]} rotation={[-0.06, 0, 0]} castShadow />
      {/* fibbia */}
      <mesh material={brass} position={[0, -0.02, 0.064]} castShadow>
        <torusGeometry args={[0.026, 0.006, 12, 32]} />
      </mesh>
      <mesh material={brass} position={[0, -0.02, 0.066]}>
        <boxGeometry args={[0.006, 0.05, 0.006]} />
      </mesh>
      {/* attacchi tracolla */}
      {[-1, 1].map((s) => (
        <mesh key={s} material={brass} position={[s * 0.168, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.016, 0.004, 10, 24]} />
        </mesh>
      ))}
      <mesh geometry={strap} material={edge} castShadow />
    </group>
  );
}
