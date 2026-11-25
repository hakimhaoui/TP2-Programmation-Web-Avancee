import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main" id="contenu-principal">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
