import { productsService } from '$lib/server/services/products-service.js';
import { categoriesService } from '$lib/server/services/categories-service.js';
import { cartService } from '$lib/server/services/cart-Service';
import { error } from '@sveltejs/kit';

// Load function
export async function load({ params }) {

    // get the product details for the product ID passed in
    const product = await productsService.getProductById(Number(params.id));

    // If the product is not found
    if (!product) throw error(404, 'Product not found');

    // We want to display the category name but only have the category ID
    // Make a call to the categories service with the ID to get the name
    const category = await categoriesService.getCategoryById(product.categoryId);
    const categoryName = category.name;

    return { product, categoryName };
}

// Cart Action
export const actions = {
  addToCart: async ({ locals, request }) => {
    if (!locals.user) throw error(401);

    const data = await request.formData();
    const productId = Number(data.get('productId'));

    if (!productId) throw error(400, 'Invalid product');

    await cartService.addItem(locals.user.id, productId, 1);

    return { success: true };
  }
};