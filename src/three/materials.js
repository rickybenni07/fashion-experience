import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { leatherTexture, ribTexture, weaveTexture } from './textures.js';

/**
 * Preset di materiali PBR. Il colore viene poi interpolato in modo fluido
 * da useMaterial quando l'utente cambia variante.
 */
const PRESETS = {
  cotton: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 0.95,
      sheen: 1,
      sheenRoughness: 0.55,
      bumpMap: weaveTexture(),
      bumpScale: 0.8,
      roughnessMap: weaveTexture(),
    }),
  fleece: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 1,
      sheen: 1,
      sheenRoughness: 0.8,
      bumpMap: weaveTexture(),
      bumpScale: 0.5,
    }),
  rib: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 0.95,
      sheen: 0.8,
      sheenRoughness: 0.6,
      bumpMap: ribTexture(),
      bumpScale: 1,
    }),
  ripstop: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 0.82,
      sheen: 0.4,
      sheenRoughness: 0.5,
      bumpMap: weaveTexture(),
      bumpScale: 1,
    }),
  satin: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 0.38,
      sheen: 0.6,
      sheenRoughness: 0.35,
      clearcoat: 0.25,
      clearcoatRoughness: 0.45,
    }),
  nylon: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 0.22,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    }),
  leather: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 0.48,
      clearcoat: 0.45,
      clearcoatRoughness: 0.35,
      bumpMap: leatherTexture(),
      bumpScale: 0.6,
    }),
  rubber: () => new THREE.MeshStandardMaterial({ roughness: 0.78 }),
  plain: () => new THREE.MeshStandardMaterial({ roughness: 0.6 }),
  metal: () => new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.22 }),
  gold: () => new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.14, envMapIntensity: 1.4 }),
  onyx: () => new THREE.MeshPhysicalMaterial({ roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03 }),
  gem: () =>
    new THREE.MeshPhysicalMaterial({
      roughness: 0,
      transmission: 1,
      thickness: 0.35,
      ior: 2.2,
      clearcoat: 1,
      envMapIntensity: 2.2,
      specularIntensity: 1,
    }),
};

const WHITE = new THREE.Color('#ffffff');

/**
 * Restituisce un materiale preset il cui colore si muove dolcemente verso `hex`.
 * @param {keyof PRESETS} preset
 * @param {string} hex
 * @param {object} [overrides] proprietà extra applicate alla creazione
 */
export function useMaterial(preset, hex, overrides) {
  const material = useMemo(() => {
    const m = (PRESETS[preset] || PRESETS.plain)();
    if (overrides) m.setValues(overrides);
    m.color.set(hex);
    if (m.sheen > 0) m.sheenColor.set(hex).lerp(WHITE, 0.35);
    return m;
    // il preset non cambia durante la vita del componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  const target = useMemo(() => new THREE.Color(hex), []); // eslint-disable-line react-hooks/exhaustive-deps
  const sheenTarget = useMemo(() => new THREE.Color(), []);
  useEffect(() => {
    target.set(hex);
  }, [hex, target]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 7);
    material.color.lerp(target, k);
    if (material.sheen > 0) {
      sheenTarget.copy(target).lerp(WHITE, 0.35);
      material.sheenColor.lerp(sheenTarget, k);
    }
  });

  return material;
}
