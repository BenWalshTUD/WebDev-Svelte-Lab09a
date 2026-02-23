import { AuthenticationError, ForbiddenError } from '$lib/server/utils/errors.js';

export function requireAuth(user) {
	if (!user) throw new AuthenticationError('You must be logged in');
}

export function requireAdmin(user) {
	requireAuth(user);
	if (user.role !== 'admin') throw new ForbiddenError('Admin privileges required');
}