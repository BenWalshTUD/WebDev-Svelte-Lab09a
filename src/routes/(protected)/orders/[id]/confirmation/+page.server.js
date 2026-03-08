import { error } from '@sveltejs/kit';
import { ordersDataAccess } from '$lib/server/data-access/orders-data-access';

export async function load({ params, locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const orderId = Number(params.id);
  const userId = Number(locals.user.id);

  if (!Number.isInteger(orderId) || orderId < 1) {
    throw error(400, 'Invalid order');
  }

  if (!Number.isInteger(userId) || userId < 1) {
    throw error(401, 'Invalid user');
  }

  const order = await ordersDataAccess.findByIdWithDetails(orderId);

  if (!order || order.userId !== userId) {
    throw error(404, 'Order not found');
  }

  return { order };
}