import { authService } from '$lib/server/services/auth-service.js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { AuthenticationError } from '$lib/server/utils/errors.js';

export async function load({ locals }) {
	if (locals.user) throw redirect(302, '/account');
	return {};
}

export const actions = {
	login: async ({ request, locals, cookies }) => {
		try {
			const formData = await request.formData();
			const username = formData.get('username');
			const password = formData.get('password');

			const { user, session, sessionToken } = await authService.login(username, password);

			cookies.set('auth-session', sessionToken, {
				path: '/',
				expires: session.expiresAt
			});

			locals.user = user;
			locals.session = session;

			return { success: true };

		} catch (err) {
			console.error('Login error:', err);

			if (err instanceof AuthenticationError) {
				return fail(400, { errors: { general: err.message } });
			}

			if (err instanceof ZodError) {
				const errors = {};
				err.issues.forEach((e) => {
					const field = e.path[0]?.toString() ?? 'general';
					errors[field] = e.message;
				});
				return fail(400, { errors });
			}

			return fail(500, {
				errors: { general: err instanceof Error ? err.message : 'Login failed' }
			});
		}
	}
};