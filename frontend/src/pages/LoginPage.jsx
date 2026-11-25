import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const data = await login(email, motDePasse);
      const from = location.state?.from;
      if (['administrateur', 'gestionnaire', 'editeur'].includes(data.user.role)) {
        navigate(from?.startsWith('/admin') ? from : '/admin', { replace: true });
      } else {
        navigate(from || '/', { replace: true });
      }
    } catch {
      // message déjà dans AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h1 className="h2 mb-3">Connexion</h1>
      <ErrorAlert message={error} onClose={() => setError('')} />
      <form onSubmit={onSubmit} className="bg-white border rounded p-4" noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Courriel</label>
          <input
            id="email"
            type="email"
            className="form-control"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-lg-primary w-100" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      <p className="mt-3">
        Pas encore de compte ? <Link to="/inscription">S’inscrire</Link>
      </p>
      <p><Link to="/mot-de-passe-oublie">Mot de passe oublié</Link></p>
    </div>
  );
}
