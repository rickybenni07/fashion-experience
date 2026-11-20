/**
 * Punto d'integrazione per il pagamento.
 *
 * Oggi l'ordine viene validato e registrato localmente (localStorage) così il flusso
 * carrello → checkout → conferma è completo e testabile.
 * Per andare in produzione sostituisci il corpo di `submitOrder` con la chiamata al tuo backend,
 * ad esempio creando una Stripe Checkout Session o un checkout Shopify Storefront, e
 * reindirizza l'utente all'URL di pagamento restituito.
 */
export async function submitOrder(order) {
  // Esempio produzione:
  // const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
  // if (!res.ok) throw new Error('Pagamento non riuscito');
  // const { url } = await res.json(); window.location.href = url;
  await new Promise((r) => setTimeout(r, 650));
  return { ...order, status: 'registrato', paymentConnected: false };
}

export function makeOrderId() {
  const d = new Date();
  const stamp = `${d.getFullYear().toString().slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `OSS-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
