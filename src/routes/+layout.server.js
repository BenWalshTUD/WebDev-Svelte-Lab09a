import { cartService } from '$lib/server/services/cart-service';

export async function load({ locals }) {
  if (!locals.user) {
    return {
      user: null,
      cartCount: 0
    };
  }

  const cart = await cartService.getOrCreateCart(locals.user.id);
  const items = await cartService.getItems(cart.id);

  return {
    user: locals.user,
    cartCount: items.length
  };
}