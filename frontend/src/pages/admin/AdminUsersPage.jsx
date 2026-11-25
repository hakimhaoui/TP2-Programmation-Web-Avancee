import { useEffect, useState } from 'react';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorMessages';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      setError('Seuls les administrateurs peuvent lister les utilisateurs (API).');
      return undefined;
    }
    let cancelled = false;
    adminService.getUsers()
      .then((data) => { if (!cancelled) setUsers(Array.isArray(data) ? data : []); })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isAdmin]);

  return (
    <div>
      <h1 className="h3">Utilisateurs</h1>
      <ErrorAlert message={error} />
      {loading && <LoadingSpinner />}
      {!loading && !error && (
        <div className="table-responsive bg-white border rounded">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nom}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
