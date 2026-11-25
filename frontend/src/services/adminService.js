import api from './api';

export async function createOuvrage(payload) {
  const { data } = await api.post('/api/ouvrages', payload);
  return data;
}

export async function updateOuvrage(id, payload) {
  const { data } = await api.put(`/api/ouvrages/${id}`, payload);
  return data;
}

export async function deleteOuvrage(id) {
  const { data } = await api.delete(`/api/ouvrages/${id}`);
  return data;
}

export async function getUsers() {
  const { data } = await api.get('/api/users');
  return data;
}

export async function getCategoriesAdmin() {
  const { data } = await api.get('/api/categories');
  return data;
}
