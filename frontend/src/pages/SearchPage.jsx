import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import * as bookService from '../services/bookService';
import { getErrorMessage } from '../utils/errorMessages';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [ouvrages, setOuvrages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = params.get('q') || '';
  const categorieId = params.get('categorie_id');
  const tri = params.get('tri') || 'titre';

  useEffect(() => {
    bookService.getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const query = { tri, limit: 40 };
        if (search) query.search = search;
        if (categorieId) query.categorie_id = categorieId;
        const data = await bookService.getOuvrages(query);
        if (!cancelled) setOuvrages(data.ouvrages || []);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
          setOuvrages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [search, categorieId, tri]);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '' || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    setParams(next);
  };

  return (
    <div className="container py-4">
      <h1 className="h2 mb-3">Recherche</h1>
      <div className="mb-3">
        <SearchBar initial={search} onSearch={(q) => update({ q })} />
      </div>
      <div className="mb-3">
        <CategoryFilter
          categories={categories}
          value={categorieId}
          onChange={(id) => update({ categorie_id: id })}
        />
      </div>
      <div className="mb-4" style={{ maxWidth: 280 }}>
        <label htmlFor="tri-search" className="form-label">Tri</label>
        <select
          id="tri-search"
          className="form-select"
          value={tri}
          onChange={(e) => update({ tri: e.target.value })}
        >
          <option value="titre">Titre</option>
          <option value="popularite">Popularité</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
          <option value="recent">Récent</option>
        </select>
      </div>
      <ErrorAlert message={error} />
      {loading && <LoadingSpinner />}
      {!loading && ouvrages.length === 0 && (
        <EmptyState title="Aucun résultat" description="Aucun ouvrage ne correspond à ces critères." />
      )}
      <div className="row g-3">
        {ouvrages.map((o) => (
          <div className="col-sm-6 col-lg-3" key={o.id}>
            <BookCard ouvrage={o} />
          </div>
        ))}
      </div>
    </div>
  );
}
