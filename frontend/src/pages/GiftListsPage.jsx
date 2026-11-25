import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';

export default function GiftListsPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const cleaned = code.trim();
    if (!cleaned) {
      setError('Saisissez le code personnel de la liste.');
      return;
    }
    navigate(`/listes-cadeaux/${encodeURIComponent(cleaned)}`);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <h1 className="h2">Listes de cadeaux</h1>
      <p className="text-muted">
        Parcours ami : saisissez le code reçu pour consulter une liste.
        Les clients connectés peuvent aussi créer une liste.
      </p>
      <ErrorAlert message={error} onClose={() => setError('')} />
      <form onSubmit={onSubmit} className="bg-white border rounded p-4 mb-3">
        <label htmlFor="code" className="form-label">Code personnel</label>
        <input
          id="code"
          className="form-control mb-3"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ex. LC-TEST1234"
        />
        <button type="submit" className="btn btn-lg-primary">Consulter la liste</button>
      </form>
      <Link to="/listes-cadeaux/creer" className="btn btn-lg-outline">Créer une liste (client)</Link>
    </div>
  );
}
