import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { cached, extrude } from '../geometry.js';
import { polygonShape } from '../shapes.js';
import { useMaterial } from '../materials.js';

/** Matrici delle maglie disposte lungo un'ellisse chiusa (maglia cubana: anelli alternati e inclinati). */
function chainMatrices() {
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.sin(t) * 0.24, Math.cos(t) * 0.32, 0.03 * (1 - Math.cos(t)) * 0.5));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true);
  const length = curve.getLength();
  const count = Math.floor(length / 0.026);
  const out = [];
  const X = new THREE.Vector3(1, 0, 0);
  const q = new THREE.Quaternion();
  const twist = new THREE.Quaternion();
  const s = new THREE.Vector3(1.3, 1, 1.15);
  for (let i = 0; i < count; i++) {
    const u = i / count;
    const p = curve.getPointAt(u);
    const tan = curve.getTangentAt(u);
    q.setFromUnitVectors(X, tan);
    twist.setFromAxisAngle(X, (i % 2 ? Math.PI / 2 : 0) + 0.35);
    q.multiply(twist);
    out.push(new THREE.Matrix4().compose(p, q.clone(), s));
  }
  return out;
}

export default function Chain({ colors, pendant = true }) {
  const geo = useMemo(
    () =>
      cached('chain', () => ({
        link: new THREE.TorusGeometry(0.0155, 0.0058, 10, 24),
        matrices: chainMatrices(),
        plate: extrude(polygonShape(8, 0.075), 0.012, 0.006, 8),
        inlay: new THREE.CylinderGeometry(0.056, 0.056, 0.006, 8, 1),
        gem: new THREE.OctahedronGeometry(0.026, 0),
        bail: new THREE.TorusGeometry(0.017, 0.006, 10, 24),
      })),
    [],
  );
  const gold = useMaterial('gold', colors.primary);
  const onyx = useMaterial('onyx', colors.secondary || '#0c0c0c');
  const gem = useMaterial('gem', colors.accent || '#ffffff');
  const ref = useRef();

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    geo.matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [geo]);

  return (
    <group position={[0, 0.08, 0]}>
      <instancedMesh ref={ref} args={[geo.link, gold, geo.matrices.length]} castShadow receiveShadow />
      {pendant && (
        <group position={[0, -0.43, 0.012]}>
          <mesh geometry={geo.bail} material={gold} position={[0, 0.088, 0]} rotation={[0, Math.PI / 2, 0]} castShadow />
          <mesh geometry={geo.plate} material={gold} castShadow />
          <mesh geometry={geo.inlay} material={onyx} position={[0, 0, 0.013]} rotation={[Math.PI / 2, 0, Math.PI / 8]} />
          <mesh geometry={geo.gem} material={gem} position={[0, 0, 0.024]} scale={[1, 1, 0.55]} />
        </group>
      )}
    </group>
  );
}
