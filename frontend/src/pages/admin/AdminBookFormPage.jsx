import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as adminService from '../../services/adminService';
import * as bookService from '../../services/bookService';
import { getErrorMessage } from '../../utils/errorMessages';

const empty = {
  titre: '',
  auteur: '',
  isbn: '',
  description: '',
  prix: '',
  stock: '0',
  categorie_id: '',
  image_url: '',
  date_publication: '',
};

export default function AdminBookFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.getCategoriesAdmin()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return undefined;
    let cancelled = false;
    bookService.getOuvrageById(id)
      .then((o) => {
        if (cancelled) return;
        setForm({
          titre: o.titre || '',
          auteur: o.auteur || '',
          isbn: o.isbn || '',
          description: o.description || '',
          prix: String(o.prix ?? ''),
          stock: String(o.stock ?? 0),
          categorie_id: o.categorie_id ? String(o.categorie_id) : '',
          image_url: o.image_url || '',
          date_publication: o.date_publication ? String(o.date_publication).slice(0, 10) : '',
        });
      })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const prix = Number(form.prix);
    const stock = Number(form.stock);
    if (!form.titre.trim() || !form.auteur.trim()) {
      setError('Titre et auteur sont obligatoires.');
      return;
    }
    if (!Number.isFinite(prix) || prix < 0) {
      setError('Prix invalide.');
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError('Stock invalide (entier ≥ 0).');
      return;
    }

    const payload = {
      titre: form.titre.trim(),
      auteur: form.auteur.trim(),
      isbn: form.isbn || null,
      description: form.description || null,
      prix,
      stock,
      categorie_id: form.categorie_id ? Number(form.categorie_id) : null,
      image_url: form.image_url || null,
      date_publication: form.date_publication || null,
    };

    setSaving(true);
    try {
      if (isEdit) await adminService.updateOuvrage(id, payload);
      else await adminService.createOuvrage(payload);
      navigate('/admin/ouvrages');
    } catch (err) {
      setError(getErrorMessage(err, 'Enregistrement impossible.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 className="h3">{isEdit ? 'Modifier un ouvrage' : 'Ajouter un ouvrage'}</h1>
      <ErrorAlert message={error} />
      <form onSubmit={onSubmit} className="bg-white border rounded p-4">
        {[
          ['titre', 'Titre', 'text', true],
          ['auteur', 'Auteur', 'text', true],
          ['isbn', 'ISBN', 'text', false],
          ['prix', 'Prix', 'number', true],
          ['stock', 'Stock', 'number', true],
          ['image_url', 'URL de l’image', 'url', false],
          ['date_publication', 'Date de publication', 'date', false],
        ].map(([name, label, type, required]) => (
          <div className="mb-3" key={name}>
            <label htmlFor={name} className="form-label">{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              className="form-control"
              required={required}
              step={name === 'prix' ? '0.01' : undefined}
              min={name === 'prix' || name === 'stock' ? '0' : undefined}
              value={form[name]}
              onChange={onChange}
            />
          </div>
        ))}
        <div className="mb-3">
          <label htmlFor="categorie_id" className="form-label">Catégorie</label>
          <select
            id="categorie_id"
            name="categorie_id"
            className="form-select"
            value={form.categorie_id}
            onChange={onChange}
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={4}
            value={form.description}
            onChange={onChange}
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-lg-primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <Link to="/admin/ouvrages" className="btn btn-outline-secondary">Annuler</Link>
        </div>
      </form>
    </div>
  );
}
