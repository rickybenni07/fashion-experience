/**
 * Catalogo di default. È completamente modificabile:
 *  - qui nel codice (cambia CATALOG_VERSION per forzare il reset dei dati salvati nei browser)
 *  - dal sito, con l'editor "Gestisci catalogo" (salvato in localStorage)
 *
 * `kind` sceglie il modello 3D procedurale: tee | hoodie | pants | jacket | sneaker | cap | bag | chain | ring
 * `colors[].primary/secondary/accent` pilotano i materiali 3D in tempo reale.
 */

export const CATALOG_VERSION = 3;

const APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOES = ['39', '40', '41', '42', '43', '44', '45', '46'];
const ONE = ['Taglia unica'];
const RING = ['16', '18', '20', '22', '24'];

export const DEFAULT_CATEGORIES = [
  { id: 't-shirt', name: 'T-shirt', tagline: 'Jersey pesante, tagli puliti', visible: true },
  { id: 'felpe', name: 'Felpe', tagline: 'Fleece spazzolato 480 g/m²', visible: true },
  { id: 'pantaloni', name: 'Pantaloni', tagline: 'Volumi rilassati, dettagli tecnici', visible: true },
  { id: 'giacche', name: 'Giacche', tagline: 'Strati per la notte in città', visible: true },
  { id: 'sneakers', name: 'Sneakers', tagline: 'Suole scolpite, pelle pieno fiore', visible: true },
  { id: 'accessori', name: 'Accessori', tagline: 'Il dettaglio che resta', visible: true },
  { id: 'gioielli', name: 'Gioielli', tagline: 'Oro 18k lavorato a mano', visible: true },
];

