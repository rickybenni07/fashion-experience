/**
 * Punto unico per collegare i modelli 3D reali.
 *
 * Finché un `url` è null il sito usa i modelli procedurali (generati in codice).
 * Quando avrai i file .glb/.gltf mettili in /public/models/... e imposta qui il percorso:
 * il caricamento è protetto da ErrorBoundary, quindi un file mancante o corrotto
 * fa tornare automaticamente al modello procedurale senza rompere la pagina.
 */

export const INTRO_CHARACTER = {
  // es. '/models/intro/character.glb' (personaggio riggato con tatuaggi, gioielli, streetwear)
  url: null,
  scale: 1,
  position: [0, 0, 0],
  // Nomi delle animazioni dentro il file GLB (es. esportate da Mixamo / Blender)
  clips: {
    adjust: 'AdjustJewelry', // 0–2 s: si guarda allo specchio e sistema i gioielli
    fall: 'Fall', // 2–3 s: perde l'equilibrio e cade
  },
};

/**
 * Per un prodotto, aggiungi in src/data/catalog.js:
 *   model: {
 *     url: '/models/products/hoodie.glb',
 *     tintMeshes: ['Body', 'Sleeve'],   // mesh/materiali da ricolorare con la variante scelta
 *     rotation: [0, 0, 0],
 *   }
 * oppure, per varianti con texture diverse, un file per colore:
 *   colors: [{ id: 'onyx', ..., modelUrl: '/models/products/hoodie-onyx.glb' }]
 */
export const MODEL_FIT_SIZE = 1.25; // dimensione massima (unità three) a cui vengono normalizzati i GLB
