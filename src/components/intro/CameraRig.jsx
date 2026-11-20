import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const look = new THREE.Vector3();

/** Camera "a mano": percorso guidato dal rig + micro-movimento naturale + scossa all'impatto. */
export default function CameraRig({ rig }) {
  useFrame(({ camera, size, clock }) => {
    const portrait = size.height > size.width;
    const k = portrait ? 1.55 : 1;
    const t = clock.elapsedTime;
    const s = rig.shake;
    const hand = 0.012;
    const nx = Math.sin(t * 1.3) * hand + (Math.sin(t * 41) + Math.sin(t * 29.3)) * s * 0.5;
    const ny = Math.cos(t * 1.7) * hand * 0.7 + (Math.sin(t * 37) + Math.cos(t * 23)) * s * 0.5;

    camera.position.set(
      rig.tgtX + (rig.camX - rig.tgtX) * k + nx,
      rig.tgtY + (rig.camY - rig.tgtY) * k + ny,
      rig.tgtZ + (rig.camZ - rig.tgtZ) * k,
    );
    look.set(rig.tgtX + nx * 0.4, rig.tgtY + ny * 0.4, rig.tgtZ);
    camera.lookAt(look);
    camera.rotateZ(rig.roll + Math.sin(t * 0.9) * 0.004);

    const fov = rig.fov * (portrait ? 1.2 : 1);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}
