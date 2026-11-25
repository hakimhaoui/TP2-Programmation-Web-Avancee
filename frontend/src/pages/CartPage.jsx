import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import QuantitySelector from '../components/QuantitySelector';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import placeholder from '../assets/book-placeholder.svg';

export default function CartPage() {
  const { isAuthenticated, isClient } = useAuth();
  const {
    items, message, setMessage, canUseCart,
    updateQuantity, removeFromCart, getCartTotal, clearCart,
  } = useCart();

  if (!canUseCart) {
    return (
      <div className="container py-5">
        <ErrorAlert message="Le panier est réservé aux comptes clients." />
        <Link to="/" className="btn btn-lg-outline">Retour</Link>
      </div>
    );
  }

  if (!isAuthenticated || !isClient) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Connexion requise"
          description="Connectez-vous avec un compte client pour gérer votre panier."
          action={<Link className="btn btn-lg-primary" to="/connexion">Se connecter</Link>}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Votre panier est vide"
          description="Parcourez le catalogue pour ajouter des ouvrages."
          action={<Link className="btn btn-lg-primary" to="/">Voir le catalogue</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h2 mb-3">Panier</h1>
      <ErrorAlert message={message} onClose={() => setMessage('')} />

      <div className="table-responsive bg-white border rounded">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Ouvrage</th>
              <th scope="col">Prix</th>
              <th scope="col">Quantité</th>
              <th scope="col">Sous-total</th>
              <th scope="col"><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.ouvrage_id}>
                <td>
                  <div className="d-flex gap-3 align-items-center">
                    <img
                      src={item.image_url || placeholder}
                      alt=""
                      width="56"
                      height="72"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = placeholder; }}
                    />
                    <div>
                      <Link to={`/ouvrages/${item.ouvrage_id}`}>{item.titre}</Link>
                      <div className="small text-muted">{item.auteur}</div>
                    </div>
                  </div>
                </td>
                <td>{formatPrice(item.prix)}</td>
                <td>
                  <QuantitySelector
                    id={`qty-${item.ouvrage_id}`}
                    value={item.quantite}
                    min={1}
                    max={item.stock}
                    onChange={(q) => updateQuantity(item.ouvrage_id, q)}
                  />
                </td>
                <td>{formatPrice(item.prix * item.quantite)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(item.ouvrage_id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={clearCart}>
            Vider le panier
          </button>
          <Link to="/listes-cadeaux/creer" className="btn btn-lg-outline">
            Créer une liste cadeaux
          </Link>
        </div>
        <div className="text-end">
          <p className="h4 mb-2">Total : {formatPrice(getCartTotal())}</p>
          <p className="small text-muted">
            Les prix affichés sont indicatifs. Le total réel est recalculé côté serveur à la commande.
          </p>
          <Link to="/checkout" className="btn btn-lg-secondary">
            Livraison et règlement
          </Link>
        </div>
      </div>
    </div>
  );
}
