import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import QuantitySelector from '../components/QuantitySelector';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import * as bookService from '../services/bookService';
import { formatDate, formatPrice } from '../utils/format';
import { getErrorMessage } from '../utils/errorMessages';
import placeholder from '../assets/book-placeholder.svg';

export default function ProductPage() {
  const { id } = useParams();
  const { isAuthenticated, isClient } = useAuth();
  const { addToCart, message, setMessage, canUseCart } = useCart();
  const [ouvrage, setOuvrage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      setSuccess('');
      if (!/^\d+$/.test(String(id))) {
        setError('Identifiant d’ouvrage invalide.');
        setLoading(false);
        return;
      }
      try {
        const data = await bookService.getOuvrageById(id);
        if (!cancelled) {
          setOuvrage(data);
          setQuantite(1);
        }
      } catch (err) {
        if (!cancelled) {
          setOuvrage(null);
          setError(getErrorMessage(err, 'Ouvrage introuvable ou épuisé.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleAdd = () => {
    setSuccess('');
    setMessage('');
    if (!canUseCart) {
      setError('Le panier est réservé aux comptes clients.');
      return;
    }
    if (!isAuthenticated) {
      setError('Connectez-vous avec un compte client pour ajouter au panier.');
      return;
    }
    if (!isClient) {
      setError('Seuls les clients peuvent utiliser le panier.');
      return;
    }
    const ok = addToCart(ouvrage, quantite);
    if (ok) setSuccess('Ouvrage ajouté au panier.');
  };

  if (loading) return <div className="container py-5"><LoadingSpinner /></div>;

  if (error && !ouvrage) {
    return (
      <div className="container py-5">
        <ErrorAlert message={error} />
        <Link to="/" className="btn btn-lg-outline">Retour à l’accueil</Link>
      </div>
    );
  }

  const stock = Number(ouvrage.stock);
  const epuise = stock <= 0;

  return (
    <div className="container py-4">
      <nav aria-label="Fil d'Ariane" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{ouvrage.titre}</li>
        </ol>
      </nav>

      <ErrorAlert message={error || message} onClose={() => { setError(''); setMessage(''); }} />
      {success && <div className="alert alert-success" role="status">{success}</div>}

      <div className="row g-4">
        <div className="col-md-5">
          <img
            src={ouvrage.image_url || placeholder}
            alt={`Couverture de ${ouvrage.titre}`}
            className="img-fluid rounded border w-100"
            style={{ maxHeight: 480, objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = placeholder; }}
          />
        </div>
        <div className="col-md-7">
          <h1 className="h2">{ouvrage.titre}</h1>
          <p className="text-muted mb-2">par {ouvrage.auteur}</p>
          {ouvrage.categorie_nom && (
            <span className="badge text-bg-light border mb-3">{ouvrage.categorie_nom}</span>
          )}
          <p className="price-tag fs-3">{formatPrice(ouvrage.prix)}</p>
          <p>{ouvrage.description || 'Aucune description fournie par l’API.'}</p>
          <ul className="list-unstyled small">
            <li><strong>Stock :</strong> {epuise ? 'Épuisé' : stock}</li>
            {ouvrage.isbn && <li><strong>ISBN :</strong> {ouvrage.isbn}</li>}
            {ouvrage.date_publication && (
              <li><strong>Publication :</strong> {formatDate(ouvrage.date_publication)}</li>
            )}
            <li>
              <strong>Note moyenne :</strong>{' '}
              {Number(ouvrage.note_moyenne || 0).toFixed(1)} ({ouvrage.nombre_avis || 0} avis)
            </li>
          </ul>

          {epuise ? (
            <div className="alert alert-warning" role="status">
              Cet ouvrage est épuisé et ne peut pas être ajouté au panier.
            </div>
          ) : (
            <div className="d-flex flex-wrap align-items-center gap-3">
              <QuantitySelector
                value={quantite}
                min={1}
                max={stock}
                onChange={setQuantite}
              />
              <button type="button" className="btn btn-lg-secondary" onClick={handleAdd}>
                Ajouter au panier
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="mt-5">
        <h2 className="h4">Avis</h2>
        {(ouvrage.avis || []).length === 0 ? (
          <p className="text-muted">Aucun avis pour le moment.</p>
        ) : (
          <div className="row g-3">
            {ouvrage.avis.map((a) => (
              <div className="col-md-6" key={a.id}>
                <article className="border rounded p-3 bg-white h-100">
                  <p className="mb-1"><strong>{a.titre || 'Avis'}</strong> — note {a.note}/5</p>
                  <p className="mb-0">{a.contenu}</p>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 mb-5">
        <h2 className="h4">Commentaires</h2>
        {(ouvrage.commentaires || []).length === 0 ? (
          <p className="text-muted">Aucun commentaire validé.</p>
        ) : (
          <ul className="list-group">
            {ouvrage.commentaires.map((c) => (
              <li className="list-group-item" key={c.id}>{c.contenu}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
