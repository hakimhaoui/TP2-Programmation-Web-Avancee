import { Link } from 'react-router-dom';
import placeholder from '../assets/book-placeholder.svg';
import { formatPrice } from '../utils/format';

export default function BookCard({ ouvrage }) {
  const img = ouvrage.image_url || placeholder;

  return (
    <article className="book-card">
      <Link to={`/ouvrages/${ouvrage.id}`} className="text-decoration-none text-dark">
        <img
          src={img}
          alt={`Couverture de ${ouvrage.titre}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholder;
          }}
        />
        <div className="card-body p-3">
          <h3 className="h6 mb-1">{ouvrage.titre}</h3>
          <p className="small text-muted mb-1">{ouvrage.auteur}</p>
          {ouvrage.categorie_nom && (
            <span className="badge text-bg-light border mb-2">{ouvrage.categorie_nom}</span>
          )}
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="price-tag">{formatPrice(ouvrage.prix)}</span>
            <span className="small text-muted">Stock : {ouvrage.stock}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
