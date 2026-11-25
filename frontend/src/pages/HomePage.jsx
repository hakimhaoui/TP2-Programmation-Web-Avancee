import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import * as bookService from '../services/bookService';
import { getErrorMessage } from '../utils/errorMessages';
import { formatPrice } from '../utils/format';
import placeholder from '../assets/book-placeholder.svg';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [ouvrages, setOuvrages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorieId, setCategorieId] = useState(null);
  const [search, setSearch] = useState('');
  const [tri, setTri] = useState('popularite');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    bookService.getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = { tri, limit: 24 };
        if (search) params.search = search;
        if (categorieId) params.categorie_id = categorieId;
        const data = await bookService.getOuvrages(params);
        if (!cancelled) setOuvrages(data.ouvrages || []);
      } catch (err) {
        if (!cancelled) {
          setOuvrages([]);
          setError(getErrorMessage(err, 'Impossible de charger les ouvrages.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [search, categorieId, tri]);

  const carouselItems = ouvrages.slice(0, 3);

  return (
    <>
      <section className="hero" aria-label="Présentation LivresGourmands">
        <div className="container hero-inner">
          <p className="hero-eyebrow">Librairie en ligne</p>
          <h1>LivresGourmands.net</h1>
          <p className="hero-lead">
            Explorez des ouvrages (romans, histoire, informatique, science-fiction…),
            filtrez par catégorie et préparez votre prochaine commande en quelques clics.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <a href="#catalogue" className="btn btn-lg-secondary">Voir le catalogue</a>
            {!isAuthenticated && (
              <Link to="/connexion" className="btn btn-outline-light">Se connecter</Link>
            )}
          </div>
        </div>
      </section>

      <div className="container py-4">
        <div className="row g-3 align-items-end mb-4">
          <div className="col-lg-7">
            <SearchBar initial={search} onSearch={setSearch} />
          </div>
          <div className="col-lg-5">
            <label htmlFor="tri" className="form-label">Trier par</label>
            <select
              id="tri"
              className="form-select"
              value={tri}
              onChange={(e) => setTri(e.target.value)}
            >
              <option value="popularite">Popularité</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="recent">Plus récents</option>
              <option value="titre">Titre</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="h5 mb-3">Catégories</h2>
          <CategoryFilter
            categories={categories}
            value={categorieId}
            onChange={setCategorieId}
          />
        </div>

        {carouselItems.length > 0 && (
          <section className="mb-5" aria-label="Ouvrages à la une">
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <h2 className="h4 mb-1">À la une</h2>
                <p className="text-muted small mb-0">Sélection du catalogue, connectée à l’API</p>
              </div>
            </div>
            <div id="homeCarousel" className="carousel slide featured-carousel" data-bs-ride="carousel">
              <div className="carousel-indicators">
                {carouselItems.map((o, index) => (
                  <button
                    key={o.id}
                    type="button"
                    data-bs-target="#homeCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : undefined}
                    aria-label={`Diapositive ${index + 1} : ${o.titre}`}
                  />
                ))}
              </div>
              <div className="carousel-inner">
                {carouselItems.map((o, index) => (
                  <div key={o.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div className="featured-slide">
                      <div className="featured-slide-cover">
                        <img
                          src={o.image_url || placeholder}
                          alt={`Couverture de ${o.titre}`}
                          onError={(e) => { e.currentTarget.src = placeholder; }}
                        />
                      </div>
                      <div className="featured-slide-body">
                        {o.categorie_nom && (
                          <span className="badge text-bg-light border mb-2">{o.categorie_nom}</span>
                        )}
                        <h3 className="h2 mb-2">{o.titre}</h3>
                        <p className="featured-author mb-2">par {o.auteur}</p>
                        <p className="featured-price mb-3">{formatPrice(o.prix)}</p>
                        <Link to={`/ouvrages/${o.id}`} className="btn btn-lg-primary">
                          Voir la fiche
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Précédent</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Suivant</span>
              </button>
            </div>
          </section>
        )}

        <section id="catalogue">
          <h2 className="h4 mb-3">Catalogue</h2>
          <ErrorAlert message={error} onClose={() => setError('')} />
          {loading && <LoadingSpinner label="Chargement des ouvrages depuis l’API…" />}
          {!loading && !error && ouvrages.length === 0 && (
            <EmptyState
              title="Aucun ouvrage trouvé"
              description="Modifiez votre recherche ou votre filtre de catégorie."
            />
          )}
          {!loading && ouvrages.length > 0 && (
            <div className="row g-3">
              {ouvrages.map((o) => (
                <div className="col-sm-6 col-lg-3" key={o.id}>
                  <BookCard ouvrage={o} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
