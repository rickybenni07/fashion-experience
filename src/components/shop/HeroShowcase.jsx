import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useShop } from '../../store/ShopContext.jsx';
import { formatPrice, pad2 } from '../../utils/format.js';
import ProductStage from '../viewer/ProductStage.jsx';
import { ColorSwatches, SizePicker } from './VariantPicker.jsx';

/**
 * FASE 2 — Esperienza 3D in homepage: un capo alla volta, ruotabile e zoomabile,
 * con passaggio animato tra i prodotti (frecce, tastiera, binario in basso) e varianti colore.
 */
export default function HeroShowcase() {
  const { visibleProducts, categoryById, addToCart, openCart } = useShop();
  const list = useMemo(() => {
    const f = visibleProducts.filter((p) => p.featured);
    return f.length ? f : visibleProducts.slice(0, 6);
  }, [visibleProducts]);

  const [index, setIndex] = useState(0);
  const product = list[Math.min(index, list.length - 1)];
  const [colorId, setColorId] = useState(product?.colors[0].id);
  const [size, setSize] = useState(null);
  const [error, setError] = useState('');
  const info = useRef();
  const title = useRef();
  const root = useRef();

  useEffect(() => {
    if (!product) return;
    setColorId(product.colors[0].id);
    setSize(product.sizes.length === 1 ? product.sizes[0] : null);
    setError('');
  }, [product]);

  // testo che entra a ogni cambio di prodotto
  useLayoutEffect(() => {
    if (!info.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-swap]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', delay: 0.25 });
      gsap.fromTo(title.current.querySelectorAll('span'), { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.025, ease: 'power4.out', delay: 0.2 });
    }, info);
    return () => ctx.revert();
  }, [product?.id]);

  // ingresso della sezione (dopo l'intro)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero__headline > span', { yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.15 });
      gsap.from('.hero__rail', { opacity: 0, y: 30, duration: 1, delay: 0.5, ease: 'power3.out' });
    }, root);
    return () => ctx.revert();
  }, []);

  const go = (d) => setIndex((i) => (i + d + list.length) % list.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  if (!product) return null;

  const add = () => {
    if (!size) return setError('scegli una taglia');
    addToCart(product.id, colorId, size, 1);
    openCart(true);
    return undefined;
  };

  return (
    <section className="hero" ref={root} aria-label="Esperienza 3D">
      <h2 className="hero__headline" aria-label="Oggetti da guardare da ogni lato">
        <span>Oggetti da guardare</span>
        <span>
          <em>da ogni lato.</em>
        </span>
      </h2>

      <div className="hero__grid">
        <ProductStage product={product} colorId={colorId} hotspots className="hero__stage" />

        <aside className="hero__info" ref={info}>
          <p className="eyebrow" data-swap>
            {pad2(index + 1)} / {pad2(list.length)} · {categoryById[product.category]?.name}
          </p>
          <h3 className="hero__title" ref={title} aria-label={product.name}>
            {product.name.split(' ').map((w, i) => (
              <span className="word" key={i} aria-hidden>
                <span>{w}</span>
              </span>
            ))}
          </h3>
          <p className="hero__price" data-swap>
            {formatPrice(product.price)}
          </p>
          <p className="hero__desc" data-swap>
            {product.description}
          </p>
          <div data-swap>
            <ColorSwatches colors={product.colors} value={colorId} onChange={setColorId} />
          </div>
          {product.sizes.length > 1 && (
            <div data-swap>
              <SizePicker
                sizes={product.sizes}
                value={size}
                onChange={(s) => {
                  setSize(s);
                  setError('');
                }}
                error={error}
              />
            </div>
          )}
          <div className="hero__actions" data-swap>
            <button type="button" className="btn btn--solid" onClick={add}>
              Aggiungi al carrello
            </button>
            <a className="btn btn--ghost" href={`#/p/${product.id}`}>
              Scheda completa
            </a>
          </div>
        </aside>
      </div>

      <nav className="hero__rail" aria-label="Prodotti in evidenza">
        <button type="button" className="rail-arrow" onClick={() => go(-1)} aria-label="Prodotto precedente">
          ←
        </button>
        <ol>
          {list.map((p, i) => (
            <li key={p.id}>
              <button type="button" className={i === index ? 'is-on' : ''} onClick={() => setIndex(i)} aria-current={i === index}>
                <span className="rail-num">{pad2(i + 1)}</span>
                <span className="rail-name">{p.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="rail-arrow" onClick={() => go(1)} aria-label="Prodotto successivo">
          →
        </button>
      </nav>
    </section>
  );
}
