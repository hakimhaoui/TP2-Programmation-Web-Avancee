import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider, useCart } from '../src/context/CartContext';
import { setStoredAuth } from '../src/services/api';
import { loadCart } from '../src/utils/cartStorage';

function Probe({ onReady }) {
  const cart = useCart();
  onReady(cart);
  return (
    <div>
      <span data-testid="count">{cart.getCartCount()}</span>
      <span data-testid="msg">{cart.message}</span>
    </div>
  );
}

function Harness({ user, children }) {
  if (user) {
    setStoredAuth({ token: 'fake', user });
  } else {
    setStoredAuth(null);
  }
  return (
    <AuthProvider key={user?.id || 'invite'}>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}

describe('CartContext isolation et retours', () => {
  beforeEach(() => {
    localStorage.clear();
    setStoredAuth(null);
  });

  it('n’écrit pas le panier du compte A sous la clé du compte B', async () => {
    const userA = { id: 1, nom: 'A', email: 'a@test.ca', role: 'client' };
    const userB = { id: 2, nom: 'B', email: 'b@test.ca', role: 'client' };
    let cartApi;

    const { rerender } = render(
      <Harness user={userA}>
        <Probe onReady={(c) => { cartApi = c; }} />
      </Harness>
    );

    await act(async () => {
      const ok = cartApi.addToCart(
        { id: 10, titre: 'Livre A', auteur: 'X', prix: 10, stock: 5 },
        1
      );
      expect(ok).toBe(true);
    });

    expect(loadCart(1)).toHaveLength(1);

    rerender(
      <Harness user={userB}>
        <Probe onReady={(c) => { cartApi = c; }} />
      </Harness>
    );

    expect(loadCart(2)).toEqual([]);
    expect(loadCart(1)).toHaveLength(1);
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('addToCart refuse une quantité décimale et retourne false', async () => {
    const user = { id: 4, nom: 'C', email: 'c@test.ca', role: 'client' };
    let cartApi;
    render(
      <Harness user={user}>
        <Probe onReady={(c) => { cartApi = c; }} />
      </Harness>
    );

    let ok;
    await act(async () => {
      ok = cartApi.addToCart(
        { id: 2, titre: 'Dune', auteur: 'H', prix: 24.95, stock: 5 },
        1.5
      );
    });
    expect(ok).toBe(false);
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('msg').textContent).toMatch(/invalid/i);
  });

  it('updateQuantity retourne false sans changer le panier si stock dépassé', async () => {
    const user = { id: 4, nom: 'C', email: 'c@test.ca', role: 'client' };
    let cartApi;
    render(
      <Harness user={user}>
        <Probe onReady={(c) => { cartApi = c; }} />
      </Harness>
    );

    await act(async () => {
      expect(cartApi.addToCart(
        { id: 2, titre: 'Dune', auteur: 'H', prix: 24.95, stock: 2 },
        1
      )).toBe(true);
    });

    let ok;
    await act(async () => {
      ok = cartApi.updateQuantity(2, 9);
    });
    expect(ok).toBe(false);
    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});
