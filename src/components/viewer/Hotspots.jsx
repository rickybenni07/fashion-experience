import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { getGarment } from '../../three/garments/index.js';

const tmpPos = new THREE.Vector3();
const tmpDir = new THREE.Vector3();
const tmpN = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();

function Hotspot({ h, fit, active, onSelect, index }) {
  const anchor = useRef();
  const btn = useRef();
  const position = useMemo(() => h.position.map((v) => v * fit), [h.position, fit]);
  const normal = useMemo(() => new THREE.Vector3(...(h.normal || [0, 0, 1])).normalize(), [h.normal]);

  // nasconde il punto quando è sul lato opposto rispetto alla camera
  useFrame(({ camera }) => {
    if (!anchor.current || !btn.current) return;
    anchor.current.getWorldPosition(tmpPos);
    anchor.current.getWorldQuaternion(tmpQ);
    tmpN.copy(normal).applyQuaternion(tmpQ);
    tmpDir.copy(camera.position).sub(tmpPos).normalize();
    const visible = tmpDir.dot(tmpN) > 0.08;
    const el = btn.current;
    if (el.dataset.visible !== String(visible)) {
      el.dataset.visible = String(visible);
      el.style.opacity = visible ? '1' : '0';
      el.style.pointerEvents = visible ? 'auto' : 'none';
    }
  });

  return (
    <group ref={anchor} position={position}>
      <Html center zIndexRange={[20, 0]}>
        <button
          ref={btn}
          type="button"
          className={`hotspot${active ? ' is-active' : ''}`}
          onClick={() => {
            const p = new THREE.Vector3();
            const q = new THREE.Quaternion();
            anchor.current.getWorldPosition(p);
            anchor.current.getWorldQuaternion(q);
            onSelect(h, p.toArray(), normal.clone().applyQuaternion(q).toArray());
          }}
          aria-label={`Dettaglio: ${h.label}`}
          style={{ transitionDelay: `${index * 60}ms` }}
        >
          <span className="hotspot__dot" />
          <span className="hotspot__label">{h.label}</span>
        </button>
      </Html>
    </group>
  );
}

export default function Hotspots({ product, active, onSelect }) {
  const g = getGarment(product.kind);
  // i punti di dettaglio valgono per i modelli procedurali; per i GLB si possono definire in product.hotspots
  const items = product.hotspots || g.hotspots;
  const fit = product.hotspots ? 1 : g.fit;
  return items.map((h, i) => <Hotspot key={h.id} h={h} fit={fit} index={i} active={active === h.id} onSelect={onSelect} />);
}
