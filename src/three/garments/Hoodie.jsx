import { useMemo } from 'react';
import { cached, inflateShape, tube } from '../geometry.js';
import { hoodShape, longSleeveShape, roundedRect, trapezoid } from '../shapes.js';
import { useMaterial } from '../materials.js';

const THICK = 0.12;

export default function Hoodie({ colors }) {
  const geo = useMemo(
    () =>
      cached('hoodie', () => ({
        body: inflateShape(longSleeveShape(1), { thickness: THICK, round: 0.16, wrinkle: 0.007 }),
        hood: inflateShape(hoodShape(1), { thickness: 0.08, round: 0.1, res: 80 }),
        lining: inflateShape(hoodShape(0.76), { thickness: 0.03, round: 0.05, res: 60 }),
        pocket: inflateShape(trapezoid(0.3, 0.4, 0.2), { thickness: 0.014, round: 0.03, res: 60 }),
        hem: inflateShape(roundedRect(0.6, 0.08, 0.02), { thickness: 0.07, round: 0.035, res: 90 }),
        cuff: inflateShape(roundedRect(0.14, 0.07, 0.02), { thickness: 0.05, round: 0.025, res: 40 }),
        cordL: tube([[-0.05, 0.37, 0.05], [-0.052, 0.3, 0.115], [-0.056, 0.18, 0.13]], 0.0055, 24),
        cordR: tube([[0.05, 0.37, 0.05], [0.052, 0.3, 0.115], [0.058, 0.2, 0.13]], 0.0055, 24),
      })),
    [],
  );
  const fleece = useMaterial('fleece', colors.primary);
  const lining = useMaterial('fleece', colors.secondary || colors.primary);
  const rib = useMaterial('rib', colors.primary);
  const cord = useMaterial('plain', colors.accent || '#e8e2d2');
  const metal = useMaterial('metal', '#d9dde2');

  return (
    <group>
      <mesh geometry={geo.body} material={fleece} castShadow receiveShadow />
      <mesh geometry={geo.hood} material={fleece} position={[0, 0.33, -0.07]} castShadow />
      <mesh geometry={geo.lining} material={lining} position={[0, 0.37, 0]} />
      <mesh geometry={geo.pocket} material={fleece} position={[0, -0.2, THICK - 0.008]} castShadow />
      <mesh geometry={geo.hem} material={rib} position={[0, -0.39, 0]} castShadow />
      <mesh geometry={geo.cuff} material={rib} position={[0.535, -0.3, 0]} rotation={[0, 0, 0.39]} castShadow />
      <mesh geometry={geo.cuff} material={rib} position={[-0.535, -0.3, 0]} rotation={[0, 0, -0.39]} castShadow />
      <mesh geometry={geo.cordL} material={cord} castShadow />
      <mesh geometry={geo.cordR} material={cord} castShadow />
      <mesh material={metal} position={[-0.056, 0.165, 0.13]}>
        <cylinderGeometry args={[0.008, 0.008, 0.03, 12]} />
      </mesh>
      <mesh material={metal} position={[0.058, 0.185, 0.13]}>
        <cylinderGeometry args={[0.008, 0.008, 0.03, 12]} />
      </mesh>
    </group>
  );
}
