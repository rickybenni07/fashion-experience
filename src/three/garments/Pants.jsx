import { useMemo } from 'react';
import { cached, inflateShape } from '../geometry.js';
import { pantsShape, roundedRect } from '../shapes.js';
import { useMaterial } from '../materials.js';

const THICK = 0.09;

export default function Pants({ colors, options = {} }) {
  const cargo = options.cargo !== false;
  const geo = useMemo(
    () =>
      cached('pants', () => ({
        body: inflateShape(pantsShape(), { thickness: THICK, round: 0.1, wrinkle: 0.008, res: 90 }),
        waist: inflateShape(roundedRect(0.5, 0.08, 0.015), { thickness: 0.096, round: 0.03, res: 90 }),
        pocket: inflateShape(roundedRect(0.13, 0.16, 0.02), { thickness: 0.025, round: 0.03, res: 40 }),
        flap: inflateShape(roundedRect(0.14, 0.045, 0.012), { thickness: 0.03, round: 0.015, res: 40 }),
        cuff: inflateShape(roundedRect(0.2, 0.05, 0.015), { thickness: 0.07, round: 0.03, res: 50 }),
      })),
    [],
  );
  const fabric = useMaterial(cargo ? 'ripstop' : 'satin', colors.primary, cargo ? undefined : { roughness: 0.55, sheen: 0.3 });
  const trim = useMaterial(cargo ? 'ripstop' : 'rib', colors.secondary || colors.primary);
  const metal = useMaterial('metal', '#7a7570', { roughness: 0.35 });

  return (
    <group>
      <mesh geometry={geo.body} material={fabric} castShadow receiveShadow />
      <mesh geometry={geo.waist} material={trim} position={[0, 0.43, 0]} castShadow />
      <mesh material={metal} position={[0, 0.43, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.008, 24]} />
      </mesh>
      {[-0.2, -0.1, 0.1, 0.2].map((x) => (
        <mesh key={x} material={trim} position={[x, 0.43, 0.098]}>
          <boxGeometry args={[0.012, 0.075, 0.006]} />
        </mesh>
      ))}
      {/* patta */}
      <mesh material={trim} position={[0.03, 0.29, THICK + 0.002]}>
        <boxGeometry args={[0.005, 0.16, 0.004]} />
      </mesh>
      {cargo &&
        [-1, 1].map((s) => (
          <group key={s} position={[s * 0.185, -0.08, 0]}>
            <mesh geometry={geo.pocket} material={fabric} position={[0, 0, 0.083]} castShadow />
            <mesh geometry={geo.flap} material={trim} position={[0, 0.075, 0.09]} castShadow />
            <mesh material={metal} position={[0, 0.07, 0.122]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />
            </mesh>
          </group>
        ))}
      {!cargo &&
        [-1, 1].map((s) => (
          <mesh key={s} geometry={geo.cuff} material={trim} position={[s * 0.157, -0.53, 0]} castShadow />
        ))}
    </group>
  );
}
