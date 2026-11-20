import { useMaterial } from '../materials.js';

export default function Ring({ colors }) {
  const metal = useMaterial('gold', colors.primary);
  const onyx = useMaterial('onyx', colors.secondary || '#0a0a0a');
  const gem = useMaterial('gem', colors.accent || '#ffffff');

  return (
    <group rotation={[0.45, -0.5, 0]} position={[0, -0.12, 0]} scale={2.2}>
      <mesh material={metal} castShadow receiveShadow>
        <torusGeometry args={[0.13, 0.034, 48, 128]} />
      </mesh>
      {/* testa a sigillo */}
      <group position={[0, 0.16, 0]}>
        <mesh material={metal} castShadow>
          <cylinderGeometry args={[0.072, 0.06, 0.045, 64]} />
        </mesh>
        <mesh material={onyx} position={[0, 0.0235, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.004, 64]} />
        </mesh>
        <mesh material={gem} position={[0, 0.034, 0]} scale={[1, 0.6, 1]}>
          <octahedronGeometry args={[0.02, 0]} />
        </mesh>
      </group>
    </group>
  );
}
