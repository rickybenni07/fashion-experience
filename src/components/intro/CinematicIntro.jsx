import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useShop } from '../../store/ShopContext.jsx';
import { DEVICE } from '../../utils/device.js';
import IntroCanvas from './IntroCanvas.jsx';
import { buildIntroTimeline, createRig } from './timeline.js';

const BRAND = 'OSSIDIANA';

/**
 * FASE 1 — Intro cinematografica a schermo intero, inquadratura 16:9.
 * 0–2 s specchio e gioielli · 2–3 s caduta · 3–4 s bianco · 4–5 s appaiono i capi.
 * Si può saltare con il pulsante, con Esc, Invio o Spazio.
 */
export default function CinematicIntro({ onExitStart, onFinish }) {
  const { visibleCategories, productsIn } = useShop();
  const rig = useMemo(() => createRig(), []);
  const [phase, setPhase] = useState('city');
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const root = useRef();
  const flash = useRef();
  const caption = useRef();
  const logo = useRef();
  const tagline = useRef();
  const timecode = useRef();
  const tl = useRef();
  const exiting = useRef(false);

  // un capo per ogni categoria visibile (max 7) per il reveal finale
  const revealProducts = useMemo(
    () =>
      visibleCategories
        .map((c) => productsIn(c.id)[0])
        .filter(Boolean)
        .slice(0, 7),
    // il reveal usa lo stato del catalogo al momento dell'avvio
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const exit = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    tl.current?.pause();
    onExitStart?.();
    gsap.to(root.current, {
      opacity: 0,
      scale: 1.04,
      duration: 0.75,
      ease: 'power2.inOut',
      onComplete: () => {
        setPaused(true);
        onFinish?.();
      },
    });
  }, [onExitStart, onFinish]);

  const handleReady = useCallback(() => setReady(true), []);

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const t = buildIntroTimeline({
      rig,
      dom: {
        flash: flash.current,
        caption: caption.current,
        tagline: tagline.current,
        timecode: timecode.current,
        logoChars: logo.current ? Array.from(logo.current.querySelectorAll('span')) : [],
      },
      setPhase,
      onDone: exit,
      reducedMotion: DEVICE.reducedMotion,
    });
    tl.current = t;
    return () => t.kill();
  }, [ready, rig, exit]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        exit();
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('is-locked');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [exit]);

  return (
    <div className="intro" ref={root} role="dialog" aria-label="Introduzione cinematografica">
      <div className="intro__frame">
        <IntroCanvas rig={rig} phase={phase} products={revealProducts} onReady={handleReady} paused={paused} />
        <div className="intro__vignette" aria-hidden />
        <div className="intro__grain" aria-hidden />
        <div className="intro__flash" ref={flash} aria-hidden />

        <div className="intro__caption" ref={caption}>
          <span>Capitolo 01</span>
          <strong>Riflesso</strong>
        </div>
        <div className="intro__hud" aria-hidden>
          <span className="intro__rec" />
          <span ref={timecode}>00:00:00:00</span>
        </div>

        <div className="intro__brand">
          <h1 className="intro__logo" ref={logo} aria-label={BRAND}>
            {BRAND.split('').map((ch, i) => (
              <span key={i} aria-hidden>
                {ch}
              </span>
            ))}
          </h1>
          <p className="intro__tagline" ref={tagline}>
            Atelier urbano · Collezione Notte
          </p>
        </div>
      </div>

      {!ready && <div className="intro__loading">Caricamento scena…</div>}
      <button type="button" className="intro__skip" onClick={exit}>
        Salta intro <span aria-hidden>→</span>
      </button>
    </div>
  );
}
