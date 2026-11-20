import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { DEVICE } from '../../utils/device.js';

/**
 * Transizione cinematografica tra le pagine: un sipario scuro sale, la pagina cambia
 * mentre è coperta, poi il sipario esce dall'alto.
 */
export default function RouteCurtain({ route, render }) {
  const [shown, setShown] = useState(route);
  const curtain = useRef();
  const label = useRef();

  useEffect(() => {
    if (route.path === shown.path) {
      // navigazione annullata a metà: richiudi il sipario se era rimasto aperto
      const el = curtain.current;
      if (el && Number(gsap.getProperty(el, 'scaleY')) > 0) {
        gsap.to(el, { scaleY: 0, duration: 0.4, ease: 'power3.out', onComplete: () => gsap.set(el, { display: 'none' }) });
      }
      return undefined;
    }
    if (DEVICE.reducedMotion) {
      setShown(route);
      window.scrollTo(0, 0);
      return undefined;
    }
    const el = curtain.current;
    const tl = gsap.timeline();
    tl.set(el, { display: 'flex', transformOrigin: '50% 100%' })
      .to(el, { scaleY: 1, duration: 0.5, ease: 'expo.inOut' })
      .fromTo(label.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, '-=0.2')
      .add(() => {
        setShown(route);
        window.scrollTo(0, 0);
      })
      .set(el, { transformOrigin: '50% 0%' }, '+=0.08')
      .to(label.current, { opacity: 0, duration: 0.15 })
      .to(el, { scaleY: 0, duration: 0.6, ease: 'expo.inOut' }, '<')
      .set(el, { display: 'none' });
    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.path]);

  return (
    <>
      {render(shown)}
      <div className="curtain" ref={curtain} aria-hidden>
        <span ref={label}>OSSIDIANA</span>
      </div>
    </>
  );
}
