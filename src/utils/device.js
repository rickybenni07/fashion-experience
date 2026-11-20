/**
 * Profilo prestazionale calcolato una volta all'avvio.
 * Usato da tutte le scene per scegliere DPR, ombre, risoluzione dei riflessi ecc.
 */
const mq = (q) => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches;

function detect() {
  if (typeof window === 'undefined') {
    return { tier: 'high', isMobile: false, reducedMotion: false, dpr: [1, 2], shadows: true, shadowMap: 2048, mirrorRes: 1024, reflectiveFloor: true };
  }
  const coarse = mq('(pointer: coarse)');
  const small = window.innerWidth < 820;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const isMobile = coarse || small;

  let tier = 'high';
  if (isMobile) tier = cores <= 4 || memory <= 3 ? 'low' : 'mid';
  else if (cores <= 2) tier = 'mid';

  return {
    tier,
    isMobile,
    reducedMotion: mq('(prefers-reduced-motion: reduce)'),
    dpr: tier === 'high' ? [1, 2] : tier === 'mid' ? [1, 1.6] : [1, 1.25],
    shadows: tier !== 'low',
    shadowMap: tier === 'high' ? 2048 : 1024,
    mirrorRes: tier === 'high' ? 1024 : 512,
    reflectiveFloor: tier === 'high',
  };
}

export const DEVICE = detect();
