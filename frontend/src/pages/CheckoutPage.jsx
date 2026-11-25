import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import * as orderService from '../services/orderService';
import * as cartService from '../services/cartService';
import { formatPrice } from '../utils/format';
import { getErrorMessage } from '../utils/errorMessages';

/**
 * Parcours livraison / règlement.
 * L'API simule le paiement : aucun numéro de carte n'est envoyé.
 */
export default function CheckoutPage() {
  const { isAuthenticated, isClient } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [modeLivraison, setModeLivraison] = useState('standard');
  const [modePaiement, setModePaiement] = useState('simulation');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isAuthenticated || !isClient) {
    return (
      <div className="container py-5">
        <ErrorAlert message="Connexion client requise pour commander." />
        <Link to="/connexion" className="btn btn-lg-primary">Connexion</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <ErrorAlert message="Votre panier local est vide." />
        <Link to="/" className="btn btn-lg-outline">Catalogue</Link>
      </div>
    );
  }

  const syncAndOrder = async () => {
    setBusy(true);
    setError('');
    try {
      // Synchronise le panier serveur avec le panier local avant la commande API
      const server = await cartService.fetchServerCart();
      for (const sItem of server.items || []) {
        await cartService.removeServerCartItem(sItem.id);
      }
      for (const item of items) {
        await cartService.addServerCartItem(item.ouvrage_id, item.quantite);
      }
      const result = await orderService.createOrder();
      clearCart();
      navigate('/confirmation', { state: { commande: result.commande || result } });
    } catch (err) {
      setError(getErrorMessage(err, 'Commande impossible.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h1 className="h2">Livraison et règlement</h1>
      <ErrorAlert message={error} />
      <div className="bg-white border rounded p-4 mb-3">
        <p><strong>Total indicatif local :</strong> {formatPrice(getCartTotal())}</p>
        <div className="mb-3">
          <label htmlFor="livraison" className="form-label">Mode de livraison</label>
          <select id="livraison" className="form-select" value={modeLivraison} onChange={(e) => setModeLivraison(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="ramassage">Ramassage en magasin</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="paiement" className="form-label">Mode de règlement</label>
          <select id="paiement" className="form-select" value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
            <option value="simulation">Paiement simulé (API)</option>
          </select>
        </div>
        <div className="alert alert-warning small" role="note">
          Aucune donnée bancaire n’est collectée. Le bouton ouvre une page de confirmation
          après création de commande côté serveur (paiement simulé).
        </div>
        <div className="d-flex gap-2">
          <Link to="/paiement-externe" className="btn btn-lg-outline">Voir page paiement externe (maquette)</Link>
          <button type="button" className="btn btn-lg-secondary" disabled={busy} onClick={syncAndOrder}>
            {busy ? 'Traitement…' : 'Confirmer la commande simulée'}
          </button>
        </div>
      </div>
    </div>
  );
}
