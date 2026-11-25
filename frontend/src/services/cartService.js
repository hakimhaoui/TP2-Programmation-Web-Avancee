import api from './api';

/** Synchronisation optionnelle avec l’API panier (rôle client). */
export async function fetchServerCart() {
  const { data } = await api.get('/api/panier');
  return data;
}

export async function addServerCartItem(ouvrage_id, quantite) {
  const { data } = await api.post('/api/panier/items', { ouvrage_id, quantite });
  return data;
}

export async function updateServerCartItem(itemId, quantite) {
  const { data } = await api.put(`/api/panier/items/${itemId}`, { quantite });
  return data;
}

export async function removeServerCartItem(itemId) {
  const { data } = await api.delete(`/api/panier/items/${itemId}`);
  return data;
}
