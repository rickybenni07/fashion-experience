import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { tattooSkinTexture, weaveTexture } from '../../three/textures.js';
import Chain from '../../three/garments/Chain.jsx';

const SKIN = '#a8714f';

function useCharacterMaterials() {
  const mats = useMemo(
    () => ({
      tattoo: new THREE.MeshPhysicalMaterial({ map: tattooSkinTexture(SKIN), roughness: 0.52, sheen: 0.35, sheenColor: new THREE.Color('#ffb59a'), sheenRoughness: 0.5, clearcoat: 0.08 }),
      skin: new THREE.MeshPhysicalMaterial({ color: SKIN, roughness: 0.48, sheen: 0.35, sheenColor: new THREE.Color('#ffb59a'), clearcoat: 0.1 }),
      tee: new THREE.MeshPhysicalMaterial({ color: '#111113', roughness: 0.95, sheen: 1, sheenColor: new THREE.Color('#4a4a55'), sheenRoughness: 0.6, bumpMap: weaveTexture(), bumpScale: 0.6 }),
      pants: new THREE.MeshPhysicalMaterial({ color: '#2d2f2a', roughness: 0.85, sheen: 0.5, sheenColor: new THREE.Color('#6a6d62'), bumpMap: weaveTexture(), bumpScale: 0.8 }),
      shoe: new THREE.MeshPhysicalMaterial({ color: '#efede8', roughness: 0.45, clearcoat: 0.4 }),
      sole: new THREE.MeshStandardMaterial({ color: '#c58b4e', roughness: 0.8 }),
      hair: new THREE.MeshStandardMaterial({ color: '#141010', roughness: 0.95 }),
      glasses: new THREE.MeshPhysicalMaterial({ color: '#050507', roughness: 0.05, metalness: 0.2, clearcoat: 1 }),
      gold: new THREE.MeshStandardMaterial({ color: '#e7b75a', metalness: 1, roughness: 0.15 }),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
}

function Arm({ side, sh, el, m, watch }) {
  return (
    <group ref={sh} position={[side * 0.215, 0.5, 0]}>
      <mesh material={m.tee} position={[0, -0.08, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.13, 6, 16]} />
      </mesh>
      <mesh material={m.tattoo} position={[0, -0.16, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.19, 6, 16]} />
      </mesh>
      <group ref={el} position={[0, -0.3, 0]}>
        <mesh material={m.tattoo} position={[0, -0.13, 0]} castShadow>
          <capsuleGeometry args={[0.044, 0.19, 6, 16]} />
        </mesh>
        {watch && (
          <mesh material={m.gold} position={[0, -0.235, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.047, 0.012, 10, 32]} />
          </mesh>
        )}
        <group position={[0, -0.27, 0]}>
          <mesh material={m.tattoo} position={[0, -0.055, 0]} scale={[1, 1, 0.7]} castShadow>
            <capsuleGeometry args={[0.036, 0.06, 6, 12]} />
          </mesh>
          <mesh material={m.gold} position={[0, -0.085, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.03, 0.006, 8, 24]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Leg({ side, hip, knee, m }) {
  return (
    <group ref={hip} position={[side * 0.1, 0, 0]}>
      <mesh material={m.pants} position={[0, -0.22, 0]} castShadow>
        <capsuleGeometry args={[0.088, 0.3, 6, 16]} />
      </mesh>
      <group ref={knee} position={[0, -0.45, 0]}>
        <mesh material={m.pants} position={[0, -0.21, 0]} castShadow>
          <capsuleGeometry args={[0.074, 0.3, 6, 16]} />
        </mesh>
        <group position={[0, -0.43, 0]}>
          <RoundedBox args={[0.115, 0.085, 0.29]} radius={0.035} position={[0, -0.01, 0.05]} material={m.shoe} castShadow />
          <mesh material={m.sole} position={[0, -0.055, 0.05]} castShadow>
            <boxGeometry args={[0.12, 0.024, 0.3]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Personaggio segnaposto (procedurale) con rig semplice: tatuaggi, catene, orologio, anelli,
 * occhiali, t-shirt oversize, cargo e sneakers. Costruito rivolto verso +Z.
 * Sostituibile con un modello GLB riggato (vedi src/config/assets.js).
 */
export default function ProceduralCharacter({ rig }) {
  const m = useCharacterMaterials();
  const root = useRef();
  const spine = useRef();
  const head = useRef();
  const shR = useRef();
  const elR = useRef();
  const shL = useRef();
  const elL = useRef();
  const hipR = useRef();
  const knR = useRef();
  const hipL = useRef();
  const knL = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const f = rig.fidget;
    root.current.rotation.x = rig.fall;
    root.current.rotation.z = rig.fallZ;
    spine.current.rotation.x = rig.torsoX;
    spine.current.rotation.z = rig.torsoZ;
    spine.current.scale.y = 1 + Math.sin(t * 2.2) * 0.008;
    head.current.rotation.x = rig.headX + Math.sin(t * 1.1) * 0.02;
    head.current.rotation.y = rig.headY;
    // braccio destro (lato -X), sinistro (lato +X)
    shR.current.rotation.x = -(rig.shRX + Math.sin(t * 7) * 0.05 * f);
    shR.current.rotation.z = -rig.shRZ;
    elR.current.rotation.x = -(rig.elR + Math.sin(t * 11) * 0.14 * f);
    shL.current.rotation.x = -(rig.shLX + Math.sin(t * 6.3 + 1) * 0.05 * f);
    shL.current.rotation.z = rig.shLZ;
    elL.current.rotation.x = -(rig.elL + Math.sin(t * 9.5 + 2) * 0.12 * f);
    hipL.current.rotation.x = -rig.hipL;
    knL.current.rotation.x = rig.kneeL;
    hipR.current.rotation.x = -rig.hipR;
    knR.current.rotation.x = rig.kneeR;
  });

  return (
    <group ref={root}>
      <group position={[0, 0.95, 0]}>
        <mesh material={m.pants} rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.13, 0.12, 6, 16]} />
        </mesh>
        <Leg side={1} hip={hipL} knee={knL} m={m} />
        <Leg side={-1} hip={hipR} knee={knR} m={m} />

        <group ref={spine}>
          <mesh material={m.tee} position={[0, 0.27, 0]} scale={[1.18, 1, 0.74]} castShadow receiveShadow>
            <capsuleGeometry args={[0.17, 0.3, 8, 24]} />
          </mesh>
          <mesh material={m.tattoo} position={[0, 0.56, 0]} castShadow>
            <capsuleGeometry args={[0.052, 0.06, 6, 16]} />
          </mesh>

          {/* testa */}
          <group ref={head} position={[0, 0.6, 0]}>
            <mesh material={m.skin} position={[0, 0.11, 0]} scale={[0.92, 1.1, 1]} castShadow>
              <sphereGeometry args={[0.105, 32, 24]} />
            </mesh>
            <mesh material={m.hair} position={[0, 0.12, -0.004]} scale={[0.94, 1.1, 1.03]}>
              <sphereGeometry args={[0.109, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
            </mesh>
            <mesh material={m.hair} position={[0, 0.1, 0.002]} scale={[0.93, 1.06, 1.02]}>
              <sphereGeometry args={[0.104, 32, 16, Math.PI / 2 - 1.1, 2.2, Math.PI * 0.56, Math.PI * 0.3]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} material={m.skin} position={[s * 0.096, 0.11, -0.005]} scale={[0.5, 1, 0.8]}>
                <sphereGeometry args={[0.028, 12, 10]} />
              </mesh>
            ))}
            <mesh material={m.skin} position={[0, 0.095, 0.102]} rotation={[0.25, 0, 0]}>
              <coneGeometry args={[0.016, 0.04, 10]} />
            </mesh>
            <RoundedBox args={[0.17, 0.042, 0.03]} radius={0.012} position={[0, 0.125, 0.094]} material={m.glasses} />
            <mesh material={m.gold} position={[0, 0.148, 0.106]}>
              <boxGeometry args={[0.15, 0.004, 0.004]} />
            </mesh>
          </group>

          <Arm side={-1} sh={shR} el={elR} m={m} />
          <Arm side={1} sh={shL} el={elL} m={m} watch />

          {/* catene sul petto */}
          <group position={[0, 0.4, 0.128]} rotation={[-0.2, 0, 0]} scale={0.36}>
            <Chain colors={{ primary: '#e7b75a', secondary: '#0c0c0c', accent: '#ffffff' }} />
          </group>
          <group position={[0, 0.47, 0.13]} rotation={[-0.25, 0, 0]} scale={[0.27, 0.22, 0.27]}>
            <Chain colors={{ primary: '#e9edf2', secondary: '#0c0c0c', accent: '#bfe7ff' }} pendant={false} />
          </group>
        </group>
      </group>
    </group>
  );
}
