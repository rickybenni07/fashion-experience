import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DEVICE } from '../utils/device.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Anima in ingresso (allo scroll) tutti gli elementi [data-reveal] dentro `scope`.
 * Lo stato iniziale viene impostato via JS: se lo script fallisce il contenuto resta visibile.
 */
export function useScrollReveal(scope, deps = []) {
  useLayoutEffect(() => {
    if (!scope.current || DEVICE.reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(scope.current.querySelectorAll('[data-reveal]'));
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 32 });
      ScrollTrigger.batch(els, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true }),
      });
      ScrollTrigger.refresh();
    }, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
