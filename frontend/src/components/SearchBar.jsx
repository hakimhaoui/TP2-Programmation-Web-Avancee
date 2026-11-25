import { useState } from 'react';

export default function SearchBar({ initial = '', onSearch, placeholder = 'Rechercher un titre ou un auteur…' }) {
  const [q, setQ] = useState(initial);

  return (
    <form
      className="d-flex gap-2"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(q.trim());
      }}
    >
      <label htmlFor="search-ouvrages" className="visually-hidden">Recherche</label>
      <input
        id="search-ouvrages"
        type="search"
        className="form-control"
        value={q}
        placeholder={placeholder}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="btn btn-lg-primary">
        <i className="bi bi-search" aria-hidden="true" /> Rechercher
      </button>
    </form>
  );
}
