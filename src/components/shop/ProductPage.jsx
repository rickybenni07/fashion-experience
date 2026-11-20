import { useEffect, useRef, useState } from 'react';
import { useShop } from '../../store/ShopContext.jsx';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import { formatPrice } from '../../utils/format.js';
import ProductStage from '../viewer/ProductStage.jsx';
import ProductGrid from './ProductGrid.jsx';
import NotFound from './NotFound.jsx';
import { ColorSwatches, QtyStepper, SizePicker } from './VariantPicker.jsx';

export default function ProductPage({ id }) {
  const { productById, categoryById, productsIn, visibleProducts, addToCart, openCart } = useShop();
  const product = productById[id];
  const [colorId, setColorId] = useState(product?.colors[0].id);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const scope = useRef();

  useEffect(() => {
    if (!product) return;
    setColorId(product.colors[0].id);
    setSize(product.sizes.length === 1 ? product.sizes[0] : null);
    setQty(1);
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useScrollReveal(scope, [id]);

  if (!product) return <NotFound />;

  const category = categoryById[product.category];
  const siblings = productsIn(product.category);
  const pos = siblings.findIndex((p) => p.id === product.id);
  const prev = siblings[(pos - 1 + siblings.length) % siblings.length];
  const next = siblings[(pos + 1) % siblings.length];
  const related = [...siblings.filter((p) => p.id !== product.id), ...visibleProducts.filter((p) => p.category !== product.category && p.featured)].slice(0, 4);

  const add = () => {
    if (!size) {
      setError('scegli una taglia');
      return;
    }
    addToCart(product.id, colorId, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    openCart(true);
  };

  return (
    <div ref={scope} className="page page--product">
      <div className="pdp">
        <div className="pdp__stage">
          <ProductStage product={product} colorId={colorId} hotspots />
        </div>

        <section className="pdp__panel" aria-labelledby="pdp-title">
          <p className="eyebrow" data-reveal>
            <a href="#/">Home</a> / {category ? <a href={`#/c/${category.id}`}>{category.name}</a> : 'Senza categoria'}
          </p>
          <h1 id="pdp-title" className="display" data-reveal>
            {product.name}
          </h1>
          <p className="pdp__price" data-reveal>
            {formatPrice(product.price)}
            <small>IVA inclusa</small>
          </p>
          <p className="pdp__desc" data-reveal>
            {product.description}
          </p>

          <div className="pdp__block" data-reveal>
            <ColorSwatches colors={product.colors} value={colorId} onChange={setColorId} />
          </div>
          <div className="pdp__block" data-reveal>
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
          <div className="pdp__buy" data-reveal>
            <QtyStepper value={qty} onChange={setQty} />
            <button type="button" className={`btn btn--solid btn--wide${added ? ' is-done' : ''}`} onClick={add}>
              {added ? 'Aggiunto ✓' : `Aggiungi · ${formatPrice(product.price * qty)}`}
            </button>
          </div>

          <details className="pdp__details" open data-reveal>
            <summary>Dettagli e materiali</summary>
            <ul>
              {product.details?.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
          <details className="pdp__details" data-reveal>
            <summary>Spedizione e resi</summary>
            <p>Spedizione assicurata in 24/48 h, gratuita sopra i 300 €. Reso gratuito entro 30 giorni.</p>
          </details>

          {siblings.length > 1 && (
            <nav className="pdp__nav" aria-label="Altri prodotti della categoria" data-reveal>
              <a href={`#/p/${prev.id}`}>← {prev.name}</a>
              <a href={`#/p/${next.id}`}>{next.name} →</a>
            </nav>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <section className="section" aria-labelledby="rel-title">
          <header className="section__head" data-reveal>
            <p className="eyebrow">Completa il look</p>
            <h2 id="rel-title" className="display">
              Potrebbe piacerti
            </h2>
          </header>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
