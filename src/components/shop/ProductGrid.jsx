import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, empty = 'Nessun prodotto in questa sezione.' }) {
  if (!products.length) return <p className="empty">{empty}</p>;
  return (
    <div className="pgrid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
