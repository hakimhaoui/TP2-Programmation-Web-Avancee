import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, canAccessDashboard, isClient } = useAuth();
  const { getCartCount, canUseCart } = useCart();
  const count = getCartCount();

  return (
    <nav className="navbar navbar-expand-lg site-navbar sticky-top" aria-label="Navigation principale">
      <div className="container">
        <Link to="/" className="brand-mark navbar-brand">
          <img src={logo} alt="" width="42" height="42" />
          <span>
            <span className="brand-title d-block">LivresGourmands.net</span>
            <small className="text-muted fw-normal">Librairie en ligne</small>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Ouvrir le menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Accueil</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/recherche">Recherche</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/listes-cadeaux">Listes cadeaux</NavLink>
            </li>
            {canUseCart && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/panier">
                  Panier
                  {count > 0 && (
                    <span className="badge text-bg-danger ms-1" aria-label={`${count} articles`}>
                      {count}
                    </span>
                  )}
                </NavLink>
              </li>
            )}
            {isClient && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/mes-commandes">Mes commandes</NavLink>
              </li>
            )}
            {canAccessDashboard && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">Admin</NavLink>
              </li>
            )}
            {!isAuthenticated ? (
              <li className="nav-item">
                <Link className="btn btn-lg-primary btn-sm" to="/connexion">Connexion</Link>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-lg-outline btn-sm dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.nom || user?.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text small text-muted">Rôle : {user?.role}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button type="button" className="dropdown-item" onClick={logout}>
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
