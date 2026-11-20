import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ProductModel from '../../three/ProductModel.jsx';
import { getVariant } from '../../store/ShopContext.jsx';
import Hotspots from './Hotspots.jsx';

/**
 * Transizione cinematografica tra prodotti: il capo attuale ruota e scende,
 * il nuovo entra dall'alto con un rimbalzo. Un cambio colore invece è solo
 * un'interpolazione morbida dei materiali (gestita da useMaterial).
 */
export default function SwapModel({ product, colorId, hotspots = false, activeHotspot, onHotspot, float = true }) {
  const group = useRef();
  const inner = useRef();
  const [shown, setShown] = useState(product);
  const latest = useRef(product);
  latest.current = product;

  useEffect(() => {
    const g = group.current;
    if (!g) return undefined;
    if (product.id === shown.id) {
      const tl = gsap.timeline();
      tl.to(g.rotation, { y: 0, duration: 0.6, ease: 'power3.out' }, 0)
        .to(g.position, { y: 0, duration: 0.6, ease: 'power3.out' }, 0)
        .to(g.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'power3.out' }, 0);
      return () => tl.kill();
    }
    const tl = gsap.timeline();
    tl.to(g.rotation, { y: g.rotation.y + Math.PI * 0.6, duration: 0.42, ease: 'power2.in' }, 0)
      .to(g.position, { y: -0.35, duration: 0.42, ease: 'power2.in' }, 0)
      .to(g.scale, { x: 0.55, y: 0.55, z: 0.55, duration: 0.42, ease: 'power2.in' }, 0)
      .add(() => {
        setShown(latest.current);
        g.rotation.y = -Math.PI * 0.6;
        g.position.y = 0.45;
      })
      .to(g.rotation, { y: 0, duration: 0.85, ease: 'power3.out' })
      .to(g.position, { y: 0, duration: 0.85, ease: 'power3.out' }, '<')
      .to(g.scale, { x: 1, y: 1, z: 1, duration: 0.85, ease: 'back.out(1.6)' }, '<');
    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // leggero fluttuare "in sospensione"
  useEffect(() => {
    if (!float || !inner.current) return undefined;
    const tw = gsap.to(inner.current.position, { y: 0.03, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return () => tw.kill();
  }, [float]);

  const colors = shown.id === product.id ? getVariant(product, colorId) : shown.colors[0];

  return (
    <group ref={group}>
      <group ref={inner}>
        <ProductModel product={shown} colors={colors} />
        {hotspots && shown.id === product.id && <Hotspots product={shown} active={activeHotspot} onSelect={onHotspot} />}
      </group>
    </group>
  );
}
