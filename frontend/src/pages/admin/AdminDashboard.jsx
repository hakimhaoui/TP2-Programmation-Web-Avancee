import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import * as bookService from '../../services/bookService';
import * as orderService from '../../services/orderService';
import { getErrorMessage } from '../../utils/errorMessages';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ ouvrages: null, commandes: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [ouvragesData, commandes] = await Promise.all([
          bookService.getOuvrages({ limit: 1 }),
          orderService.getOrders().catch(() => null),
        ]);
        if (!cancelled) {
          setStats({
            ouvrages: ouvragesData.resultats ?? (ouvragesData.ouvrages?.length ?? null),
            commandes: Array.isArray(commandes) ? commandes.length : null,
          });
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="h3">Tableau de bord</h1>
      <p className="text-muted">Connecté en tant que {user?.nom} ({user?.role}).</p>
      <ErrorAlert message={error} />
      {loading && <LoadingSpinner />}
      {!loading && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="bg-white border rounded p-3">
              <p className="small text-muted mb-1">Ouvrages en stock (page API)</p>
              <p className="h3 mb-0">{stats.ouvrages ?? '—'}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white border rounded p-3">
              <p className="small text-muted mb-1">Commandes visibles</p>
              <p className="h3 mb-0">{stats.commandes ?? '—'}</p>
            </div>
          </div>
        </div>
      )}
      <div className="d-flex flex-wrap gap-2">
        <Link to="/admin/ouvrages" className="btn btn-lg-primary">Gérer les ouvrages</Link>
        <Link to="/admin/commandes" className="btn btn-lg-outline">Voir les commandes</Link>
      </div>
      <p className="small text-muted mt-3 mb-0">
        Aucune statistique inventée : seules les données réellement renvoyées par l’API sont affichées.
      </p>
    </div>
  );
}
