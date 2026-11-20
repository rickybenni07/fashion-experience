import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { DEVICE } from '../../utils/device.js';

/**
 * Un solo contesto WebGL per tutte le card 3D della pagina (drei <View>):
 * ogni card disegna la propria scena in una porzione del canvas condiviso.
 * Molto più leggero di un <Canvas> per card, soprattutto su smartphone.
 */
export default function ViewCanvas() {
  return (
    <Canvas
      className="view-canvas"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 5 }}
      dpr={[1, Math.min(DEVICE.dpr[1], 1.75)]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      eventSource={typeof document !== 'undefined' ? document.getElementById('root') : undefined}
    >
      <View.Port />
    </Canvas>
  );
}
