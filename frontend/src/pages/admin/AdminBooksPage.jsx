import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as bookService from '../../services/bookService';
import * as adminService from '../../services/adminService';
import { formatPrice } from '../../utils/format';
import { getErrorMessage } from '../../utils/errorMessages';
import { useAuth } from '../../context/AuthContext';

export default function AdminBooksPage() {
  const { user } = useAuth();
  const [ouvrages, setOuvrages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const canDelete = ['gestionnaire', 'administrateur'].includes(user?.role);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookService.getOuvrages({ limit: 100, tri: 'titre' });
      setOuvrages(data.ouvrages || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id, titre) => {
    if (!window.confirm(`Supprimer « ${titre} » ? Cette action est irréversible.`)) return;
    setInfo('');
    setError('');
    try {
      await adminService.deleteOuvrage(id);
      setInfo('Ouvrage supprimé.');
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Suppression refusée.'));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Ouvrages</h1>
        <Link to="/admin/ouvrages/nouveau" className="btn btn-lg-secondary btn-sm">Ajouter</Link>
      </div>
      <ErrorAlert message={error} />
      {info && <div className="alert alert-success" role="status">{info}</div>}
      {loading && <LoadingSpinner />}
      {!loading && (
        <div className="table-responsive bg-white border rounded">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ouvrages.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.titre}</td>
                  <td>{formatPrice(o.prix)}</td>
                  <td>{o.stock}</td>
                  <td className="d-flex gap-2">
                    <Link className="btn btn-sm btn-outline-primary" to={`/admin/ouvrages/${o.id}`}>
                      Modifier
                    </Link>
                    {canDelete && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(o.id, o.titre)}
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="small text-muted mt-2">
        La liste publique API n’inclut que les ouvrages avec stock &gt; 0.
        Les ouvrages épuisés restent accessibles via leur ID pour le personnel.
      </p>
    </div>
  );
}
