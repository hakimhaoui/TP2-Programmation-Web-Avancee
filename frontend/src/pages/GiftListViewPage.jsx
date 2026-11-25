import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import * as giftListService from '../services/giftListService';
import * as bookService from '../services/bookService';
import { formatPrice } from '../utils/format';
import { getErrorMessage } from '../utils/errorMessages';

export default function GiftListViewPage() {
  const { code } = useParams();
  const { isClient, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [liste, setListe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await giftListService.getGiftListByCode(code);
        if (!cancelled) setListe(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Liste introuvable.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [code]);

  const addItemToCart = async (item) => {
    setInfo('');
    setError('');
    if (!isAuthenticated || !isClient) {
      setError('Connectez-vous en tant que client pour ajouter un cadeau au panier.');
      return;
    }
    try {
      const ouvrage = await bookService.getOuvrageById(item.ouvrage_id);
      const ok = addToCart(ouvrage, item.quantite || 1);
      if (ok) setInfo(`${ouvrage.titre} ajouté au panier.`);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible d’ajouter cet ouvrage.'));
    }
  };

  if (loading) return <div className="container py-5"><LoadingSpinner /></div>;
  if (error && !liste) {
    return (
      <div className="container py-5">
        <ErrorAlert message={error} />
        <Link to="/listes-cadeaux" className="btn btn-lg-outline">Retour</Link>
      </div>
    );
  }

  const items = liste.items || [];

  return (
    <div className="container py-4">
      <h1 className="h2">{liste.nom}</h1>
      <p className="text-muted">{liste.description || 'Sans description'}</p>
      <p className="small">Code : <strong>{liste.code_partage || code}</strong></p>
      <ErrorAlert message={error} onClose={() => setError('')} />
      {info && <div className="alert alert-success" role="status">{info}</div>}

      {items.length === 0 ? (
        <EmptyState title="Liste vide" description="Aucun ouvrage dans cette liste." />
      ) : (
        <div className="table-responsive bg-white border rounded">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th>Ouvrage</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id || `${item.ouvrage_id}`}>
                  <td>
                    <Link to={`/ouvrages/${item.ouvrage_id}`}>
                      {item.titre || `Ouvrage #${item.ouvrage_id}`}
                    </Link>
                  </td>
                  <td>{item.quantite}</td>
                  <td>{item.prix != null ? formatPrice(item.prix) : '—'}</td>
                  <td>{item.achete ? 'Déjà acheté' : 'Disponible'}</td>
                  <td>
                    {!item.achete && (
                      <button
                        type="button"
                        className="btn btn-sm btn-lg-secondary"
                        onClick={() => addItemToCart(item)}
                      >
                        Ajouter au panier
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
