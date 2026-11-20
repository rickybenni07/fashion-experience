import { useMemo, useRef, useState } from 'react';
import { useShop } from '../../store/ShopContext.jsx';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import ProductGrid from './ProductGrid.jsx';
import NotFound from './NotFound.jsx';

const SORTS = {
  featured: { label: 'In evidenza', fn: (a, b) => Number(b.featured) - Number(a.featured) },
  priceAsc: { label: 'Prezzo crescente', fn: (a, b) => a.price - b.price },
  priceDesc: { label: 'Prezzo decrescente', fn: (a, b) => b.price - a.price },
  name: { label: 'Nome A–Z', fn: (a, b) => a.name.localeCompare(b.name, 'it') },
};

export default function CategoryPage({ id }) {
  const { categoryById, productsIn, visibleCategories } = useShop();
  const [sort, setSort] = useState('featured');
  const scope = useRef();
  const category = categoryById[id];
  const products = useMemo(() => (category ? [...productsIn(id)].sort(SORTS[sort].fn) : []), [category, id, productsIn, sort]);
  useScrollReveal(scope, [id, sort, products.length]);

  if (!category) return <NotFound />;

  return (
    <div ref={scope} className="page page--category">
      <header className="cat-hero">
        <p className="eyebrow" data-reveal>
          <a href="#/">Home</a> / {category.name}
        </p>
        <h1 className="display display--xl" data-reveal>
          {category.name}
        </h1>
        {category.tagline && (
          <p className="cat-hero__tag" data-reveal>
            {category.tagline}
          </p>
        )}
      </header>

      <div className="toolbar" data-reveal>
        <nav className="chips" aria-label="Altre categorie">
          {visibleCategories.map((c) => (
            <a key={c.id} href={`#/c/${c.id}`} className={`chip${c.id === id ? ' is-on' : ''}`} aria-current={c.id === id ? 'page' : undefined}>
              {c.name}
            </a>
          ))}
        </nav>
        <label className="sort">
          <span>Ordina</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="count" data-reveal>
        {products.length} {products.length === 1 ? 'articolo' : 'articoli'}
      </p>
      <ProductGrid products={products} empty="Questa categoria è vuota: assegnale dei prodotti da “Gestisci catalogo”." />
    </div>
  );
}
