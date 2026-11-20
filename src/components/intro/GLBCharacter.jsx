import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { INTRO_TIMES } from './timeline.js';

/**
 * Personaggio reale da file GLB riggato.
 * Riproduce la clip "adjust" e alle 2 s passa con crossfade alla clip "fall".
 * Se il file non contiene la clip di caduta, la caduta viene simulata ruotando il modello.
 */
export default function GLBCharacter({ rig, config }) {
  const group = useRef();
  const fallback = useRef();
  const fell = useRef(false);
  const { scene, animations } = useGLTF(config.url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const adjust = actions[config.clips.adjust];
    adjust?.reset().fadeIn(0.2).play();
    return () => Object.values(actions).forEach((a) => a?.stop());
  }, [actions, scene, config.clips.adjust]);

  useFrame(() => {
    const fall = actions[config.clips.fall];
    if (!fell.current && rig.time >= INTRO_TIMES.slip && fall) {
      fell.current = true;
      fall.reset();
      fall.setLoop(THREE.LoopOnce, 1);
      fall.clampWhenFinished = true;
      fall.play();
      const adjust = actions[config.clips.adjust];
      if (adjust) fall.crossFadeFrom(adjust, 0.2, false);
    }
    if (!fall && fallback.current) fallback.current.rotation.x = rig.fall;
  });

  return (
    <group ref={fallback}>
      <group ref={group} scale={config.scale} position={config.position}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
