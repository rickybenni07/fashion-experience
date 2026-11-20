import { Suspense } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary.jsx';
import GLBModel from './GLBModel.jsx';
import { getGarment } from './garments/index.js';

/**
 * Sceglie cosa mostrare per un prodotto:
 *  1. il file GLB della variante (colors[].modelUrl) o del prodotto (model.url), se configurato;
 *  2. altrimenti — o se il file non si carica — il modello procedurale del suo `kind`.
 */
export default function ProductModel({ product, colors }) {
  const garment = getGarment(product.kind);
  const procedural = (
    <group scale={garment.fit}>
      <garment.Component colors={colors} options={product.options || {}} />
    </group>
  );
  const url = colors.modelUrl || product.model?.url;
  if (!url) return procedural;
  return (
    <ErrorBoundary fallback={procedural} resetKey={url}>
      <Suspense fallback={procedural}>
        <GLBModel url={url} colors={colors} tintMeshes={product.model?.tintMeshes} rotation={product.model?.rotation} />
      </Suspense>
    </ErrorBoundary>
  );
}
