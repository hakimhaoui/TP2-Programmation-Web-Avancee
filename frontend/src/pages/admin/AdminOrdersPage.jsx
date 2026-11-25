import { useEffect, useState } from 'react';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import * as orderService from '../../services/orderService';
import { formatDate, formatPrice } from '../../utils/format';
import { getErrorMessage } from '../../utils/errorMessages';
import { useAuth } from '../../context/AuthContext';

const STATUTS = ['en_attente', 'payee', 'expediee', 'livree', 'annulee'];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const canUpdate = ['gestionnaire', 'administrateur'].includes(user?.role);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getOrders();
      setCommandes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onStatus = async (id, statut) => {
    setError('');
    try {
      await orderService.updateOrderStatus(id, statut);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="h3">Commandes</h1>
      <ErrorAlert message={error} />
      {loading && <LoadingSpinner />}
      {!loading && commandes.length === 0 && (
        <EmptyState title="Aucune commande" description="Aucune commande visible pour ce compte." />
      )}
      {!loading && commandes.length > 0 && (
        <div className="table-responsive bg-white border rounded">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Total</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.user_id}</td>
                  <td>{formatPrice(c.total)}</td>
                  <td>{formatDate(c.created_at)}</td>
                  <td>
                    {canUpdate ? (
                      <select
                        className="form-select form-select-sm"
                        value={c.statut}
                        onChange={(e) => onStatus(c.id, e.target.value)}
                        aria-label={`Statut commande ${c.id}`}
                      >
                        {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : c.statut}
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
