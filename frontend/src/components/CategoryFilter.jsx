export default function CategoryFilter({ categories = [], value, onChange }) {
  return (
    <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
      <button
        type="button"
        className={`btn btn-sm ${!value ? 'btn-lg-primary' : 'btn-lg-outline'}`}
        onClick={() => onChange(null)}
      >
        Toutes
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`btn btn-sm ${Number(value) === Number(cat.id) ? 'btn-lg-primary' : 'btn-lg-outline'}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.nom}
        </button>
      ))}
    </div>
  );
}
