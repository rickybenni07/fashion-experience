import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { StudioEnvironment } from '../../three/env.jsx';
import ProductModel from '../../three/ProductModel.jsx';
import { DEVICE } from '../../utils/device.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

function Item({ product, index, rig, layout }) {
  const g = useRef();
  useFrame(({ clock }) => {
    if (!g.current) return;
    const local = clamp01((rig.reveal - index * 0.08) / 0.45);
    const e = easeOutBack(local);
    g.current.position.set(layout.x, layout.y + (1 - e) * 1.6, layout.z);
    g.current.scale.setScalar(layout.s * (0.3 + 0.7 * easeOutCubic(local)));
    g.current.rotation.y = (1 - local) * -1.2 + Math.sin(clock.elapsedTime * 0.6 + index) * 0.25;
    g.current.visible = local > 0.001;
  });
  return (
    <group ref={g} visible={false}>
      <ProductModel product={product} colors={product.colors[0]} />
    </group>
  );
}

/** Fase 1 · 4–5 s: su fondo bianco i capi principali "cadono" in scena uno dopo l'altro. */
export default function RevealScene({ rig, products }) {
  const { camera, size } = useThree();
  const portrait = size.height > size.width;

  useLayoutEffect(() => {
    camera.fov = portrait ? 48 : 32;
    camera.position.set(0, 0.35, portrait ? 7.4 : 6.2);
    camera.rotation.set(0, 0, 0);
    camera.lookAt(0, 0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, portrait]);

  useFrame(() => {
    // lieve carrellata in avanti durante il reveal
    camera.position.z = (portrait ? 7.4 : 6.2) - rig.reveal * 0.35;
  });

  const n = products.length;
  // larghezza visibile sul piano z=0 calcolata dalla camera del reveal (non da quella della scena urbana)
  const dist = portrait ? 7.4 : 6.2;
  const fov = ((portrait ? 48 : 32) * Math.PI) / 180;
  const vw = 2 * dist * Math.tan(fov / 2) * (size.width / size.height);
  const layouts = products.map((_, i) => {
    if (portrait) {
      const perRow = Math.ceil(n / 2);
      const row = i < perRow ? 0 : 1;
      const col = row === 0 ? i : i - perRow;
      const count = row === 0 ? perRow : n - perRow;
      const sp = (vw * 0.9) / count;
      return { x: (col - (count - 1) / 2) * sp, y: row === 0 ? 0.75 : -0.75, z: 0, s: Math.min(0.7, sp * 0.75) };
    }
    const sp = (vw * 0.9) / n;
    const mid = (n - 1) / 2;
    return { x: (i - mid) * sp, y: 0, z: -Math.abs(i - mid) * 0.18, s: Math.min(0.8, (sp * 0.85) / 1.25) };
  });

  return (
    <>
      <color attach="background" args={['#f4f1ec']} />
      <StudioEnvironment intensity={1} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 6, 5]} intensity={2.4} castShadow={DEVICE.shadows} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.9} color="#ffd9c2" />
      {products.map((p, i) => (
        <Item key={p.id} product={p} index={i} rig={rig} layout={layouts[i]} />
      ))}
      <ContactShadows position={[0, portrait ? -1.35 : -0.6, 0]} scale={14} opacity={0.35} blur={2.4} far={2} resolution={512} />
    </>
  );
}
