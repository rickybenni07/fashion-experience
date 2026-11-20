import Tee from './Tee.jsx';
import Hoodie from './Hoodie.jsx';
import Pants from './Pants.jsx';
import Jacket from './Jacket.jsx';
import Sneakers from './Sneakers.jsx';
import Cap from './Cap.jsx';
import Bag from './Bag.jsx';
import Chain from './Chain.jsx';
import Ring from './Ring.jsx';

/**
 * Registro dei modelli procedurali.
 *  - fit: scala per portare il capo a ~1.2 unità
 *  - hotspots: punti di dettaglio cliccabili (coordinate prima della scala `fit`)
 *    `normal` indica la direzione da cui il punto è visibile.
 */
export const GARMENTS = {
  tee: {
    Component: Tee,
    fit: 1.25,
    hotspots: [
      { id: 'collo', label: 'Collo a coste', text: 'Costa 1x1 cucita a doppio ago: mantiene la forma lavaggio dopo lavaggio.', position: [0, 0.36, 0.03], normal: [0, 0.3, 1] },
      { id: 'ricamo', label: 'Ricamo', text: 'Ricamo tono su tono ad alta densità, 9.000 punti.', position: [0.15, 0.22, 0.11], normal: [0, 0, 1] },
      { id: 'manica', label: 'Spalla scesa', text: 'Giromanica abbassato per una caduta morbida e rilassata.', position: [0.4, 0.2, 0.05], normal: [0.4, 0, 1] },
    ],
  },
  hoodie: {
    Component: Hoodie,
    fit: 1.15,
    hotspots: [
      { id: 'cappuccio', label: 'Cappuccio', text: 'Doppio strato con fodera a contrasto, struttura che non si affloscia.', position: [0, 0.5, 0.0], normal: [0, 0.5, 1] },
      { id: 'coulisse', label: 'Coulisse', text: 'Cordino piatto con puntali in metallo satinato.', position: [0.058, 0.19, 0.14], normal: [0, 0, 1] },
      { id: 'tasca', label: 'Tasca a marsupio', text: 'Tasca frontale con aperture rinforzate.', position: [0, -0.2, 0.13], normal: [0, 0, 1] },
      { id: 'polsino', label: 'Polsini a coste', text: 'Coste elasticizzate per una vestibilità precisa al polso.', position: [0.54, -0.3, 0.05], normal: [0.3, 0, 1] },
    ],
  },
  pants: {
    Component: Pants,
    fit: 1.1,
    hotspots: [
      { id: 'vita', label: 'Cintura', text: 'Passanti rinforzati e bottone in metallo brunito.', position: [0, 0.43, 0.105], normal: [0, 0, 1] },
      { id: 'tasca', label: 'Tasca cargo', text: 'Tasca a soffietto con pattina e chiusura a bottone.', position: [0.185, -0.06, 0.11], normal: [0, 0, 1] },
      { id: 'fondo', label: 'Fondo gamba', text: 'Orlo pulito, si regola con coulisse interna.', position: [-0.157, -0.5, 0.06], normal: [0, 0, 1] },
    ],
  },
  jacket: {
    Component: Jacket,
    fit: 1.1,
    hotspots: [
      { id: 'zip', label: 'Zip', text: 'Zip a doppio cursore in metallo cromato.', position: [0, 0.1, 0.13], normal: [0, 0, 1] },
      { id: 'collo', label: 'Collo', text: 'Collo a coste con profilo a contrasto.', position: [0, 0.38, 0.04], normal: [0, 0.3, 1] },
      { id: 'polsino', label: 'Polsino', text: 'Polsini e fondo a coste con filo tecnico.', position: [-0.56, -0.3, 0.05], normal: [-0.3, 0, 1] },
    ],
  },
  sneaker: {
    Component: Sneakers,
    fit: 1,
    hotspots: [
      { id: 'tomaia', label: 'Tomaia', text: 'Pelle pieno fiore conciata al vegetale.', position: [0.05, 0.12, 0.35], normal: [0.2, 0.3, 1] },
      { id: 'suola', label: 'Intersuola', text: 'EVA scolpita a mano, ammortizzazione progressiva.', position: [0.3, -0.12, 0.3], normal: [0.3, 0, 1] },
      { id: 'tallone', label: 'Tallone', text: 'Linguetta in pelle a contrasto, contrafforte rinforzato.', position: [-0.42, 0.06, 0.02], normal: [-1, 0, 0.2] },
    ],
  },
  cap: {
    Component: Cap,
    fit: 1.15,
    hotspots: [
      { id: 'patch', label: 'Patch', text: 'Patch ricamata a contrasto.', position: [0.06, 0.13, 0.36], normal: [0.2, 0.2, 1] },
      { id: 'visiera', label: 'Visiera', text: 'Visiera precurvata con anima rigida.', position: [0.25, -0.12, 0.45], normal: [0.3, 0.5, 1] },
    ],
  },
  bag: {
    Component: Bag,
    fit: 1.2,
    hotspots: [
      { id: 'fibbia', label: 'Fibbia', text: 'Ottone scolpito e lucidato a mano.', position: [0.0, -0.15, 0.1], normal: [0, 0, 1] },
      { id: 'tracolla', label: 'Tracolla', text: 'Regolabile, con attacchi in ottone.', position: [0.03, 0.66, 0.0], normal: [0, 1, 0.6] },
    ],
  },
  chain: {
    Component: Chain,
    fit: 1.25,
    hotspots: [
      { id: 'maglia', label: 'Maglia cubana', text: 'Maglie lucidate a mano una per una.', position: [0.2, 0.25, 0.02], normal: [0.3, 0, 1] },
      { id: 'pendente', label: 'Pendente', text: 'Ottagono in oro 18k con intarsio in onice e pietra centrale.', position: [0, -0.35, 0.05], normal: [0, 0, 1] },
    ],
  },
  ring: {
    Component: Ring,
    fit: 1.2,
    hotspots: [
      { id: 'sigillo', label: 'Sigillo', text: 'Intarsio in onice nera lucidata a specchio.', position: [0.1, 0.27, 0.1], normal: [0, 1, 0.6] },
      { id: 'fascia', label: 'Fascia', text: 'Fascia piena in oro 18k, interno comfort.', position: [-0.28, -0.12, 0.1], normal: [-0.6, 0, 1] },
    ],
  },
};

export const getGarment = (kind) => GARMENTS[kind] || GARMENTS.tee;
