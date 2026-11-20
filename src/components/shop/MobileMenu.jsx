import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useShop } from '../../store/ShopContext.jsx';
import { pad2 } from '../../utils/format.js';

export default function MobileMenu({ open, onClose, onEditor, onReplayIntro }) {
  const { visibleCategories } = useShop();
  const root = useRef();

  useLayoutEffect(() => {
    const el = root.current;
    const tl = gsap.timeline();
    if (open) {
      gsap.set(el, { visibility: 'visible' });
      tl.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' }).fromTo(
        el.querySelectorAll('li'),
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power4.out' },
        '-=0.3',
      );
    } else {
      tl.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'expo.inOut' }).set(el, { visibility: 'hidden' });
    }
    return () => tl.kill();
  }, [open]);

  return (
    <div className="mmenu" ref={root} style={{ visibility: 'hidden' }} aria-hidden={!open}>
      <ul>
        <li>
          <a href="#/" onClick={onClose}>
            <small>00</small>Home
          </a>
        </li>
        {visibleCategories.map((c, i) => (
          <li key={c.id}>
            <a href={`#/c/${c.id}`} onClick={onClose}>
              <small>{pad2(i + 1)}</small>
              {c.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mmenu__foot">
        <button
          type="button"
          onClick={() => {
            onClose();
            onEditor();
          }}
        >
          Gestisci catalogo
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            onReplayIntro();
          }}
        >
          Rivedi l’intro
        </button>
      </div>
    </div>
  );
}
