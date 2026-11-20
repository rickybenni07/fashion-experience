import { useCallback, useEffect, useState } from 'react';
import Header from './Header.jsx';
import MobileMenu from './MobileMenu.jsx';
import Footer from './Footer.jsx';
import CartDrawer from './CartDrawer.jsx';
import CatalogEditor from './CatalogEditor.jsx';
import RouteCurtain from './RouteCurtain.jsx';
import ViewCanvas from './ViewCanvas.jsx';
import HomePage from './HomePage.jsx';
import CategoryPage from './CategoryPage.jsx';
import ProductPage from './ProductPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import NotFound from './NotFound.jsx';

function renderRoute(r) {
  switch (r.name) {
    case 'home':
      return <HomePage key="home" />;
    case 'category':
      return <CategoryPage key={`c-${r.id}`} id={r.id} />;
    case 'product':
      return <ProductPage key={`p-${r.id}`} id={r.id} />;
    case 'checkout':
      return <CheckoutPage key="checkout" />;
    default:
      return <NotFound key="404" />;
  }
}

/** FASI 3–4 — Negozio: header, pagine con transizioni, carrello, editor catalogo, card 3D. */
export default function Shop({ route, onReplayIntro }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openEditor = useCallback(() => setEditorOpen(true), []);
  const closeEditor = useCallback(() => setEditorOpen(false), []);

  useEffect(() => setMenuOpen(false), [route.path]);

  return (
    <div className="shop">
      <Header route={route} onEditor={openEditor} onMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onEditor={openEditor} onReplayIntro={onReplayIntro} />
      <main className="main">
        <RouteCurtain route={route} render={renderRoute} />
      </main>
      <Footer onReplayIntro={onReplayIntro} onEditor={openEditor} />
      <CartDrawer />
      <CatalogEditor open={editorOpen} onClose={closeEditor} />
      <ViewCanvas />
    </div>
  );
}
