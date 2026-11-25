import { Link, useLocation } from 'react-router-dom';
import { formatPrice } from '../utils/format';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const commande = state?.commande;

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h1 className="h2">Confirmation d’achat</h1>
      <div className="alert alert-success" role="status">
        Votre commande simulée a été enregistrée.
      </div>
      {commande ? (
        <div className="bg-white border rounded p-4 mb-3">
          <p><strong>N°</strong> {commande.id}</p>
          <p><strong>Statut :</strong> {commande.statut}</p>
          <p><strong>Total serveur :</strong> {formatPrice(commande.total)}</p>
        </div>
      ) : (
        <p className="text-muted">Détails de commande non transmis à cette page.</p>
      )}
      <Link to="/mes-commandes" className="btn btn-lg-primary me-2">Mes commandes</Link>
      <Link to="/" className="btn btn-lg-outline">Accueil</Link>
    </div>
  );
}
