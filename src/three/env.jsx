import * as THREE from 'three';
import { useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { blobShadowTexture } from './textures.js';

/**
 * Environment map da studio generata localmente (PMREM di una RoomEnvironment):
 * riflessi realistici su metalli e tessuti senza scaricare file HDR.
 * Una texture per renderer, condivisa da tutte le viste.
 */
const envCache = new WeakMap();
function getEnv(gl) {
  let tex = envCache.get(gl);
  if (!tex) {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    tex = pmrem.fromScene(room, 0.04).texture;
    room.dispose?.();
    pmrem.dispose();
    envCache.set(gl, tex);
  }
  return tex;
}

export function StudioEnvironment({ intensity = 1 }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    const prev = scene.environment;
    const prevI = scene.environmentIntensity;
    scene.environment = getEnv(gl);
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = prev;
      scene.environmentIntensity = prevI ?? 1;
    };
  }, [gl, scene, intensity]);
  return null;
}

/** Ombra a contatto economica (una sola texture) per le card della griglia. */
export function BlobShadow({ y = -0.7, scale = 1.6, opacity = 0.7 }) {
  const map = useMemo(() => blobShadowTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} scale={[scale, scale * 0.6, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
