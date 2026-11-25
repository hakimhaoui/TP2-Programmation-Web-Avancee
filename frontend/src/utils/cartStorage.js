export function storageKey(userId) {
  return `lg_cart_${userId ?? 'invite'}`;
}

export function positiveInteger(value) {
  return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== ''))
    && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

export function sanitizeItems(raw) {
  if (!Array.isArray(raw)) return [];
  const entries = new Map();
  for (const item of raw) {
    const id = Number(item?.ouvrage_id ?? item?.id);
    const quantite = Number(item?.quantite);
    const stock = Number(item?.stock);
    const prix = Number(item?.prix);
    if (!positiveInteger(id) || !positiveInteger(item?.quantite) || !positiveInteger(item?.stock)
      || item?.prix == null || item.prix === '' || !Number.isFinite(prix) || prix < 0) continue;
    const previous = entries.get(id);
    entries.set(id, {
      ouvrage_id: id, titre: String(item?.titre || 'Ouvrage'),
      auteur: String(item?.auteur || ''), image_url: item?.image_url || null,
      prix, stock, quantite: Math.min((previous?.quantite || 0) + quantite, stock),
    });
  }
  return [...entries.values()];
}

export function loadCart(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? sanitizeItems(JSON.parse(raw)) : [];
  } catch { return []; }
}

export function saveCart(userId, items) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(items));
    return true;
  } catch { return false; }
}
