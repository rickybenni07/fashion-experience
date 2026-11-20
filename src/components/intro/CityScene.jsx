import * as THREE from 'three';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import { StudioEnvironment } from '../../three/env.jsx';
import { brickTexture, duskSkyTexture, glowTexture, rng, wetRoughnessTexture } from '../../three/textures.js';
import { tube } from '../../three/geometry.js';
import { DEVICE } from '../../utils/device.js';
import { INTRO_CHARACTER } from '../../config/assets.js';
import ErrorBoundary from '../common/ErrorBoundary.jsx';
import CameraRig from './CameraRig.jsx';
import Mirror from './Mirror.jsx';
import ProceduralCharacter from './ProceduralCharacter.jsx';
import GLBCharacter from './GLBCharacter.jsx';

function Glow({ position, color, scale = 1, opacity = 0.6 }) {
  const map = useMemo(() => glowTexture(), []);
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={map} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function Ground() {
  const rough = useMemo(() => wetRoughnessTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      {DEVICE.reflectiveFloor ? (
        <MeshReflectorMaterial
          resolution={512}
          blur={[300, 80]}
          mixBlur={1}
          mixStrength={2.2}
          mirror={0.6}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          roughness={0.85}
          roughnessMap={rough}
          metalness={0.4}
          color="#141218"
        />
      ) : (
        <meshStandardMaterial color="#141218" roughness={0.55} roughnessMap={rough} metalness={0.3} />
      )}
    </mesh>
  );
}

function Wall() {
  const map = useMemo(() => brickTexture(), []);
  return (
    <group position={[0, 0, -1.45]}>
      <mesh position={[0, 2.1, 0]} receiveShadow>
        <boxGeometry args={[4.6, 4.2, 0.2]} />
        <meshStandardMaterial map={map} roughness={0.92} color="#bfb2b8" />
      </mesh>
      {/* cornicione */}
      <mesh position={[0, 4.25, 0.05]}>
        <boxGeometry args={[4.8, 0.12, 0.35]} />
        <meshStandardMaterial color="#1a1418" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Neon() {
  const slash = useMemo(() => tube([[-0.42, -0.22, 0], [0, 0.04, 0], [0.42, 0.3, 0]], 0.016, 32), []);
  const ring = useMemo(() => new THREE.TorusGeometry(0.36, 0.018, 12, 80), []);
  const line = useMemo(() => tube([[-0.5, 0, 0], [0.5, 0, 0]], 0.012, 8), []);
  return (
    <group>
      <group position={[-1.35, 2.55, -1.32]}>
        <mesh geometry={ring}>
          <meshBasicMaterial color={[4, 0.6, 1.8]} toneMapped={false} />
        </mesh>
        <mesh geometry={slash}>
          <meshBasicMaterial color={[0.6, 3.2, 4]} toneMapped={false} />
        </mesh>
        <Glow position={[0, 0, 0.05]} color="#ff2d75" scale={2.2} opacity={0.55} />
        <pointLight color="#ff2d75" intensity={6} distance={6} decay={2} position={[0, 0, 0.4]} />
      </group>
      <group position={[1.2, 3.3, -1.32]}>
        <mesh geometry={line}>
          <meshBasicMaterial color={[0.6, 3.2, 4]} toneMapped={false} />
        </mesh>
        <mesh geometry={line} position={[0.1, -0.12, 0]} scale={[0.7, 1, 1]}>
          <meshBasicMaterial color={[4, 1.4, 0.4]} toneMapped={false} />
        </mesh>
        <Glow position={[0, -0.06, 0.05]} color="#38e1ff" scale={1.8} opacity={0.4} />
        <pointLight color="#38e1ff" intensity={3} distance={5} decay={2} position={[0, 0, 0.4]} />
      </group>
    </group>
  );
}

function StreetLamp() {
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <group>
      <primitive object={target} position={[0, 0.8, -0.1]} />
      <group position={[1.75, 0, -0.7]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.05, 3.6, 12]} />
          <meshStandardMaterial color="#121014" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[-0.3, 3.58, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 10]} />
          <meshStandardMaterial color="#121014" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[-0.58, 3.52, 0.05]}>
          <boxGeometry args={[0.22, 0.06, 0.12]} />
          <meshBasicMaterial color={[3, 1.9, 1.1]} toneMapped={false} />
        </mesh>
        <Glow position={[-0.58, 3.48, 0.05]} color="#ffb877" scale={1.6} opacity={0.75} />
      </group>
      <spotLight
        position={[1.17, 3.45, -0.65]}
        target={target}
        color="#ffb877"
        intensity={70}
        angle={0.62}
        penumbra={0.7}
        distance={12}
        decay={1.6}
        castShadow={DEVICE.shadows}
        shadow-mapSize={[DEVICE.shadowMap, DEVICE.shadowMap]}
        shadow-bias={-0.0004}
      />
    </group>
  );
}

