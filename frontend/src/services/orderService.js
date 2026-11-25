import api from './api';

export async function createOrder() {
  const { data } = await api.post('/api/commandes', {});
  return data;
}

export async function getOrders() {
  const { data } = await api.get('/api/commandes');
  return data;
}

export async function getOrderById(id) {
  const { data } = await api.get(`/api/commandes/${id}`);
  return data;
}

export async function updateOrderStatus(id, statut) {
  const { data } = await api.put(`/api/commandes/${id}/status`, { statut });
  return data;
}
