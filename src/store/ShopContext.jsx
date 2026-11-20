import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { DEFAULT_CATALOG } from '../data/catalog.js';
import { slugify } from '../utils/format.js';

const KEYS = { catalog: 'ossidiana.catalog', cart: 'ossidiana.cart', orders: 'ossidiana.orders' };
export const FREE_SHIPPING_FROM = 300;
export const SHIPPING_COST = 15;
const MAX_QTY = 10;

const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage pieno o disabilitato: il sito continua a funzionare in memoria */
  }
};
const clone = (o) => JSON.parse(JSON.stringify(o));

function init() {
  let catalog = read(KEYS.catalog, null);
  if (!catalog || catalog.version !== DEFAULT_CATALOG.version) catalog = clone(DEFAULT_CATALOG);
  return { catalog, cart: read(KEYS.cart, []), orders: read(KEYS.orders, []), cartOpen: false };
}

const setCatalog = (state, patch) => ({ ...state, catalog: { ...state.catalog, ...patch } });

function reducer(state, a) {
  const { categories, products } = state.catalog;
  switch (a.type) {
    case 'cart/add': {
      const key = `${a.productId}|${a.colorId}|${a.size}`;
      const exists = state.cart.some((l) => l.key === key);
      const cart = exists
        ? state.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + a.qty) } : l))
        : [...state.cart, { key, productId: a.productId, colorId: a.colorId, size: a.size, qty: Math.min(MAX_QTY, a.qty) }];
      return { ...state, cart };
    }
    case 'cart/qty':
      return {
        ...state,
        cart: state.cart.flatMap((l) => (l.key !== a.key ? [l] : a.qty <= 0 ? [] : [{ ...l, qty: Math.min(MAX_QTY, a.qty) }])),
      };
    case 'cart/remove':
      return { ...state, cart: state.cart.filter((l) => l.key !== a.key) };
    case 'cart/clear':
      return { ...state, cart: [] };
    case 'cart/open':
      return { ...state, cartOpen: a.open };

    case 'cat/add': {
      const name = a.name.trim();
      if (!name) return state;
      const base = slugify(name);
      let id = base;
      let i = 2;
      while (categories.some((c) => c.id === id)) id = `${base}-${i++}`;
      return setCatalog(state, { categories: [...categories, { id, name, tagline: a.tagline?.trim() || '', visible: true }] });
    }
    case 'cat/update':
      return setCatalog(state, { categories: categories.map((c) => (c.id === a.id ? { ...c, ...a.patch } : c)) });
    case 'cat/remove':
      if (products.some((p) => p.category === a.id)) return state; // prima sposta i prodotti
      return setCatalog(state, { categories: categories.filter((c) => c.id !== a.id) });
    case 'cat/move': {
      const i = categories.findIndex((c) => c.id === a.id);
      const j = i + a.dir;
      if (i < 0 || j < 0 || j >= categories.length) return state;
      const next = [...categories];
      [next[i], next[j]] = [next[j], next[i]];
      return setCatalog(state, { categories: next });
    }
    case 'product/update':
      return setCatalog(state, { products: products.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p)) });
    case 'catalog/reset':
      return { ...state, catalog: clone(DEFAULT_CATALOG) };

    case 'order/place':
      return { ...state, orders: [a.order, ...state.orders], cart: [] };
    default:
      return state;
  }
}

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => write(KEYS.catalog, state.catalog), [state.catalog]);
  useEffect(() => write(KEYS.cart, state.cart), [state.cart]);
  useEffect(() => write(KEYS.orders, state.orders), [state.orders]);

  const actions = useMemo(
    () => ({
      addToCart: (productId, colorId, size, qty = 1) => dispatch({ type: 'cart/add', productId, colorId, size, qty }),
      setQty: (key, qty) => dispatch({ type: 'cart/qty', key, qty }),
      removeLine: (key) => dispatch({ type: 'cart/remove', key }),
      clearCart: () => dispatch({ type: 'cart/clear' }),
      openCart: (open = true) => dispatch({ type: 'cart/open', open }),
      addCategory: (name, tagline) => dispatch({ type: 'cat/add', name, tagline }),
      updateCategory: (id, patch) => dispatch({ type: 'cat/update', id, patch }),
      removeCategory: (id) => dispatch({ type: 'cat/remove', id }),
      moveCategory: (id, dir) => dispatch({ type: 'cat/move', id, dir }),
      updateProduct: (id, patch) => dispatch({ type: 'product/update', id, patch }),
      resetCatalog: () => dispatch({ type: 'catalog/reset' }),
      placeOrder: (order) => dispatch({ type: 'order/place', order }),
    }),
    [],
  );

  const derived = useMemo(() => {
    const { categories, products } = state.catalog;
    const productById = Object.fromEntries(products.map((p) => [p.id, p]));
    const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
    const visibleCategories = categories.filter((c) => c.visible);
    const visibleIds = new Set(visibleCategories.map((c) => c.id));
    const visibleProducts = products.filter((p) => visibleIds.has(p.category));
    const lines = state.cart
      .map((l) => {
        const product = productById[l.productId];
        if (!product) return null;
        const color = product.colors.find((c) => c.id === l.colorId) || product.colors[0];
        return { ...l, product, color, total: product.price * l.qty };
      })
      .filter(Boolean);
    const subtotal = lines.reduce((s, l) => s + l.total, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
    return {
      categories,
      products,
      productById,
      categoryById,
      visibleCategories,
      visibleProducts,
      productsIn: (catId) => products.filter((p) => p.category === catId),
      lines,
      cartCount: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [state.catalog, state.cart]);

  const value = useMemo(
    () => ({ ...derived, ...actions, cartOpen: state.cartOpen, orders: state.orders }),
    [derived, actions, state.cartOpen, state.orders],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop deve essere usato dentro <ShopProvider>');
  return ctx;
}

/** Colori della variante scelta (o della prima disponibile). */
export function getVariant(product, colorId) {
  return product.colors.find((c) => c.id === colorId) || product.colors[0];
}
