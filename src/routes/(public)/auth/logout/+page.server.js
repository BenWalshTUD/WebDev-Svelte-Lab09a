import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ locals, cookies }) => {
    if (locals.session) {
      await auth.invalidateSession(locals.session.id);
    }

    cookies.delete(auth.sessionCookieName, { path: '/' });

    locals.user = null;
    locals.session = null;

    throw redirect(302, '/auth/login');
  }
};