import { useEffect, useState } from 'react';
import { useShop } from '../../store/ShopContext.jsx';

export default function Header({ route, onEditor, onMenu, menuOpen }) {
  const { visibleCategories, cartCount, openCart } = useShop();
  const [solid, setSolid] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // piccolo "battito" del contatore quando cambia
  useEffect(() => {
    if (!cartCount) return undefined;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [cartCount]);

  return (
    <header className={`hdr${solid ? ' is-solid' : ''}`}>
      <a href="#/" className="hdr__logo" aria-label="OSSIDIANA, home">
        <span>OSSIDIANA</span>
        <small>Atelier urbano</small>
      </a>
      <nav className="hdr__nav" aria-label="Categorie">
        {visibleCategories.map((c) => (
          <a key={c.id} href={`#/c/${c.id}`} className={route.name === 'category' && route.id === c.id ? 'is-on' : ''}>
            {c.name}
          </a>
        ))}
      </nav>
      <div className="hdr__actions">
        <button type="button" className="hdr__edit" onClick={onEditor}>
          Gestisci catalogo
        </button>
        <button type="button" className={`hdr__cart${bump ? ' is-bump' : ''}`} onClick={() => openCart(true)} aria-label={`Carrello, ${cartCount} articoli`}>
          Carrello <span>{cartCount}</span>
        </button>
        <button type="button" className={`hdr__burger${menuOpen ? ' is-open' : ''}`} onClick={onMenu} aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'} aria-expanded={menuOpen}>
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
