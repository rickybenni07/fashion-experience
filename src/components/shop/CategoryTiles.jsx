import { useState } from 'react';
import { useShop } from '../../store/ShopContext.jsx';
import { pad2 } from '../../utils/format.js';
import MiniProduct from './MiniProduct.jsx';

function Tile({ category, index }) {
  const { productsIn } = useShop();
  const [hover, setHover] = useState(false);
  const items = productsIn(category.id);
  const lead = items[0];
  return (
    <a
      href={`#/c/${category.id}`}
      className="ctile"
      data-reveal
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <span className="ctile__num">{pad2(index + 1)}</span>
      {lead ? (
        <MiniProduct product={lead} colors={lead.colors[0]} active={hover} className="ctile__view" distance={3.6} />
      ) : (
        <span className="ctile__empty">Nessun prodotto ancora</span>
      )}
      <span className="ctile__meta">
        <strong>{category.name}</strong>
        <span>{category.tagline || `${items.length} articoli`}</span>
      </span>
      <span className="ctile__count">{items.length}</span>
    </a>
  );
}

export default function CategoryTiles() {
  const { visibleCategories } = useShop();
  return (
    <section className="section" aria-labelledby="cat-title">
      <header className="section__head" data-reveal>
        <p className="eyebrow">Categorie</p>
        <h2 id="cat-title" className="display">
          Il guardaroba, <em>stanza per stanza</em>
        </h2>
      </header>
      <div className="ctiles">
        {visibleCategories.map((c, i) => (
          <Tile key={c.id} category={c} index={i} />
        ))}
      </div>
    </section>
  );
}
