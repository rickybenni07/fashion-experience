import { useRef } from 'react';
import { useShop } from '../../store/ShopContext.jsx';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import HeroShowcase from './HeroShowcase.jsx';
import CategoryTiles from './CategoryTiles.jsx';
import ProductGrid from './ProductGrid.jsx';

export default function HomePage() {
  const { visibleProducts, visibleCategories } = useShop();
  const scope = useRef();
  useScrollReveal(scope, [visibleProducts.length, visibleCategories.length]);

  return (
    <div ref={scope} className="page page--home">
      <HeroShowcase />
      <CategoryTiles />

      <section className="manifesto" data-reveal>
        <p>
          Ogni capo nasce come un oggetto da osservare: <em>giralo, avvicinati, cambia la luce.</em> Poi indossalo.
        </p>
      </section>

      <section className="section" aria-labelledby="all-title">
        <header className="section__head" data-reveal>
          <p className="eyebrow">Collezione Notte</p>
          <h2 id="all-title" className="display">
            Tutti i pezzi
          </h2>
        </header>
        <ProductGrid products={visibleProducts} />
      </section>
    </div>
  );
}
