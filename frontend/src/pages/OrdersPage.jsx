import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import * as orderService from '../services/orderService';
import { formatPrice, formatDate } from '../utils/format';
import { getErrorMessage } from '../utils/errorMessages';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let cancelled = false;
    orderService.getOrders()
      .then((data) => { if (!cancelled) setCommandes(Array.isArray(data) ? data : []); })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Connexion requise"
          action={<Link to="/connexion" className="btn btn-lg-primary">Connexion</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h2">Mes commandes</h1>
      <ErrorAlert message={error} />
      {loading && <LoadingSpinner />}
      {!loading && commandes.length === 0 && (
        <EmptyState title="Aucune commande" description="Vos commandes apparaîtront ici." />
      )}
      <div className="list-group">
        {commandes.map((c) => (
          <div key={c.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <strong>Commande #{c.id}</strong>
              <span>{formatPrice(c.total)}</span>
            </div>
            <div className="small text-muted">
              {formatDate(c.created_at)} — statut : {c.statut}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
