import { useEffect, useState } from 'react';

/**
 * Router minimale basato sull'hash: funziona su qualsiasi hosting statico senza configurazione.
 *   #/                 home
 *   #/c/:categoryId    categoria
 *   #/p/:productId     scheda prodotto
 *   #/checkout         checkout
 */
export function parseHash(hash = window.location.hash) {
  const path = hash.replace(/^#/, '') || '/';
  const parts = path.split('?')[0].split('/').filter(Boolean);
  if (parts[0] === 'c' && parts[1]) return { name: 'category', id: decodeURIComponent(parts[1]), path };
  if (parts[0] === 'p' && parts[1]) return { name: 'product', id: decodeURIComponent(parts[1]), path };
  if (parts[0] === 'checkout') return { name: 'checkout', path };
  if (parts.length === 0) return { name: 'home', path: '/' };
  return { name: 'notfound', path };
}

export function navigate(to) {
  if (window.location.hash.replace(/^#/, '') === to) return;
  window.location.hash = to;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
