import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { DEVICE } from '../../utils/device.js';
import CityScene from './CityScene.jsx';
import RevealScene from './RevealScene.jsx';

/** Segnala che la scena è montata e ha disegnato almeno un paio di frame: solo allora parte la timeline. */
function ReadySignal({ onReady }) {
  const done = useRef(false);
  useEffect(() => {
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => {
        if (!done.current) {
          done.current = true;
          onReady();
        }
      });
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [onReady]);
  return null;
}

export default function IntroCanvas({ rig, phase, products, onReady, paused }) {
  return (
    <Canvas
      className="intro__canvas"
      shadows={DEVICE.shadows}
      dpr={DEVICE.dpr}
      frameloop={paused ? 'never' : 'always'}
      camera={{ position: [2.4, 1.9, 3.8], fov: 34, near: 0.05, far: 90 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Suspense fallback={null}>
        {phase === 'city' ? <CityScene rig={rig} /> : <RevealScene rig={rig} products={products} />}
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
