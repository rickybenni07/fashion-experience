import gsap from 'gsap';

/**
 * Lo stato dell'intro è un semplice oggetto ("rig") animato da GSAP
 * e letto ogni frame dalle scene 3D. Così un'unica timeline orchestra
 * camera, personaggio, flash bianco, reveal dei capi e interfaccia.
 *
 * Convenzioni angoli (radianti): valori positivi = flessione in avanti / abduzione verso l'esterno.
 */
export function createRig() {
  return {
    time: 0,
    // camera
    camX: 2.4, camY: 1.9, camZ: 3.8,
    tgtX: 0, tgtY: 1.25, tgtZ: -0.6,
    fov: 34, roll: 0, shake: 0,
    // personaggio
    shRX: 0.05, shRZ: 0.1, elR: 0.15,
    shLX: 0.05, shLZ: 0.1, elL: 0.15,
    fidget: 0, headX: 0.05, headY: 0, torsoX: 0, torsoZ: 0,
    hipL: 0, kneeL: 0, hipR: 0, kneeR: 0,
    fall: 0, fallZ: 0,
    // reveal
    reveal: 0,
  };
}

export const INTRO_TIMES = { slip: 2.0, impact: 2.8, white: 2.84, swap: 3.3, reveal: 3.95, end: 5.55 };

export function buildIntroTimeline({ rig, dom, setPhase, onDone, reducedMotion }) {
  const T = INTRO_TIMES;
  const shakeK = reducedMotion ? 0.25 : 1;
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onUpdate() {
      rig.time = tl.time();
      if (dom.timecode) {
        const t = tl.time();
        const s = Math.floor(t);
        const f = Math.floor((t - s) * 24);
        dom.timecode.textContent = `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
      }
    },
    onComplete: onDone,
  });

  // ── 0–2 s · specchio e gioielli ───────────────────────────────────────────
  tl.fromTo(dom.caption, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.15);
  tl.to(rig, { camX: 0.62, camY: 1.62, camZ: 1.28, tgtX: -0.05, tgtY: 1.5, tgtZ: -1.05, fov: 30, duration: 1.95 }, 0);
  tl.to(rig, { shRX: 0.8, shRZ: -0.28, elR: 2.5, shLX: 0.75, shLZ: -0.3, elL: 2.45, headX: 0.28, duration: 0.65, ease: 'power3.out' }, 0.15);
  tl.to(rig, { fidget: 1, duration: 0.2 }, 0.7);
  tl.to(rig, { headX: -0.06, headY: 0.18, duration: 0.5 }, 1.1);
  tl.to(rig, { shLX: 0.12, shLZ: 0.1, elL: 0.3, fidget: 0.45, duration: 0.42 }, 1.45);

  // ── 2–3 s · perde l'equilibrio e cade ─────────────────────────────────────
  tl.to(
    rig,
    {
      hipL: 1.0, kneeL: 0.15, hipR: -0.15, kneeR: 0.6, torsoX: -0.35, torsoZ: 0.08,
      shRX: -0.5, shRZ: 1.3, elR: 0.4, shLX: -0.4, shLZ: 1.35, elL: 0.5,
      headX: -0.45, headY: 0, fidget: 0, shake: 0.035 * shakeK,
      duration: 0.28, ease: 'power2.out',
    },
    T.slip,
  );
  tl.to(rig, { fall: -1.42, fallZ: 0.18, duration: 0.62, ease: 'power2.in' }, T.slip + 0.18);
  tl.to(rig, { camX: 1.1, camY: 2.9, camZ: 2.15, tgtX: 0, tgtY: 0.25, tgtZ: 0.9, fov: 40, roll: 0.09, duration: 0.85, ease: 'power3.out' }, T.slip + 0.05);
  tl.to(rig, { shake: 0.16 * shakeK, duration: 0.06, ease: 'none' }, T.impact);
  tl.to(rig, { fall: -1.33, duration: 0.11, ease: 'power1.out', yoyo: true, repeat: 1 }, T.impact);
  tl.to(rig, { shake: 0, duration: 0.45, ease: 'power2.out' }, T.impact + 0.06);
  tl.to(dom.caption, { opacity: 0, duration: 0.2 }, T.slip + 0.6);

  // ── 3–4 s · tutto bianco ──────────────────────────────────────────────────
  tl.to(dom.flash, { opacity: 1, duration: 0.3, ease: 'power4.in' }, T.white);
  tl.call(() => setPhase('reveal'), null, T.swap);

  // ── 4–5 s · appaiono i capi ───────────────────────────────────────────────
  tl.to(rig, { reveal: 1, duration: 1.2, ease: 'none' }, T.reveal);
  tl.to(dom.flash, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 4.0);
  if (dom.logoChars?.length) {
    tl.fromTo(dom.logoChars, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power4.out' }, 4.25);
  }
  tl.fromTo(dom.tagline, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, 4.6);
  tl.to({}, { duration: 0.01 }, T.end);

  return tl;
}
