import { adminUsersService } from '$lib/server/services/admin-users-service.js';
import { fail, error } from '@sveltejs/kit';
import { ZodError } from 'zod';

export async function load({ locals }) {
	try {
		const users = await adminUsersService.getAllUsers(locals.user);
		return { users };
	} catch (err) {
		throw error(500, err.message);
	}
}

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

			await adminUsersService.createUser(
				locals.user,
				{
					name: formData.get('name'),
					email: formData.get('email'),
					password: formData.get('password'),
					dob: formData.get('dob'),
					role: formData.get('role')
				},
				request.headers
			);

			return { success: true };
		} catch (err) {
			if (err instanceof ZodError) {
				return fail(400, { errors: zodToFieldErrors(err) });
			}
			return fail(500, { errors: { general: err.message } });
		}
	},

	updateUser: async ({ request, locals }) => {
		try {
			const formData = await request.formData();

			await adminUsersService.updateUser(
				locals.user,
				Number(formData.get('id')),
				{
					name: formData.get('name'),
					email: formData.get('email'),
					dob: formData.get('dob'),
					role: formData.get('role')
				},
				request.headers
			);

			return { success: true };
		} catch (err) {
			if (err instanceof ZodError) {
				return fail(400, { errors: zodToFieldErrors(err) });
			}
			return fail(500, { errors: { general: err.message } });
		}
	},

	deleteUser: async ({ request, locals }) => {
		try {
			await adminUsersService.deleteUser(
				locals.user,
				Number((await request.formData()).get('id')),
				request.headers
			);

			return { success: true };
		} catch (err) {
			return fail(500, { errors: { general: err.message } });
		}
	},

	resetPassword: async ({ request, locals }) => {
		try {
			const formData = await request.formData();

			await adminUsersService.resetPassword(
				locals.user,
				{
					id: Number(formData.get('id')),
					password: formData.get('password')
				},
				request.headers
			);

			return { success: true };
		} catch (err) {
			if (err instanceof ZodError) {
				return fail(400, { errors: zodToFieldErrors(err) });
			}
			return fail(500, { errors: { general: err.message } });
		}
	}
};