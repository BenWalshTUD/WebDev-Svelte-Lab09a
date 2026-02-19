import { ordersService } from '$lib/server/services/orders-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// load - server side
export async function load( {locals} ) {

    try {

        // Ensure the user is logged in
        if (!locals.user) {
            throw error(401, 'Not authenticated');
        }
        
        // Get the orders for the user logged in
        const orders = await ordersService.getOrdersByUser(locals.user.id);
        
        // debugging purposes
        console.log('Orders:', orders);

        // return data
        return {
            orders: orders
        }

    } catch (err) {
        console.error('Error retrieving orders:', err);
        throw error(500, 'Failed to load orders');
    }
}