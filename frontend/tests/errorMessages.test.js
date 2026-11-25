import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '../src/utils/errorMessages';

describe('getErrorMessage', () => {
  it('gère l’absence de réponse réseau', () => {
    expect(getErrorMessage({ message: 'Network Error' })).toMatch(/joindre le serveur/i);
  });

  it('mappe les codes HTTP connus', () => {
    expect(getErrorMessage({ response: { status: 401, data: {} } })).toMatch(/Authentification/i);
    expect(getErrorMessage({ response: { status: 404, data: { message: 'Ouvrage introuvable' } } }))
      .toBe('Ouvrage introuvable');
    expect(getErrorMessage({ response: { status: 409, data: { message: 'Stock insuffisant' } } }))
      .toBe('Stock insuffisant');
  });
});
