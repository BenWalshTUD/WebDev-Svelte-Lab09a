import { usersService } from '$lib/server/services/users-service.js';
import { fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { AuthenticationError, ForbiddenError, NotFoundError } from '$lib/server/utils/errors.js';

// load
export async function load({ locals }) {
	try {
		const users = await usersService.getAllUsers(locals.user);
		return { users };
	} catch (err) {
		console.error('Error retrieving users:', err);

		if (err instanceof AuthenticationError) return fail(401, { errors: { general: err.message } });
		if (err instanceof ForbiddenError) return fail(403, { errors: { general: err.message } });

		return fail(500, { errors: { general: 'Failed to load users' } });
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
	createUser: async ({ request, locals }) => {
		try {
			const formData = await request.formData();

			// IMPORTANT: these names must match your +page.svelte inputs
			const payload = {
				username: formData.get('username'),
				password: formData.get('password'),
				firstname: formData.get('firstname'),
				surname: formData.get('surname'),
				dob: formData.get('dob'),
				email: formData.get('email'),
				role: formData.get('role') || 'user'
			};

			await usersService.createUser(locals.user, payload);
			return { success: true };
		} catch (err) {
			console.error('Error creating user:', err);

			// Check for Errors
			if (err instanceof ZodError) return fail(400, { errors: zodToFieldErrors(err) });
			if (err instanceof AuthenticationError) return fail(401, { errors: { general: err.message } });
			if (err instanceof ForbiddenError) return fail(403, { errors: { general: err.message } });

			return fail(500, { errors: { general: 'Failed to create user' } });
		}
	},

	updateUser: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const id = Number(formData.get('id'));

			const patch = {
				username: formData.get('username') || undefined,
				firstname: formData.get('firstname') || undefined,
				surname: formData.get('surname') || undefined,
				dob: formData.get('dob') || undefined,
				email: formData.get('email') || undefined,
				role: formData.get('role') || undefined
			};

			// Remove empty fields so updateUserSchema.partial() doesn't complain
			Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

			await usersService.updateUser(locals.user, id, patch);
			return { success: true };
		} catch (err) {
			console.error('Error updating user:', err);

			if (err instanceof ZodError) return fail(400, { errors: zodToFieldErrors(err) });
			if (err instanceof AuthenticationError) return fail(401, { errors: { general: err.message } });
			if (err instanceof ForbiddenError) return fail(403, { errors: { general: err.message } });
			if (err instanceof NotFoundError) return fail(404, { errors: { general: err.message } });

			return fail(500, { errors: { general: 'Failed to update user' } });
		}
	},

	deleteUser: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const id = Number(formData.get('id'));

			await usersService.deleteUser(locals.user, id);
			return { success: true };
		} catch (err) {
			console.error('Error deleting user:', err);

			if (err instanceof ZodError) return fail(400, { errors: zodToFieldErrors(err) });
			if (err instanceof AuthenticationError) return fail(401, { errors: { general: err.message } });
			if (err instanceof ForbiddenError) return fail(403, { errors: { general: err.message } });
			if (err instanceof NotFoundError) return fail(404, { errors: { general: err.message } });

			return fail(500, { errors: { general: 'Failed to delete user' } });
		}
	},

	resetPassword: async ({ request, locals }) => {
		try {
			const formData = await request.formData();

			const payload = {
				id: formData.get('id'),
				password: formData.get('password')
			};

			await usersService.resetPassword(locals.user, payload);
			return { success: true };
		} catch (err) {
			console.error('Error resetting password:', err);

			if (err instanceof ZodError) return fail(400, { errors: zodToFieldErrors(err) });
			if (err instanceof AuthenticationError) return fail(401, { errors: { general: err.message } });
			if (err instanceof ForbiddenError) return fail(403, { errors: { general: err.message } });
			if (err instanceof NotFoundError) return fail(404, { errors: { general: err.message } });

			return fail(500, { errors: { general: 'Failed to reset password' } });
		}
	}
};