import { useRef, useState } from 'react';
import gsap from 'gsap';
import { getVariant, useShop } from '../../store/ShopContext.jsx';
import { formatPrice } from '../../utils/format.js';
import MiniProduct from './MiniProduct.jsx';
import { ColorSwatches } from './VariantPicker.jsx';

export default function ProductCard({ product }) {
  const { addToCart, openCart, categoryById } = useShop();
  const [hover, setHover] = useState(false);
  const [colorId, setColorId] = useState(product.colors[0].id);
  const [picking, setPicking] = useState(false);
  const card = useRef();
  const colors = getVariant(product, colorId);
  const oneSize = product.sizes.length === 1;

  // inclinazione prospettica che segue il puntatore
  const onMove = (e) => {
    const r = card.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card.current, { rotateY: x * 6, rotateX: -y * 6, duration: 0.6, ease: 'power3.out' });
  };
  const onLeave = () => {
    setHover(false);
    gsap.to(card.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' });
  };

  const quickAdd = (size) => {
    addToCart(product.id, colorId, size, 1);
    setPicking(false);
    openCart(true);
  };

  return (
    <article ref={card} className="pcard" data-reveal onMouseEnter={() => setHover(true)} onMouseMove={onMove} onMouseLeave={onLeave}>
      <a href={`#/p/${product.id}`} className="pcard__media" aria-label={`Apri ${product.name}`}>
        <MiniProduct product={product} colors={colors} active={hover} className="pcard__view" />
        <span className="pcard__badge">3D</span>
        <span className="pcard__cat">{categoryById[product.category]?.name}</span>
      </a>
      <div className="pcard__body">
        <div className="pcard__row">
          <h3>
            <a href={`#/p/${product.id}`}>{product.name}</a>
          </h3>
          <span className="pcard__price">{formatPrice(product.price)}</span>
        </div>
        <p className="pcard__tag">{product.tagline}</p>
        <div className="pcard__foot">
          <ColorSwatches colors={product.colors} value={colorId} onChange={setColorId} size="sm" label={false} />
          {!picking ? (
            <button type="button" className="pcard__add" onClick={() => (oneSize ? quickAdd(product.sizes[0]) : setPicking(true))}>
              Aggiungi
            </button>
          ) : (
            <button type="button" className="pcard__add is-ghost" onClick={() => setPicking(false)}>
              Annulla
            </button>
          )}
        </div>
        {picking && (
          <div className="pcard__sizes" role="group" aria-label="Scegli la taglia">
            {product.sizes.map((s) => (
              <button key={s} type="button" onClick={() => quickAdd(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
