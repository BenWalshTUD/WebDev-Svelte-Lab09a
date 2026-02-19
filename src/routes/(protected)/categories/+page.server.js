import { categoriesService } from '$lib/server/services/categories-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// load - server side
export async function load() {

    try {
        
        // Get the data from the database through the service layer
        const prodCats = await categoriesService.getAllCategories();
        
        // debugging purposes
        console.log('Product Categories:', prodCats);

        // return data
        return {
            prodCategories: prodCats
        }

    } catch (err) {
        console.error('Error retrieving categories:', err);
        return fail(500, { err });
    }
}