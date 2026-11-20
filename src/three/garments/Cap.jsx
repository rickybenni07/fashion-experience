import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { cached, extrude, tube } from '../geometry.js';
import { brimShape } from '../shapes.js';
import { useMaterial } from '../materials.js';

const RX = 0.151;
const RY = 0.124;
const RZ = 0.163;

export default function Cap({ colors }) {
  const geo = useMemo(
    () =>
      cached('cap', () => {
        const crown = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        crown.scale(RX, RY, RZ);
        const brim = extrude(brimShape(), 0.01, 0.004, 48);
        brim.rotateX(Math.PI / 2);
        const p = brim.attributes.position;
        for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) - 1.4 * p.getX(i) * p.getX(i));
        brim.computeVertexNormals();
        const seams = [];
        for (let k = 0; k < 6; k++) {
          const phi = (k / 6) * Math.PI * 2 + Math.PI / 6;
          const pts = [];
          for (let i = 0; i <= 16; i++) {
            const th = (i / 16) * (Math.PI / 2) * 0.98;
            pts.push([Math.sin(th) * Math.cos(phi) * RX * 1.006, Math.cos(th) * RY * 1.006, Math.sin(th) * Math.sin(phi) * RZ * 1.006]);
          }
          seams.push(tube(pts, 0.0022, 24));
        }
        return { crown, brim, seams };
      }),
    [],
  );
  const twill = useMaterial('cotton', colors.primary);
  const stitch = useMaterial('plain', colors.secondary || colors.primary, { roughness: 0.9 });
  const patch = useMaterial('rib', colors.accent || colors.secondary || '#ffffff');

  return (
    <group position={[0, -0.12, 0]} rotation={[0.12, -0.5, 0]} scale={2.6}>
      <mesh geometry={geo.crown} material={twill} castShadow receiveShadow />
      <mesh geometry={geo.brim} material={twill} position={[0, 0.006, 0]} rotation={[0.1, 0, 0]} castShadow receiveShadow />
      {geo.seams.map((g, i) => (
        <mesh key={i} geometry={g} material={stitch} />
      ))}
      <mesh material={twill} position={[0, RY, 0]}>
        <sphereGeometry args={[0.011, 16, 12]} />
      </mesh>
      <RoundedBox args={[0.06, 0.028, 0.008]} radius={0.003} material={patch} position={[0, 0.06, 0.148]} rotation={[-0.55, 0, 0]} castShadow />
    </group>
  );
}
