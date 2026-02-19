import { error } from '@sveltejs/kit';
import { ordersDataAccess } from '$lib/server/data-access/orders-data-access';

export async function load({ params, locals }) {
  if (!locals.user) throw error(401);

  const orderId = Number(params.id);
  if (!orderId) throw error(400, 'Invalid order');

  const order = await ordersDataAccess.findByIdWithDetails(orderId);

  if (!order || order.userId !== locals.user.id) {
    throw error(404, 'Order not found');
  }

  return { order };
}