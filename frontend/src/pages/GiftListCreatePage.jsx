import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import * as giftListService from '../services/giftListService';
import { getErrorMessage } from '../utils/errorMessages';

export default function GiftListCreatePage() {
  const { isAuthenticated, isClient } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);

  if (!isAuthenticated || !isClient) {
    return (
      <div className="container py-5">
        <ErrorAlert message="Seuls les clients connectés peuvent créer une liste de cadeaux." />
        <Link to="/connexion" className="btn btn-lg-primary">Connexion</Link>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        nom,
        description,
        items: items.map((i) => ({ ouvrage_id: i.ouvrage_id, quantite: i.quantite })),
      };
      const liste = await giftListService.createGiftList(payload);
      setCreated(liste);
      clearCart();
    } catch (err) {
      setError(getErrorMessage(err, 'Création de liste impossible.'));
    }
  };

  if (created) {
    return (
      <div className="container py-5">
        <div className="alert alert-success" role="status">
          Liste créée. Code de partage : <strong>{created.code_partage}</strong>
        </div>
        <button
          type="button"
          className="btn btn-lg-primary"
          onClick={() => navigate(`/listes-cadeaux/${created.code_partage}`)}
        >
          Voir la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <h1 className="h2">Créer une liste de cadeaux</h1>
      <p className="text-muted">
        Les articles actuellement dans votre panier local peuvent être inclus.
        L’API crée un code de partage unique.
      </p>
      <ErrorAlert message={error} />
      <form onSubmit={onSubmit} className="bg-white border rounded p-4">
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom de la liste</label>
          <input id="nom" className="form-control" required value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea id="description" className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <p className="small">Articles du panier à inclure : {items.length}</p>
        <button type="submit" className="btn btn-lg-secondary">Créer la liste</button>
      </form>
    </div>
  );
}
