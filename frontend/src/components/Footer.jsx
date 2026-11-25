import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h2 className="h5">LivresGourmands.net</h2>
            <p className="mb-0">
              Librairie en ligne — catalogue varié (romans, histoire, informatique, science-fiction…).
              Projet académique — Institut Grasset, 420-WA6-AG.
            </p>
          </div>
          <div className="col-md-3">
            <h2 className="h6">Navigation</h2>
            <ul className="list-unstyled mb-0">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/recherche">Recherche</Link></li>
              <li><Link to="/panier">Panier</Link></li>
              <li><Link to="/listes-cadeaux">Listes cadeaux</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h2 className="h6">Compte</h2>
            <ul className="list-unstyled mb-0">
              {!isAuthenticated ? (
                <>
                  <li><Link to="/connexion">Connexion</Link></li>
                  <li><Link to="/inscription">Inscription</Link></li>
                </>
              ) : (
                <li><Link to="/mes-commandes">Mes commandes</Link></li>
              )}
              <li><Link to="/mot-de-passe-oublie">Mot de passe oublié</Link></li>
            </ul>
          </div>
        </div>
        <hr className="border-light opacity-25 my-4" />
        <p className="small mb-0">
          © {new Date().getFullYear()} LivresGourmands.net — Haoui &amp; El Marzouki
        </p>
      </div>
    </footer>
  );
}
