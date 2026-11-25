export default function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  id = 'quantite',
  disabled = false,
}) {
  const clamp = (n) => Math.min(Math.max(n, min), max);

  return (
    <div className="qty-selector">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        aria-label="Diminuer la quantité"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        −
      </button>
      <label htmlFor={id} className="visually-hidden">Quantité</label>
      <input
        id={id}
        type="number"
        className="form-control form-control-sm"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isSafeInteger(n) || n < min || n > max) return;
          onChange(n);
        }}
      />
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        aria-label="Augmenter la quantité"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        +
      </button>
    </div>
  );
}
