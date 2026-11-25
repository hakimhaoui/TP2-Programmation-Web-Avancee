import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

const AUTH_KEY = 'lg_auth';

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.token || !data?.user) return null;
    return data;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function setStoredAuth(auth) {
  if (!auth) {
    localStorage.removeItem(AUTH_KEY);
    return;
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  // Ne jamais envoyer le JWT hors de l'API configurée
  const requestUrl = new URL(config.url || '', config.baseURL || baseURL);
  const apiOrigin = new URL(baseURL).origin;
  if (auth?.token && requestUrl.origin === apiOrigin) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || '';
      // Session expirée : on nettoie le stockage local
      if (/token|expire|authentification/i.test(msg)) {
        const path = window.location.pathname;
        if (!path.startsWith('/connexion') && !path.startsWith('/inscription')) {
          setStoredAuth(null);
          window.dispatchEvent(new CustomEvent('lg:auth-expired'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