export const DEFAULT_PRODUCTS = [
  {
    id: 'tee-ossidiana',
    name: 'Tee Ossidiana Heavyweight',
    category: 't-shirt',
    kind: 'tee',
    price: 120,
    featured: true,
    tagline: 'Jersey 300 g, collo a coste 1x1',
    description:
      'La t-shirt fondamentale, rifatta come un capo da sartoria: cotone pettinato compatto, spalla scesa e un ricamo tono su tono sul petto.',
    details: ['100% cotone pettinato, 300 g/m²', 'Collo a coste 1x1', 'Ricamo tono su tono', 'Prodotta in Italia'],
    colors: [
      { id: 'onyx', name: 'Onyx', primary: '#161616', secondary: '#262626', accent: '#3a3a3a' },
      { id: 'avorio', name: 'Avorio', primary: '#ece6da', secondary: '#ddd3c2', accent: '#b9ab94' },
      { id: 'terracotta', name: 'Terracotta', primary: '#a4553a', secondary: '#8a432c', accent: '#f0c9a8' },
    ],
    sizes: APPAREL,
    options: {},
  },
  {
    id: 'tee-tramonto',
    name: 'Tee Tramonto Oversize',
    category: 't-shirt',
    kind: 'tee',
    price: 140,
    featured: false,
    tagline: 'Oversize con stampa sole al tramonto',
    description: 'Vestibilità ampia e stampa serigrafica a sei passaggi ispirata alle sere sul lungomare.',
    details: ['Vestibilità oversize', 'Stampa serigrafica', 'Cuciture rinforzate', 'Lavaggio enzimatico'],
    colors: [
      { id: 'crema', name: 'Crema', primary: '#efe8db', secondary: '#ff6a3d', accent: '#ff2d75' },
      { id: 'notte', name: 'Notte', primary: '#1d2340', secondary: '#ffb347', accent: '#ff4d8d' },
      { id: 'lavanda', name: 'Lavanda', primary: '#b8addf', secondary: '#ff7a59', accent: '#3b2a7a' },
    ],
    sizes: APPAREL,
    options: { oversize: true, print: true },
  },
  {
    id: 'hoodie-notturno',
    name: 'Hoodie Notturno',
    category: 'felpe',
    kind: 'hoodie',
    price: 290,
    featured: true,
    tagline: 'Fleece spazzolato, cappuccio doppio strato',
    description:
      'Una felpa costruita per durare: fleece da 480 g, cappuccio foderato, tasca a marsupio e coulisse con puntali in metallo.',
    details: ['Fleece 480 g/m²', 'Cappuccio doppio strato', 'Puntali in metallo', 'Polsini e fondo a coste'],
    colors: [
      { id: 'onyx', name: 'Onyx', primary: '#151515', secondary: '#202020', accent: '#c9a45c' },
      { id: 'grafite', name: 'Grafite', primary: '#3b3d42', secondary: '#2e3034', accent: '#d9dde2' },
      { id: 'salvia', name: 'Salvia', primary: '#8c9a84', secondary: '#7a8872', accent: '#e8e2d2' },
    ],
    sizes: APPAREL,
    options: {},
  },
  {
    id: 'hoodie-cemento',
    name: 'Hoodie Cemento',
    category: 'felpe',
    kind: 'hoodie',
    price: 260,
    featured: false,
    tagline: 'Tinto in capo, effetto vissuto',
    description: 'Tintura in capo dopo la confezione per una superficie viva, diversa per ogni pezzo.',
    details: ['Tinto in capo', 'Fleece 420 g/m²', 'Tasca a marsupio', 'Coulisse piatta'],
    colors: [
      { id: 'cemento', name: 'Cemento', primary: '#9a9893', secondary: '#8a8883', accent: '#e9e6df' },
      { id: 'sabbia', name: 'Sabbia', primary: '#c9b79c', secondary: '#b8a588', accent: '#6b5a44' },
      { id: 'cobalto', name: 'Cobalto', primary: '#2340a8', secondary: '#1c338a', accent: '#f2f2f2' },
    ],
    sizes: APPAREL,
    options: {},
  },
  {
    id: 'cargo-asfalto',
    name: 'Cargo Asfalto',
    category: 'pantaloni',
    kind: 'pants',
    price: 340,
    featured: true,
    tagline: 'Ripstop pesante, tasche a soffietto',
    description: 'Cargo dalla gamba ampia in ripstop di cotone, con tasche a soffietto e bottoni in metallo brunito.',
    details: ['Ripstop di cotone 280 g/m²', 'Tasche a soffietto', 'Bottoni in metallo brunito', 'Fondo regolabile'],
    colors: [
      { id: 'asfalto', name: 'Asfalto', primary: '#2a2c2e', secondary: '#1f2123', accent: '#8b8b8b' },
      { id: 'oliva', name: 'Oliva', primary: '#55593f', secondary: '#474a34', accent: '#c7b98f' },
      { id: 'khaki', name: 'Khaki', primary: '#b5a27e', secondary: '#a28f6b', accent: '#3d342a' },
    ],
    sizes: APPAREL,
    options: { cargo: true },
  },
  {
    id: 'pantalone-tecnico',
    name: 'Pantalone Tecnico',
    category: 'pantaloni',
    kind: 'pants',
    price: 280,
    featured: false,
    tagline: 'Tela tecnica idrorepellente',
    description: 'Linea pulita, vita elastica nascosta e tela idrorepellente: dal giorno alla notte senza cambiarsi.',
    details: ['Tela tecnica idrorepellente', 'Vita elastica interna', 'Fondo a coste', 'Tasche nascoste'],
    colors: [
      { id: 'nero', name: 'Nero', primary: '#121212', secondary: '#1c1c1c', accent: '#777777' },
      { id: 'pietra', name: 'Pietra', primary: '#7c7a74', secondary: '#6c6a64', accent: '#e3e0d8' },
      { id: 'panna', name: 'Panna', primary: '#e6dfcf', secondary: '#d6cfbf', accent: '#5a5246' },
    ],
    sizes: APPAREL,
    options: { cargo: false },
  },
  {
    id: 'bomber-neon',
    name: 'Bomber Neon',
    category: 'giacche',
    kind: 'jacket',
    price: 690,
    featured: true,
    tagline: 'Raso tecnico, profili a coste fluo',
    description:
      'Il bomber notturno: raso tecnico imbottito, coste con profilo fluo e zip a doppio cursore in metallo cromato.',
    details: ['Raso tecnico imbottito', 'Zip a doppio cursore', 'Tasca utility sulla manica', 'Fodera arancio segnale'],
    colors: [
      { id: 'nero-rosa', name: 'Nero / Rosa', primary: '#111114', secondary: '#ff2d75', accent: '#d9dde2' },
      { id: 'militare', name: 'Militare / Arancio', primary: '#4a5137', secondary: '#ff8a00', accent: '#c9a45c' },
      { id: 'notte-ciano', name: 'Notte / Ciano', primary: '#1b2140', secondary: '#38e1ff', accent: '#d9dde2' },
    ],
    sizes: APPAREL,
    options: { style: 'bomber' },
  },
  {
    id: 'giacca-cromo',
    name: 'Giacca Cromo',
    category: 'giacche',
    kind: 'jacket',
    price: 980,
    featured: false,
    tagline: 'Shell laccato a specchio',
    description: 'Una giacca shell con finitura laccata che cattura ogni luce della città. Collo alto e zip sigillata.',
    details: ['Nylon laccato', 'Collo alto con mentoniera', 'Zip sigillata', 'Cuciture nastrate'],
    colors: [
      { id: 'cromo', name: 'Cromo', primary: '#b9bec5', secondary: '#9aa0a8', accent: '#1a1a1a' },
      { id: 'nero-lucido', name: 'Nero lucido', primary: '#0f0f10', secondary: '#1b1b1d', accent: '#d9dde2' },
      { id: 'rosso', name: 'Rosso', primary: '#8e1c22', secondary: '#74161b', accent: '#f2f2f2' },
    ],
    sizes: APPAREL,
    options: { style: 'shell' },
  },
  {
    id: 'runner-ossidiana',
    name: 'Runner Ossidiana',
    category: 'sneakers',
    kind: 'sneaker',
    price: 420,
    featured: true,
    tagline: 'Intersuola scolpita, pelle pieno fiore',
    description: 'Una runner dal profilo basso, intersuola scolpita a mano e tomaia in pelle pieno fiore.',
    details: ['Tomaia in pelle pieno fiore', 'Intersuola in EVA scolpita', 'Suola in gomma naturale', 'Fatta a mano in Italia'],
    colors: [
      { id: 'notte', name: 'Notte', primary: '#151515', secondary: '#f2f0ea', accent: '#ff4d2e' },
      { id: 'bianco', name: 'Bianco', primary: '#f3f1ec', secondary: '#e6e0d4', accent: '#111111' },
      { id: 'tramonto', name: 'Tramonto', primary: '#ff7a45', secondary: '#fff7ee', accent: '#2a1a5e' },
    ],
    sizes: SHOES,
    options: { style: 'runner' },
  },
  {
    id: 'court-low',
    name: 'Court Low',
    category: 'sneakers',
    kind: 'sneaker',
    price: 380,
    featured: false,
    tagline: 'Silhouette da campo, linea essenziale',
    description: 'La sneaker bassa da ogni giorno, con suola cupsole cucita e tallone in pelle scamosciata.',
    details: ['Suola cupsole cucita', 'Tallone in suede', 'Fodera in pelle', 'Lacci cerati'],
    colors: [
      { id: 'gesso', name: 'Gesso', primary: '#f1eee7', secondary: '#f7f5f0', accent: '#1d4d3a' },
      { id: 'nero', name: 'Nero', primary: '#1a1a1a', secondary: '#efece5', accent: '#c9a45c' },
      { id: 'cielo', name: 'Cielo', primary: '#b9d2ea', secondary: '#f7f5f0', accent: '#16223f' },
    ],
    sizes: SHOES,
    options: { style: 'court' },
  },
  {
    id: 'cappello-strada',
    name: 'Cappello Strada',
    category: 'accessori',
    kind: 'cap',
    price: 95,
    featured: false,
    tagline: 'Sei pannelli in twill lavato',
    description: 'Cappello a sei pannelli in twill di cotone lavato, visiera curva e patch ricamata.',
    details: ['Twill di cotone lavato', 'Visiera precurvata', 'Patch ricamata', 'Chiusura regolabile in metallo'],
    colors: [
      { id: 'nero', name: 'Nero', primary: '#161616', secondary: '#ff4d2e', accent: '#c9a45c' },
      { id: 'sabbia', name: 'Sabbia', primary: '#cbb894', secondary: '#3b2f22', accent: '#3b2f22' },
      { id: 'bosco', name: 'Bosco', primary: '#2f4033', secondary: '#efe8db', accent: '#efe8db' },
    ],
    sizes: ONE,
    options: {},
  },
  {
    id: 'borsa-crossbody',
    name: 'Borsa Crossbody',
    category: 'accessori',
    kind: 'bag',
    price: 640,
    featured: false,
    tagline: 'Pelle martellata, fibbia scolpita',
    description: 'Borsa a tracolla in pelle martellata con fibbia in ottone scolpito e tracolla regolabile.',
    details: ['Pelle di vitello martellata', 'Fibbia in ottone', 'Tracolla regolabile', 'Fodera in camoscio'],
    colors: [
      { id: 'nero', name: 'Nero', primary: '#141414', secondary: '#1e1e1e', accent: '#c9a45c' },
      { id: 'cognac', name: 'Cognac', primary: '#8a4a24', secondary: '#6f3a1c', accent: '#d9dde2' },
      { id: 'bianco', name: 'Bianco ottico', primary: '#efede8', secondary: '#dcd8cf', accent: '#c9a45c' },
    ],
    sizes: ONE,
    options: {},
  },
  {
    id: 'catena-cubana',
    name: 'Catena Cubana 18k',
    category: 'gioielli',
    kind: 'chain',
    price: 2400,
    featured: true,
    tagline: 'Maglia cubana, pendente ottagonale',
    description:
      'Catena a maglia cubana in oro 18k con pendente ottagonale e pietra centrale. Ogni maglia è lucidata a mano.',
    details: ['Oro 18k, 62 g', 'Lunghezza 55 cm', 'Pendente ottagonale con pietra', 'Chiusura a scatto con sicura'],
    colors: [
      { id: 'oro', name: 'Oro giallo', primary: '#e7b75a', secondary: '#0c0c0c', accent: '#ffffff' },
      { id: 'oro-bianco', name: 'Oro bianco', primary: '#dfe3e8', secondary: '#0c0c0c', accent: '#bfe7ff' },
      { id: 'oro-rosa', name: 'Oro rosa', primary: '#e3a487', secondary: '#0c0c0c', accent: '#ffd6e7' },
    ],
    sizes: ONE,
    options: {},
  },
  {
    id: 'anello-ossidiana',
    name: 'Anello Ossidiana',
    category: 'gioielli',
    kind: 'ring',
    price: 860,
    featured: false,
    tagline: 'Sigillo con intarsio in onice',
    description: 'Anello a sigillo con intarsio in onice nera e pietra centrale incastonata a mano.',
    details: ['Oro 18k', 'Intarsio in onice', 'Pietra centrale', 'Incisione interna su richiesta'],
    colors: [
      { id: 'oro', name: 'Oro giallo', primary: '#e7b75a', secondary: '#0a0a0a', accent: '#ffffff' },
      { id: 'argento', name: 'Argento', primary: '#d6dadf', secondary: '#0a0a0a', accent: '#bfe7ff' },
    ],
    sizes: RING,
    options: {},
  },
];

export const DEFAULT_CATALOG = {
  version: CATALOG_VERSION,
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS,
};

export const GARMENT_KINDS = ['tee', 'hoodie', 'pants', 'jacket', 'sneaker', 'cap', 'bag', 'chain', 'ring'];
