import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { MODEL_FIT_SIZE } from '../config/assets.js';

/**
 * Carica un prodotto reale in formato GLB/GLTF, lo centra, lo normalizza in dimensione
 * e ricolora (con transizione morbida) le mesh indicate in `tintMeshes`.
 */
export default function GLBModel({ url, colors, tintMeshes, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  const tintKey = (tintMeshes || []).join('|');

  const { object, scale, offset, tinted } = useMemo(() => {
    const obj = scene.clone(true);
    const tinted = [];
    obj.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      const label = `${o.name} ${o.material?.name || ''}`;
      const names = tintKey ? tintKey.split('|') : [];
      if (names.some((t) => label.includes(t))) {
        o.material = o.material.clone();
        tinted.push(o.material);
      }
    });
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = MODEL_FIT_SIZE / Math.max(size.x, size.y, size.z || 1e-3);
    return { object: obj, scale: s, offset: center.multiplyScalar(-1), tinted };
  }, [scene, tintKey]);

  const target = useMemo(() => new THREE.Color(colors.primary), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    target.set(colors.primary);
  }, [colors.primary, target]);
  useEffect(() => () => tinted.forEach((m) => m.dispose()), [tinted]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 7);
    for (const m of tinted) m.color?.lerp(target, k);
  });

  return (
    <group scale={scale} rotation={rotation}>
      <primitive object={object} position={offset} />
    </group>
  );
}
