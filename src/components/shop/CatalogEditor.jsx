import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useShop } from '../../store/ShopContext.jsx';

/**
 * Editor del catalogo (salvato in localStorage):
 * categorie — rinomina, sottotitolo, mostra/nascondi, ordina, aggiungi, elimina (se vuota);
 * prodotti — nome, prezzo, categoria, in evidenza.
 */
export default function CatalogEditor({ open, onClose }) {
  const shop = useShop();
  const { categories, products, productsIn } = shop;
  const [tab, setTab] = useState('categorie');
  const [newName, setNewName] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const root = useRef();
  const panel = useRef();

  useLayoutEffect(() => {
    const tl = gsap.timeline();
    if (open) {
      gsap.set(root.current, { visibility: 'visible' });
      tl.to(root.current.querySelector('.drawer__overlay'), { opacity: 1, duration: 0.35 }, 0).fromTo(
        panel.current,
        { xPercent: -100 },
        { xPercent: 0, duration: 0.6, ease: 'expo.out' },
        0,
      );
    } else {
      tl.to(panel.current, { xPercent: -100, duration: 0.4, ease: 'power3.in' }, 0)
        .to(root.current.querySelector('.drawer__overlay'), { opacity: 0, duration: 0.3 }, 0.1)
        .set(root.current, { visibility: 'hidden' });
    }
    return () => tl.kill();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('is-locked');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [open, onClose]);

  const add = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    shop.addCategory(newName);
    setNewName('');
  };

  return (
    <div className="drawer drawer--left" ref={root} style={{ visibility: 'hidden' }} aria-hidden={!open}>
      <div className="drawer__overlay" onClick={onClose} />
      <aside className="drawer__panel editor" ref={panel} role="dialog" aria-modal="true" aria-label="Gestisci catalogo">
        <header className="drawer__head">
          <h2>Gestisci catalogo</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Chiudi editor">
            ✕
          </button>
        </header>

        <div className="tabs" role="tablist">
          {['categorie', 'prodotti'].map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>
              {t === 'categorie' ? `Categorie (${categories.length})` : `Prodotti (${products.length})`}
            </button>
          ))}
        </div>

        <div className="editor__body">
          {tab === 'categorie' ? (
            <>
              <ul className="editor__list">
                {categories.map((c, i) => {
                  const count = productsIn(c.id).length;
                  return (
                    <li key={c.id} className={c.visible ? '' : 'is-hidden'}>
                      <div className="editor__row">
                        <input aria-label="Nome categoria" value={c.name} onChange={(e) => shop.updateCategory(c.id, { name: e.target.value })} />
                        <span className="editor__count">{count}</span>
                      </div>
                      <input
                        className="editor__sub"
                        aria-label="Sottotitolo categoria"
                        placeholder="Sottotitolo (facoltativo)"
                        value={c.tagline}
                        onChange={(e) => shop.updateCategory(c.id, { tagline: e.target.value })}
                      />
                      <div className="editor__actions">
                        <label className="toggle">
                          <input type="checkbox" checked={c.visible} onChange={(e) => shop.updateCategory(c.id, { visible: e.target.checked })} />
                          <span>Visibile</span>
                        </label>
                        <button type="button" onClick={() => shop.moveCategory(c.id, -1)} disabled={i === 0} aria-label={`Sposta ${c.name} su`}>
                          ↑
                        </button>
                        <button type="button" onClick={() => shop.moveCategory(c.id, 1)} disabled={i === categories.length - 1} aria-label={`Sposta ${c.name} giù`}>
                          ↓
                        </button>
                        <a href={`#/c/${c.id}`} onClick={onClose}>
                          Apri
                        </a>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => shop.removeCategory(c.id)}
                          disabled={count > 0}
                          title={count > 0 ? 'Sposta prima i prodotti in un’altra categoria' : 'Elimina categoria'}
                        >
                          Elimina
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <form className="editor__add" onSubmit={add}>
                <input placeholder="Nuova categoria (es. Occhiali)" value={newName} onChange={(e) => setNewName(e.target.value)} aria-label="Nome nuova categoria" />
                <button type="submit" className="btn btn--solid" disabled={!newName.trim()}>
                  Aggiungi
                </button>
              </form>
            </>
          ) : (
            <ul className="editor__list">
              {products.map((p) => (
                <li key={p.id}>
                  <input aria-label="Nome prodotto" value={p.name} onChange={(e) => shop.updateProduct(p.id, { name: e.target.value })} />
                  <div className="editor__grid">
                    <label>
                      <span>Prezzo €</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={p.price}
                        onChange={(e) => shop.updateProduct(p.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                      />
                    </label>
                    <label>
                      <span>Categoria</span>
                      <select value={p.category} onChange={(e) => shop.updateProduct(p.id, { category: e.target.value })}>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="toggle">
                      <input type="checkbox" checked={!!p.featured} onChange={(e) => shop.updateProduct(p.id, { featured: e.target.checked })} />
                      <span>In evidenza</span>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="editor__foot">
          {confirmReset ? (
            <>
              <span>Ripristinare il catalogo originale?</span>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  shop.resetCatalog();
                  setConfirmReset(false);
                }}
              >
                Sì, ripristina
              </button>
              <button type="button" onClick={() => setConfirmReset(false)}>
                Annulla
              </button>
            </>
          ) : (
            <button type="button" className="link-btn" onClick={() => setConfirmReset(true)}>
              Ripristina catalogo originale
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
