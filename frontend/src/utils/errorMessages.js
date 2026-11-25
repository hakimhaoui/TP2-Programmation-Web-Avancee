/**
 * Traduit les erreurs Axios / réseau en messages français clairs.
 */
export function getErrorMessage(error, fallback = 'Une erreur est survenue.') {
  if (!error) return fallback;

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'La requête a expiré. Réessayez plus tard.';
    }
    return 'Impossible de joindre le serveur. Vérifiez que l’API est démarrée.';
  }

  const status = error.response.status;
  const apiMessage = error.response.data?.message;

  const byStatus = {
    400: apiMessage || 'Données invalides.',
    401: apiMessage || 'Authentification nécessaire.',
    403: apiMessage || 'Accès interdit pour votre rôle.',
    404: apiMessage || 'Ressource introuvable.',
    409: apiMessage || 'Conflit : cette opération est impossible.',
    500: apiMessage || 'Erreur serveur. Réessayez plus tard.',
  };

  return byStatus[status] || apiMessage || fallback;
}