/** Skyline lontana: palazzi e finestre illuminate (instancing: 2 draw call in tutto). */
function Skyline() {
  const bRef = useRef();
  const wRef = useRef();
  const data = useMemo(() => {
    const r = rng(9);
    const buildings = [];
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 2 + r() * 0.08;
      const d = 13 + r() * 10;
      const w = 2 + r() * 3.5;
      const h = 4 + r() * 14;
      buildings.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, w, h, rot: -a + Math.PI / 2 });
    }
    const windows = [];
    for (const b of buildings) {
      const cols = Math.floor(b.w / 0.55);
      const rows = Math.floor(b.h / 0.7);
      for (let c = 0; c < cols; c++) {
        for (let rr = 0; rr < rows; rr++) {
          if (r() > 0.38) continue;
          windows.push({ b, c, rr, cols, warm: r() > 0.35, k: 0.5 + r() * 0.8 });
        }
      }
    }
    return { buildings, windows };
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    data.buildings.forEach((b, i) => {
      q.setFromAxisAngle(up, b.rot);
      m.compose(p.set(b.x, b.h / 2, b.z), q, s.set(b.w, b.h, 2));
      bRef.current.setMatrixAt(i, m);
    });
    bRef.current.instanceMatrix.needsUpdate = true;
    const col = new THREE.Color();
    data.windows.forEach((w, i) => {
      const { b } = w;
      q.setFromAxisAngle(up, b.rot);
      const local = new THREE.Vector3(-b.w / 2 + 0.35 + w.c * 0.55, 0.6 + w.rr * 0.7, 1.01).applyQuaternion(q);
      m.compose(p.set(b.x + local.x, local.y, b.z + local.z), q, s.set(0.28, 0.36, 1));
      wRef.current.setMatrixAt(i, m);
      col.set(w.warm ? '#ffb46b' : '#7fd8ff').multiplyScalar(w.k * 1.6);
      wRef.current.setColorAt(i, col);
    });
    wRef.current.instanceMatrix.needsUpdate = true;
    if (wRef.current.instanceColor) wRef.current.instanceColor.needsUpdate = true;
  }, [data]);

  return (
    <group>
      <instancedMesh ref={bRef} args={[undefined, undefined, data.buildings.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#0d0a14" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={wRef} args={[undefined, undefined, data.windows.length]} frustumCulled={false}>
        <planeGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function IntroCharacter({ rig }) {
  const procedural = <ProceduralCharacter rig={rig} />;
  if (!INTRO_CHARACTER.url) return procedural;
  return (
    <ErrorBoundary fallback={procedural}>
      <Suspense fallback={procedural}>
        <GLBCharacter rig={rig} config={INTRO_CHARACTER} />
      </Suspense>
    </ErrorBoundary>
  );
}

/** Fase 1 · 0–3 s: vicolo al tramonto, asfalto bagnato, neon, lampione, specchio. */
export default function CityScene({ rig }) {
  const sky = useMemo(() => duskSkyTexture(), []);
  return (
    <>
      <primitive attach="background" object={sky} />
      <fog attach="fog" args={['#2a1533', 7, 34]} />
      <StudioEnvironment intensity={0.3} />
      <CameraRig rig={rig} />

      <hemisphereLight args={['#7d6bff', '#1b0f16', 0.55]} />
      <ambientLight intensity={0.06} />
      <directionalLight position={[-5, 4, -6]} intensity={1.6} color="#4fd8ff" />
      <directionalLight position={[6, 2.5, 4]} intensity={0.7} color="#ff7a59" />
      <pointLight position={[0, 1.75, -0.6]} intensity={1.6} distance={2.5} decay={2} color="#ffd9c2" />

      <Ground />
      <Wall />
      <Neon />
      <StreetLamp />
      <Skyline />
      <Mirror position={[0, 0, -1.05]} />

      <group position={[0, 0, -0.12]} rotation={[0, Math.PI, 0]}>
        <IntroCharacter rig={rig} />
      </group>

      <Sparkles count={DEVICE.tier === 'low' ? 30 : 70} scale={[6, 3.5, 5]} position={[0, 1.8, 0]} size={2.2} speed={0.25} color="#ffcf9a" opacity={0.55} />
    </>
  );
}
