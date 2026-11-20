import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, ContactShadows, PerformanceMonitor } from '@react-three/drei';
import { DEVICE } from '../../utils/device.js';
import SwapModel from './SwapModel.jsx';
import StageLights, { MOODS } from './StageLights.jsx';
import { getGarment } from '../../three/garments/index.js';

const HOME = [0, 0.15, 3.5, 0, 0, 0];

/** Rotazione automatica a 360°, in pausa mentre l'utente trascina e per qualche secondo dopo. */
function AutoRotate({ controls, enabled, lastInteraction }) {
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || !enabled) return;
    if (performance.now() - lastInteraction.current < 2500) return;
    c.rotate(Math.min(dt, 0.05) * 0.32, 0, false);
  });
  return null;
}

/**
 * Visore 3D del prodotto: rotazione 360° (trascina), zoom (rotellina / pinch / pulsanti),
 * punti di dettaglio con avvicinamento della camera, atmosfere di luce, schermo intero.
 */
export default function ProductStage({ product, colorId, hotspots = false, compact = false, className = '' }) {
  const wrap = useRef();
  const controls = useRef();
  const lastInteraction = useRef(0);
  const [auto, setAuto] = useState(true);
  const [mood, setMood] = useState('studio');
  const [active, setActive] = useState(null);
  const [dpr, setDpr] = useState(DEVICE.dpr);
  const [isFull, setIsFull] = useState(false);

  const home = useCallback((smooth = true) => controls.current?.setLookAt(...HOME, smooth), []);

  useEffect(() => {
    setActive(null);
    home(true);
  }, [product.id, home]);

  useEffect(() => {
    const onFs = () => setIsFull(document.fullscreenElement === wrap.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const zoom = (d) => {
    lastInteraction.current = performance.now();
    controls.current?.dolly(d, true);
  };
  const reset = () => {
    setActive(null);
    home(true);
  };
  const focus = (h, p, n) => {
    setAuto(false);
    setActive(h.id);
    const d = 0.95;
    controls.current?.setLookAt(p[0] + n[0] * d, p[1] + n[1] * d + 0.05, p[2] + n[2] * d, p[0], p[1], p[2], true);
  };
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else wrap.current?.requestFullscreen?.();
  };

  const allHotspots = product.hotspots || null;
  const activeInfo = active ? findHotspot(product, active, allHotspots) : null;

  return (
    <div ref={wrap} className={`stage stage--${mood}${compact ? ' stage--compact' : ''} ${className}`}>
      <div className="stage__glow" aria-hidden />
      <div className="stage__floor" aria-hidden />
      <Canvas
        className="stage__canvas"
        shadows={DEVICE.shadows}
        dpr={dpr}
        camera={{ position: HOME.slice(0, 3), fov: 30, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <StageLights mood={mood} />
        <SwapModel product={product} colorId={colorId} hotspots={hotspots} activeHotspot={active} onHotspot={focus} />
        <ContactShadows
          position={[0, -0.78, 0]}
          opacity={mood === 'studio' ? 0.42 : 0.62}
          scale={5}
          blur={2.6}
          far={1.8}
          resolution={DEVICE.tier === 'low' ? 256 : 512}
          color="#120d10"
        />
        <CameraControls
          ref={controls}
          makeDefault
          minDistance={1.3}
          maxDistance={6}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 + 0.1}
          smoothTime={0.32}
          onStart={() => {
            lastInteraction.current = performance.now();
          }}
          onChange={() => {
            if (controls.current?.currentAction) lastInteraction.current = performance.now();
          }}
        />
        <AutoRotate controls={controls} enabled={auto && !active} lastInteraction={lastInteraction} />
      </Canvas>

      <div className="stage__toolbar" role="toolbar" aria-label="Controlli visore 3D">
        <button type="button" className={`tbtn${auto ? ' is-on' : ''}`} onClick={() => setAuto((v) => !v)} aria-pressed={auto} title="Rotazione automatica 360°">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M12 5a7 7 0 1 1-6.6 4.7" /><path d="M5 4v5h5" /></svg>
          <span>360°</span>
        </button>
        <button type="button" className="tbtn" onClick={() => zoom(0.7)} aria-label="Avvicina" title="Avvicina">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M12 6v12M6 12h12" /></svg>
        </button>
        <button type="button" className="tbtn" onClick={() => zoom(-0.7)} aria-label="Allontana" title="Allontana">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M6 12h12" /></svg>
        </button>
        <button type="button" className="tbtn" onClick={reset} aria-label="Ripristina vista" title="Ripristina vista">
          <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></svg>
        </button>
        <span className="stage__sep" aria-hidden />
        {Object.entries(MOODS).map(([id, m]) => (
          <button key={id} type="button" className={`tbtn tbtn--text${mood === id ? ' is-on' : ''}`} onClick={() => setMood(id)} aria-pressed={mood === id}>
            {m.label}
          </button>
        ))}
        {!compact && (
          <>
            <span className="stage__sep" aria-hidden />
            <button type="button" className="tbtn" onClick={toggleFull} aria-label={isFull ? 'Esci da schermo intero' : 'Schermo intero'} title="Schermo intero">
              <svg viewBox="0 0 24 24" aria-hidden>
                {isFull ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
              </svg>
            </button>
          </>
        )}
      </div>

      <p className="stage__hint" aria-hidden>
        Trascina per ruotare · Scorri o pizzica per lo zoom{hotspots ? ' · Tocca i punti per i dettagli' : ''}
      </p>

      {activeInfo && (
        <div className="stage__detail" role="status">
          <span className="eyebrow">Dettaglio</span>
          <strong>{activeInfo.label}</strong>
          <p>{activeInfo.text}</p>
          <button type="button" className="link-btn" onClick={reset}>
            Torna alla vista completa
          </button>
        </div>
      )}
    </div>
  );
}

function findHotspot(product, id, custom) {
  return (custom || getGarment(product.kind).hotspots).find((h) => h.id === id);
}
