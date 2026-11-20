import * as THREE from 'three';
import { useMemo } from 'react';
import { cached, inflateShape } from '../geometry.js';
import { teeShape } from '../shapes.js';
import { useMaterial } from '../materials.js';
import { sunPrintTexture } from '../textures.js';

const THICK = 0.1;

export default function Tee({ colors, options = {} }) {
  const w = options.oversize ? 1.1 : 1;
  const body = useMemo(
    () => cached(`tee-${w}`, () => inflateShape(teeShape(w), { thickness: THICK, round: 0.15, wrinkle: 0.005 })),
    [w],
  );
  const collar = useMemo(() => cached('tee-collar', () => new THREE.TorusGeometry(0.122, 0.02, 14, 64, Math.PI)), []);
  const fabric = useMaterial('cotton', colors.primary);
  const rib = useMaterial('rib', colors.secondary || colors.primary);

  return (
    <group>
      <mesh geometry={body} material={fabric} castShadow receiveShadow />
      <mesh geometry={collar} material={rib} position={[0, 0.405, 0]} rotation={[0, 0, Math.PI]} scale={[1, 0.42, 1.4]} castShadow />
      {/* ricamo sul petto */}
      <mesh material={rib} position={[0.15 * w, 0.22, THICK + 0.004]} castShadow>
        <boxGeometry args={[0.06, 0.028, 0.006]} />
      </mesh>
      {options.print && <SunPrint colors={colors} />}
    </group>
  );
}

function SunPrint({ colors }) {
  const map = useMemo(
    () => sunPrintTexture(colors.secondary || '#ff6a3d', colors.accent || '#ff2d75', colors.accent || '#111111'),
    [colors.secondary, colors.accent],
  );
  return (
    <mesh position={[0, 0.04, THICK + 0.0075]} receiveShadow>
      <planeGeometry args={[0.3, 0.3]} />
      <meshStandardMaterial map={map} transparent alphaTest={0.05} roughness={0.85} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}
