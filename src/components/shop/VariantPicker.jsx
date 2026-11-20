export function ColorSwatches({ colors, value, onChange, size = 'md', label = true }) {
  const current = colors.find((c) => c.id === value) || colors[0];
  return (
    <div className={`swatches swatches--${size}`}>
      {label && (
        <p className="field-label">
          Colore <span>{current.name}</span>
        </p>
      )}
      <div className="swatches__row" role="radiogroup" aria-label="Colore">
        {colors.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={c.id === current.id}
            aria-label={c.name}
            title={c.name}
            className={`swatch${c.id === current.id ? ' is-on' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(c.id);
            }}
            style={{ '--c1': c.primary, '--c2': c.secondary || c.primary }}
          />
        ))}
      </div>
    </div>
  );
}

export function SizePicker({ sizes, value, onChange, error }) {
  return (
    <div className="sizes">
      <p className="field-label">
        Taglia {error && <span className="field-error">{error}</span>}
      </p>
      <div className="sizes__row" role="radiogroup" aria-label="Taglia">
        {sizes.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={value === s} className={`size${value === s ? ' is-on' : ''}`} onClick={() => onChange(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QtyStepper({ value, onChange, min = 1, max = 10, small = false }) {
  return (
    <div className={`qty${small ? ' qty--sm' : ''}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min && min > 0} aria-label="Diminuisci quantità">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Aumenta quantità">
        +
      </button>
    </div>
  );
}
