import api from './api';

export async function getOuvrages(params = {}) {
  const { data } = await api.get('/api/ouvrages', { params });
  return data;
}

export async function getOuvrageById(id) {
  const { data } = await api.get(`/api/ouvrages/${id}`);
  return data;
}

export async function getCategories() {
  const { data } = await api.get('/api/categories');
  return data;
}

export async function createAvis(ouvrageId, payload) {
  const { data } = await api.post(`/api/ouvrages/${ouvrageId}/avis`, payload);
  return data;
}

export async function createCommentaire(ouvrageId, payload) {
  const { data } = await api.post(`/api/ouvrages/${ouvrageId}/commentaires`, payload);
  return data;
}
