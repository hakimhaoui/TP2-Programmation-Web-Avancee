import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '', email: '', mot_de_passe: '', telephone: '', adresse: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch {
      // message context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <h1 className="h2 mb-3">Inscription</h1>
      <p className="text-muted">Le compte créé aura le rôle client (règle API).</p>
      <ErrorAlert message={error} onClose={() => setError('')} />
      <form onSubmit={onSubmit} className="bg-white border rounded p-4">
        {[
          ['nom', 'Nom complet', 'text'],
          ['email', 'Courriel', 'email'],
          ['mot_de_passe', 'Mot de passe', 'password'],
          ['telephone', 'Téléphone (optionnel)', 'tel'],
          ['adresse', 'Adresse (optionnel)', 'text'],
        ].map(([name, label, type]) => (
          <div className="mb-3" key={name}>
            <label htmlFor={name} className="form-label">{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              className="form-control"
              required={name === 'nom' || name === 'email' || name === 'mot_de_passe'}
              value={form[name]}
              onChange={onChange}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-lg-primary w-100" disabled={submitting}>
          Créer mon compte
        </button>
      </form>
      <p className="mt-3">Déjà inscrit ? <Link to="/connexion">Connexion</Link></p>
    </div>
  );
}
