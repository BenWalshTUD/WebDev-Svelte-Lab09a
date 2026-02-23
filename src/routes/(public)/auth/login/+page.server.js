import { authService } from '$lib/server/services/auth-service.js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { AuthenticationError } from '$lib/server/utils/errors.js';
import * as auth from '$lib/server/auth';

export async function load({ locals }) {
	if (locals.user) throw redirect(302, '/account');
	return {};
}

export const actions = {
	login: async (event) => {
		try {
			const formData = await event.request.formData();
			const username = formData.get('username');
			const password = formData.get('password');

			const { user, session, sessionToken } = await authService.login(username, password);

			// Uses your helper so cookie name/options are centralized
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			event.locals.user = user;
			event.locals.session = session;

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