import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protège une route selon l'authentification et les rôles autorisés.
 * roles optionnel : tableau de rôles API (ex. ['administrateur']).
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner label="Vérification de la session…" />;

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/" replace state={{ unauthorized: true }} />;
  }

  return children;
}
