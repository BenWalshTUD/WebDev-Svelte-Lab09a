import { usersService } from '$lib/server/services/users-service.js';
import { cartService } from '$lib/server/services/cart-service';

export async function load({ locals }) {
  if (!locals.user) {
    return {
      user: null,
      cartCount: 0
    };
  }

  // Get user details
  const fullUser = await usersService.getById(Number(locals.user.id));
  
  // Cart items
  const cart = await cartService.getOrCreateCart(locals.user.id);
  const items = await cartService.getItems(cart.id);


  return {
    user: fullUser,
    cartCount: items.length
  };
}