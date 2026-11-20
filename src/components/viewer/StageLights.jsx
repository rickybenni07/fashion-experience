import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { StudioEnvironment } from '../../three/env.jsx';
import { DEVICE } from '../../utils/device.js';

/** Atmosfere di luce selezionabili dal visore. I valori vengono interpolati dolcemente. */
export const MOODS = {
  studio: { label: 'Studio', key: '#ffffff', keyI: 2.6, rim: '#fff3e2', rimI: 1.2, fill: '#f3ecff', fillI: 0.5, env: 1 },
  tramonto: { label: 'Tramonto', key: '#ffb070', keyI: 2.8, rim: '#ff4d8d', rimI: 3.2, fill: '#7a5cff', fillI: 1.0, env: 0.7 },
  notte: { label: 'Notte', key: '#a9bcff', keyI: 1.3, rim: '#ff2d75', rimI: 4.5, fill: '#38e1ff', fillI: 1.6, env: 0.35 },
};

export default function StageLights({ mood = 'studio' }) {
  const key = useRef();
  const rim = useRef();
  const fill = useRef();
  const m = MOODS[mood] || MOODS.studio;
  const targets = useMemo(() => ({ key: new THREE.Color(), rim: new THREE.Color(), fill: new THREE.Color() }), []);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 4);
    targets.key.set(m.key);
    targets.rim.set(m.rim);
    targets.fill.set(m.fill);
    if (key.current) {
      key.current.color.lerp(targets.key, k);
      key.current.intensity += (m.keyI - key.current.intensity) * k;
    }
    if (rim.current) {
      rim.current.color.lerp(targets.rim, k);
      rim.current.intensity += (m.rimI - rim.current.intensity) * k;
    }
    if (fill.current) {
      fill.current.color.lerp(targets.fill, k);
      fill.current.intensity += (m.fillI - fill.current.intensity) * k;
    }
  });

  return (
    <>
      <StudioEnvironment intensity={m.env} />
      <ambientLight intensity={0.12} />
      <directionalLight
        ref={key}
        position={[2.5, 4.5, 3.5]}
        intensity={2.6}
        castShadow={DEVICE.shadows}
        shadow-mapSize={[DEVICE.shadowMap, DEVICE.shadowMap]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-1.5}
        shadow-camera-right={1.5}
        shadow-camera-top={1.5}
        shadow-camera-bottom={-1.5}
      />
      <directionalLight ref={rim} position={[-3.5, 2.5, -3]} intensity={1.2} />
      <pointLight ref={fill} position={[-2.2, -0.4, 2.4]} intensity={0.5} distance={8} decay={1.2} />
    </>
  );
}
