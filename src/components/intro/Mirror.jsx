import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { DEVICE } from '../../utils/device.js';

const W = 0.82;
const H = 1.82;

/** Specchio a figura intera con vera riflessione planare (mostra il volto del personaggio). */
export default function Mirror({ position = [0, 0, -1.05] }) {
  const reflector = useMemo(() => {
    const r = new Reflector(new THREE.PlaneGeometry(W, H), {
      clipBias: 0.003,
      textureWidth: DEVICE.mirrorRes,
      textureHeight: DEVICE.mirrorRes * 2,
      color: new THREE.Color('#b9b6bf'),
    });
    return r;
  }, []);
  useEffect(
    () => () => {
      reflector.getRenderTarget?.().dispose();
      reflector.geometry.dispose();
      reflector.material.dispose();
    },
    [reflector],
  );

  return (
    <group position={position}>
      <primitive object={reflector} position={[0, H / 2 + 0.1, 0.008]} />
      {/* cornice laccata con filo oro */}
      <RoundedBox args={[W + 0.1, H + 0.1, 0.05]} radius={0.02} position={[0, H / 2 + 0.1, -0.03]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#0d0c10" roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
      </RoundedBox>
      <mesh position={[0, H / 2 + 0.1, 0.002]}>
        <planeGeometry args={[W + 0.03, H + 0.03]} />
        <meshStandardMaterial color="#c9a45c" metalness={1} roughness={0.25} />
      </mesh>
      {/* piedi */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.38, 0.05, -0.12]} rotation={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.32]} />
          <meshStandardMaterial color="#0d0c10" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
