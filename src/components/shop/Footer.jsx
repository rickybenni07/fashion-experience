import { useShop } from '../../store/ShopContext.jsx';

export default function Footer({ onReplayIntro, onEditor }) {
  const { visibleCategories } = useShop();
  return (
    <footer className="ftr">
      <div className="ftr__brand">
        <p className="ftr__logo">OSSIDIANA</p>
        <p>Atelier urbano. Streetwear di lusso progettato per essere guardato da ogni lato.</p>
      </div>
      <nav aria-label="Categorie nel footer">
        <p className="eyebrow">Negozio</p>
        {visibleCategories.map((c) => (
          <a key={c.id} href={`#/c/${c.id}`}>
            {c.name}
          </a>
        ))}
      </nav>
      <div>
        <p className="eyebrow">Esperienza</p>
        <button type="button" className="link-btn" onClick={onReplayIntro}>
          Rivedi l’intro
        </button>
        <button type="button" className="link-btn" onClick={onEditor}>
          Gestisci catalogo
        </button>
      </div>
      <p className="ftr__legal">© {new Date().getFullYear()} OSSIDIANA. Tutti i diritti riservati.</p>
    </footer>
  );
}
