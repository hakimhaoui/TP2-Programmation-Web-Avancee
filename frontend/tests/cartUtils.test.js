import { describe, expect, it, beforeEach } from 'vitest';
import {
  sanitizeItems,
  storageKey,
  loadCart,
  saveCart,
  positiveInteger,
} from '../src/utils/cartStorage';
import { createCartStore } from '../src/utils/cartStore';

describe('panier localStorage et quantités', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('refuse les quantités non entières (décimales)', () => {
    expect(positiveInteger(1.5)).toBe(false);
    expect(positiveInteger(2)).toBe(true);
    expect(positiveInteger(0)).toBe(false);
    const result = sanitizeItems([
      { ouvrage_id: 1, titre: 'A', prix: 10, stock: 5, quantite: 1.5 },
      { ouvrage_id: 2, titre: 'B', prix: 10, stock: 5, quantite: 2 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].ouvrage_id).toBe(2);
  });

  it('sanitizeItems ignore les quantités invalides', () => {
    const result = sanitizeItems([
      { ouvrage_id: 1, titre: 'A', prix: 10, stock: 5, quantite: 2 },
      { ouvrage_id: 2, titre: 'B', prix: 10, stock: 5, quantite: 0 },
      { ouvrage_id: 3, titre: 'C', prix: 10, stock: 5, quantite: -1 },
      { ouvrage_id: 'x', titre: 'D', prix: 10, stock: 5, quantite: 1 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].ouvrage_id).toBe(1);
  });

  it('sanitizeItems plafonne au stock', () => {
    const result = sanitizeItems([
      { ouvrage_id: 1, titre: 'A', prix: 12.5, stock: 3, quantite: 99 },
    ]);
    expect(result[0].quantite).toBe(3);
  });

  it('loadCart gère un JSON corrompu sans planter', () => {
    localStorage.setItem(storageKey(4), '{not-json');
    expect(loadCart(4)).toEqual([]);
  });

  it('isole les clés de panier par utilisateur', () => {
    expect(storageKey(1)).toBe('lg_cart_1');
    expect(storageKey(null)).toBe('lg_cart_invite');
    expect(storageKey(1)).not.toBe(storageKey(2));
  });

  it('ne contamine pas le panier B avec les articles de A lors d’un changement de clé', () => {
    const itemsA = [{ ouvrage_id: 1, titre: 'A', auteur: '', image_url: null, prix: 10, stock: 5, quantite: 1 }];
    saveCart(1, itemsA);
    saveCart(2, []);
    expect(loadCart(2)).toEqual([]);
    expect(loadCart(1)).toHaveLength(1);
  });

  it('createCartStore refuse les décimales et le stock insuffisant', () => {
    const store = createCartStore(1, true);
    const ouvrage = { id: 1, titre: 'Dune', auteur: 'X', prix: 24.95, stock: 2, image_url: null };
    expect(store.addToCart(ouvrage, 1.5)).toBe(false);
    expect(store.addToCart(ouvrage, 0)).toBe(false);
    expect(store.addToCart(ouvrage, 1)).toBe(true);
    expect(store.getSnapshot().items[0].quantite).toBe(1);
    expect(store.addToCart(ouvrage, 2)).toBe(false);
    expect(store.getSnapshot().items[0].quantite).toBe(1);
  });

  it('createCartStore updateQuantity retourne false sans modifier si quantité invalide', () => {
    const store = createCartStore(1, true);
    const ouvrage = { id: 1, titre: 'A', auteur: '', prix: 10, stock: 5, image_url: null };
    expect(store.addToCart(ouvrage, 1)).toBe(true);
    expect(store.updateQuantity(1, 1.7)).toBe(false);
    expect(store.getSnapshot().items[0].quantite).toBe(1);
    expect(store.updateQuantity(1, 3)).toBe(true);
    expect(store.getSnapshot().items[0].quantite).toBe(3);
  });
});
