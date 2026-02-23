import { categoriesService } from '$lib/server/services/categories-service.js';
import { fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// load
export async function load() {
    try {
        const prodCats = await categoriesService.getAllCategories();

        return {
            prodCategories: prodCats
        };
    } catch (err) {
        console.error('Error retrieving categories:', err);
        return fail(500, { err });
    }
}

// Zod Errors
// If validation fails (checked by Zod), it throws a ZodError.
// We extract the field-specific messages and send them back to the page
// so the user can see what input was invalid instead of a server error.
function zodToFieldErrors(err) {
	const errors = {};
	err.issues.forEach((e) => {
		const field = e.path[0]?.toString();
		if (field) errors[field] = e.message;
	});
	return errors;
}

export const actions = {
    createCategory: async ({ request }) => {
        try {
            const formData = await request.formData();

            const categoryData = {
                name: formData.get('catName'),
                description: formData.get('catDesc')
            };

            await categoriesService.createCategory(categoryData);

            return { success: true };

        } catch (err) {
            console.error('Error creating category:', err);

            // Check for Zod Errors
            if (err instanceof ZodError) return fail(400, { errors: zodToFieldErrors(err) });

            return fail(500, {
                errors: { general: 'Failed to create category' }
            });
        }
    },

    updateCategory: async ({ request }) => {
        try {
            const formData = await request.formData();
            const id = Number(formData.get('catId'));

            const categoryData = {
                name: formData.get('catName'),
                description: formData.get('catDesc')
            };

            await categoriesService.updateCategory(id, categoryData);

            return { success: true };

        } catch (err) {
            console.error('Error updating category:', err);

            // Check for Zod Errors
            if (err instanceof ZodError) return fail(400, { errors: zodToFieldErrors(err) });

            return fail(500, {
                errors: { general: 'Failed to update category' }
            });
        }
    },

    deleteCategory: async ({ request }) => {
    try {
        const formData = await request.formData();
        const id = Number(formData.get('catId'));

        await categoriesService.deleteCategory(id);

        return { success: true };
        } catch (err) {
            console.error('Error deleting category:', err);

            // Check for Zod Errors
            if (err instanceof ZodError) return fail(400, { errors: zodToFieldErrors(err) });

            // Drizzle errors can be nested; check both err and err.cause
            const code = err?.cause?.code || err?.code || '';
            const message = (err?.cause?.message || err?.message || '').toString();
            const isForeignKey = code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || message.includes('SQLITE_CONSTRAINT_FOREIGNKEY');

            if (isForeignKey) {
            return fail(409, {
                errors: {
                general: 'Cannot delete this category because it is linked to other records.'
                }
            });
            }

            // Generic, non-leaky message for unexpected DB errors
            return fail(500, {
                errors: { general: 'Failed to delete category' }
            });
        }
    }

};