import api from './api';

export async function createGiftList(payload) {
  const { data } = await api.post('/api/listes', payload);
  return data;
}

export async function getGiftListByCode(code) {
  const { data } = await api.get(`/api/listes/${encodeURIComponent(code)}`);
  return data;
}

export async function addGiftListItem(listeId, ouvrage_id, quantite = 1) {
  const { data } = await api.post(`/api/listes/${listeId}/items`, { ouvrage_id, quantite });
  return data;
}

export async function buyGiftListItem(listeId, payload) {
  const { data } = await api.post(`/api/listes/${listeId}/acheter`, payload);
  return data;
}
