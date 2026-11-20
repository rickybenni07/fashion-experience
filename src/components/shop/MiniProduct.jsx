import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, View } from '@react-three/drei';
import ProductModel from '../../three/ProductModel.jsx';
import { BlobShadow, StudioEnvironment } from '../../three/env.jsx';

function Spinner({ product, colors, active }) {
  const g = useRef();
  useFrame((state, dt) => {
    if (!g.current) return;
    const d = Math.min(dt, 0.05);
    g.current.rotation.y += d * (active ? 1.5 : 0.32);
    const s = THREE.MathUtils.damp(g.current.scale.x, active ? 1.07 : 1, 6, d);
    g.current.scale.setScalar(s);
    g.current.position.y = Math.sin(state.clock.elapsedTime * 1.2 + product.price) * 0.02;
  });
  return (
    <group ref={g}>
      <ProductModel product={product} colors={colors} />
    </group>
  );
}

/** Vista 3D compatta (card, categorie, carrello). Disegnata nel canvas condiviso. */
export default function MiniProduct({ product, colors, active = false, className = '', distance = 3.3 }) {
  return (
    <View className={className}>
      <PerspectiveCamera makeDefault position={[0, 0.2, distance]} fov={30} />
      <StudioEnvironment intensity={0.95} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.8} />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.7} color="#ffd9c2" />
      <Spinner product={product} colors={colors} active={active} />
      <BlobShadow y={-0.78} scale={1.9} opacity={0.6} />
    </View>
  );
}
