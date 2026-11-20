import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { FREE_SHIPPING_FROM, useShop } from '../../store/ShopContext.jsx';
import { navigate } from '../../hooks/useHashRoute.js';
import { formatPrice } from '../../utils/format.js';
import { QtyStepper } from './VariantPicker.jsx';

export default function CartDrawer() {
  const { cartOpen, openCart, lines, subtotal, shipping, total, setQty, removeLine, cartCount } = useShop();
  const panel = useRef();
  const overlay = useRef();
  const root = useRef();

  useLayoutEffect(() => {
    const tl = gsap.timeline();
    if (cartOpen) {
      gsap.set(root.current, { visibility: 'visible' });
      tl.to(overlay.current, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
        .fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: 'expo.out' }, 0)
        .fromTo(panel.current.querySelectorAll('[data-line]'), { opacity: 0, x: 30 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.5, ease: 'power3.out' }, 0.15);
    } else {
      tl.to(panel.current, { xPercent: 100, duration: 0.45, ease: 'power3.in' }, 0)
        .to(overlay.current, { opacity: 0, duration: 0.35 }, 0.1)
        .set(root.current, { visibility: 'hidden' });
    }
    return () => tl.kill();
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && openCart(false);
    window.addEventListener('keydown', onKey);
    document.body.classList.add('is-locked');
    panel.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [cartOpen, openCart]);

  const missing = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  return (
    <div className="drawer" ref={root} style={{ visibility: 'hidden' }} aria-hidden={!cartOpen}>
      <div className="drawer__overlay" ref={overlay} onClick={() => openCart(false)} />
      <aside className="drawer__panel" ref={panel} role="dialog" aria-modal="true" aria-label="Carrello" tabIndex={-1}>
        <header className="drawer__head">
          <h2>
            Carrello <span>{cartCount}</span>
          </h2>
          <button type="button" className="icon-btn" onClick={() => openCart(false)} aria-label="Chiudi carrello">
            ✕
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Il carrello è vuoto.</p>
            <button type="button" className="btn btn--ghost" onClick={() => openCart(false)}>
              Continua lo shopping
            </button>
          </div>
        ) : (
          <>
            {subtotal > 0 && (
              <div className="ship-meter">
                <p>{missing > 0 ? `Mancano ${formatPrice(missing)} alla spedizione gratuita` : 'Spedizione gratuita sbloccata'}</p>
                <span style={{ '--p': Math.min(1, subtotal / FREE_SHIPPING_FROM) }} />
              </div>
            )}
            <ul className="drawer__lines">
              {lines.map((l) => (
                <li key={l.key} className="line" data-line>
                  <span className="line__thumb" style={{ '--c1': l.color.primary, '--c2': l.color.secondary || l.color.primary }} aria-hidden />
                  <div className="line__info">
                    <a
                      href={`#/p/${l.product.id}`}
                      onClick={() => openCart(false)}
                      className="line__name"
                    >
                      {l.product.name}
                    </a>
                    <p className="line__meta">
                      {l.color.name} · {l.size}
                    </p>
                    <div className="line__row">
                      <QtyStepper value={l.qty} min={0} small onChange={(q) => setQty(l.key, q)} />
                      <button type="button" className="link-btn" onClick={() => removeLine(l.key)}>
                        Rimuovi
                      </button>
                    </div>
                  </div>
                  <span className="line__price">{formatPrice(l.total)}</span>
                </li>
              ))}
            </ul>
            <footer className="drawer__foot">
              <dl>
                <div>
                  <dt>Subtotale</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div>
                  <dt>Spedizione</dt>
                  <dd>{shipping ? formatPrice(shipping) : 'Gratuita'}</dd>
                </div>
                <div className="total">
                  <dt>Totale</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="btn btn--solid btn--wide"
                onClick={() => {
                  openCart(false);
                  navigate('/checkout');
                }}
              >
                Procedi al checkout
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
