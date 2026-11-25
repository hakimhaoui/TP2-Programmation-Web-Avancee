import api from './api';

export async function login(email, mot_de_passe) {
  const { data } = await api.post('/api/auth/login', { email, mot_de_passe });
  return data;
}

export async function register(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get('/api/users/me');
  return data;
}
