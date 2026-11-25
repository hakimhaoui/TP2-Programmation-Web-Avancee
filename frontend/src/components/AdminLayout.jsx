import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', end: true, label: 'Tableau de bord' },
  { to: '/admin/ouvrages', label: 'Ouvrages' },
  { to: '/admin/ouvrages/nouveau', label: 'Ajouter un ouvrage' },
  { to: '/admin/commandes', label: 'Commandes' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" aria-label="Menu administrateur">
        <h1 className="h5 mb-3">Espace admin</h1>
        <nav className="d-flex flex-column gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <p className="small mt-4 mb-0 opacity-75">
          Les droits exacts sont aussi vérifiés côté API.
        </p>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
