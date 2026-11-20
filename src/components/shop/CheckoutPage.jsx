import { useState } from 'react';
import { useShop } from '../../store/ShopContext.jsx';
import { makeOrderId, submitOrder } from '../../services/checkout.js';
import { formatPrice } from '../../utils/format.js';

const FIELDS = [
  { name: 'nome', label: 'Nome e cognome', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'indirizzo', label: 'Indirizzo', autoComplete: 'street-address', wide: true },
  { name: 'citta', label: 'Città', autoComplete: 'address-level2' },
  { name: 'cap', label: 'CAP', autoComplete: 'postal-code', inputMode: 'numeric' },
  { name: 'paese', label: 'Paese', autoComplete: 'country-name' },
];

function validate(v) {
  const e = {};
  if (!v.nome?.trim() || v.nome.trim().length < 3) e.nome = 'Inserisci nome e cognome';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email || '')) e.email = 'Email non valida';
  if (!v.indirizzo?.trim()) e.indirizzo = 'Inserisci l’indirizzo';
  if (!v.citta?.trim()) e.citta = 'Inserisci la città';
  if (!/^[0-9A-Za-z -]{3,10}$/.test(v.cap || '')) e.cap = 'CAP non valido';
  if (!v.paese?.trim()) e.paese = 'Inserisci il paese';
  return e;
}

export default function CheckoutPage() {
  const { lines, subtotal, shipping, total, placeOrder } = useShop();
  const [values, setValues] = useState({ paese: 'Italia' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null);
  const [failure, setFailure] = useState('');

  if (done) {
    return (
      <div className="page page--checkout checkout-done">
        <p className="eyebrow">Ordine {done.id}</p>
        <h1 className="display display--xl">
          Grazie, <em>{done.customer.nome.split(' ')[0]}</em>.
        </h1>
        <p>
          Abbiamo registrato il tuo ordine da {formatPrice(done.total)}. Riceverai la conferma a {done.customer.email}.
        </p>
        <p className="note">Il pagamento online non è ancora collegato: l’ordine è salvato in questo browser (vedi src/services/checkout.js).</p>
        <a className="btn btn--solid" href="#/">
          Torna al negozio
        </a>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="page page--checkout checkout-done">
        <h1 className="display">Il carrello è vuoto</h1>
        <a className="btn btn--solid" href="#/">
          Scopri la collezione
        </a>
      </div>
    );
  }

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate(values);
    setErrors(er);
    if (Object.keys(er).length) return;
    setSending(true);
    setFailure('');
    try {
      const order = await submitOrder({
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        customer: values,
        items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, color: l.color.name, size: l.size, qty: l.qty, price: l.product.price })),
        subtotal,
        shipping,
        total,
      });
      placeOrder(order);
      setDone(order);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setFailure(err?.message || 'Si è verificato un errore, riprova.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page page--checkout">
      <h1 className="display">Checkout</h1>
      <div className="checkout">
        <form className="checkout__form" onSubmit={submit} noValidate>
          <fieldset disabled={sending}>
            <legend>Spedizione</legend>
            <div className="form-grid">
              {FIELDS.map((f) => (
                <label key={f.name} className={`field${f.wide ? ' field--wide' : ''}${errors[f.name] ? ' has-error' : ''}`}>
                  <span>{f.label}</span>
                  <input
                    name={f.name}
                    type={f.type || 'text'}
                    autoComplete={f.autoComplete}
                    inputMode={f.inputMode}
                    value={values[f.name] || ''}
                    onChange={set(f.name)}
                    aria-invalid={!!errors[f.name]}
                  />
                  {errors[f.name] && <em>{errors[f.name]}</em>}
                </label>
              ))}
            </div>
          </fieldset>
          {failure && <p className="field-error">{failure}</p>}
          <button type="submit" className="btn btn--solid btn--wide" disabled={sending}>
            {sending ? 'Invio in corso…' : `Conferma ordine · ${formatPrice(total)}`}
          </button>
          <p className="note">Pagamento da collegare (Stripe o Shopify): il punto d’integrazione è in src/services/checkout.js.</p>
        </form>

        <aside className="checkout__summary">
          <h2>Riepilogo</h2>
          <ul>
            {lines.map((l) => (
              <li key={l.key}>
                <span className="line__thumb line__thumb--sm" style={{ '--c1': l.color.primary, '--c2': l.color.secondary || l.color.primary }} aria-hidden />
                <span>
                  {l.product.name}
                  <small>
                    {l.color.name} · {l.size} · ×{l.qty}
                  </small>
                </span>
                <strong>{formatPrice(l.total)}</strong>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Subtotale</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Spedizione</dt>
              <dd>{shipping ? formatPrice(shipping) : 'Gratuita'}</dd>
            </div>
            <div className="total">
              <dt>Totale</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
