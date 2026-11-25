import { loadCart, saveCart, positiveInteger } from './cartStorage.js';

// Chaque instance possède une clé fixe : aucun effet ne peut copier un ancien panier.
export function createCartStore(userId, canUseCart) {
  let snapshot = { items: canUseCart ? loadCart(userId) : [], message: '' };
  const listeners = new Set();
  const publish = (items, message = '', persist = false) => {
    if (persist && !saveCart(userId, items)) message = 'Panier mis à jour, mais sauvegarde locale indisponible.';
    snapshot = { items, message };
    listeners.forEach(listener => listener());
  };
  const reject = message => { publish(snapshot.items, message); return false; };
  const allowed = () => canUseCart || reject('Le panier est réservé aux clients.');
  return {
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => snapshot,
    setMessage: message => publish(snapshot.items, typeof message === 'function' ? message(snapshot.message) : message),
    addToCart(ouvrage, quantite = 1) {
      if (!allowed()) return false;
      if (!positiveInteger(quantite)) return reject('Quantité invalide.');
      if (!positiveInteger(ouvrage?.id) || ouvrage?.prix == null || ouvrage.prix === '' || !Number.isFinite(Number(ouvrage.prix)) || Number(ouvrage.prix) < 0) return reject('Ouvrage invalide.');
      if (!positiveInteger(ouvrage?.stock)) return reject('Cet ouvrage est épuisé.');
      const id = Number(ouvrage.id), stock = Number(ouvrage.stock);
      const old = snapshot.items.find(i => i.ouvrage_id === id);
      const q = (old?.quantite || 0) + Number(quantite);
      if (q > stock) return reject(`Stock insuffisant (disponible : ${stock}).`);
      const entry = { ouvrage_id: id, titre: ouvrage.titre, auteur: ouvrage.auteur, image_url: ouvrage.image_url, prix: Number(ouvrage.prix), stock, quantite: q };
      publish(old ? snapshot.items.map(i => i.ouvrage_id === id ? entry : i) : [...snapshot.items, entry], '', true);
      return true;
    },
    updateQuantity(id, quantity) {
      if (!allowed()) return false;
      if (!positiveInteger(quantity)) return reject('Quantité invalide.');
      const old = snapshot.items.find(i => i.ouvrage_id === Number(id));
      if (!old) return reject('Ouvrage absent du panier.');
      if (Number(quantity) > old.stock) return reject('Stock insuffisant pour cette quantité.');
      publish(snapshot.items.map(i => i === old ? { ...i, quantite: Number(quantity) } : i), '', true);
      return true;
    },
    removeFromCart(id) { if (!allowed()) return false; publish(snapshot.items.filter(i => i.ouvrage_id !== Number(id)), '', true); return true; },
    clearCart() { if (!allowed()) return false; publish([], '', true); return true; },
  };
}
