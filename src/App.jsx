import { useCallback, useState } from 'react';
import { navigate, useHashRoute } from './hooks/useHashRoute.js';
import CinematicIntro from './components/intro/CinematicIntro.jsx';
import Shop from './components/shop/Shop.jsx';

/**
 * Flusso: intro cinematografica (solo entrando dalla home) → negozio.
 * Durante l'uscita dell'intro il negozio viene già montato sotto, così il passaggio è continuo.
 * Link diretti a categorie/prodotti saltano l'intro.
 */
export default function App() {
  const route = useHashRoute();
  const [intro, setIntro] = useState(() => (route.name === 'home' ? 'playing' : 'done'));

  const replay = useCallback(() => {
    window.scrollTo(0, 0);
    navigate('/');
    setIntro('playing');
  }, []);

  return (
    <>
      {intro !== 'playing' && <Shop route={route} onReplayIntro={replay} />}
      {intro !== 'done' && <CinematicIntro onExitStart={() => setIntro('exiting')} onFinish={() => setIntro('done')} />}
    </>
  );
}
