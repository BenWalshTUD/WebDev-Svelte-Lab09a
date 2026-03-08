import { auth } from '$lib/server/auth';
import { usersDataAccess } from '$lib/server/data-access/users-data-access.js';
import { idSchema, adminInsertUserSchema, updateUserSchema } from '$lib/server/db/validation.js';
import { z } from 'zod';

/**
 * Local password schema for admin reset/create
 */
const adminPasswordSchema = z.object({
	password: z.string().min(8, 'Password must be at least 8 characters')
});

/**
 * Simple admin guard.
 * Keeps admin logic out of route file.
 */
async function requireAdmin(currentUser) {
	if (!currentUser) {
		throw error(401, 'Not logged in');
	}

	const fullUser = await usersDataAccess.findById(Number(currentUser.id));

	if (!fullUser || fullUser.role !== 'admin') {
		throw error(403, 'Forbidden');
	}
}

export const adminUsersService = {
	/**
	 * Admin: Get all users
	 */
	async getAllUsers(currentUser) {
		await requireAdmin(currentUser);
		return await usersDataAccess.findAll();
	},

	/**
	 * Admin: Create new user
	 * Must go through Better Auth.
	 */
	async createUser(currentUser, userData, headers) {
		await requireAdmin(currentUser);

		// 1️ Validate user fields
		const validatedUser = adminInsertUserSchema.parse({
			name: userData.name,
			email: userData.email,
			dob: userData.dob || null,
			role: userData.role || 'user'
		});

		// 2️ Validate password
		const validatedPassword = adminPasswordSchema.parse({
			password: userData.password
		});

		// 3️ Create via Better Auth
		await auth.api.createUser({
			body: {
				name: validatedUser.name,
				email: validatedUser.email,
				password: validatedPassword.password,
				role: validatedUser.role
			},
			headers
		});

		// 4️ Update extra app fields (dob)
		if (validatedUser.dob) {
			const created = await usersDataAccess.findByEmail(validatedUser.email);

			if (!created) {
				throw new Error('User created but not found in DB');
			}

			await usersDataAccess.update(created.id, {
				dob: validatedUser.dob
			});
		}

		return true;
	},

	/**
	 * Admin: Update user
	 * Auth-sensitive fields go through Better Auth
	 * Extra app fields (dob) updated directly
	 */
	async updateUser(currentUser, id, userData, headers) {
		await requireAdmin(currentUser);

		// Validate ID
		const validatedId = idSchema.parse({ id });

		// Validate patch
		const validatedPatch = updateUserSchema.parse(userData);

		const { role, dob, ...authFields } = validatedPatch;

		// Update name/email via Better Auth
		if (Object.keys(authFields).length > 0) {
			await auth.api.adminUpdateUser({
				body: {
					userId: validatedId.id,
					data: authFields
				},
				headers
			});
		}

		// Update role separately
		if (role) {
			await auth.api.setRole({
				body: {
					userId: validatedId.id,
					role
				},
				headers
			});
		}

		// Update extra app fields
		if (dob !== undefined) {
			await usersDataAccess.update(validatedId.id, { dob });
		}

		return true;
	},

	/**
	 * Admin: Delete user
	 * Must go through Better Auth.
	 */
	async deleteUser(currentUser, id, headers) {
		await requireAdmin(currentUser);

		const validated = idSchema.parse({ id });

		await auth.api.removeUser({
			body: { userId: validated.id },
			headers
		});

		return true;
	},

	/**
	 * Admin: Reset password
	 */
	async resetPassword(currentUser, payload, headers) {
		await requireAdmin(currentUser);

		const validatedId = idSchema.parse({ id: payload.id });

		const validatedPassword = adminPasswordSchema.parse({
			password: payload.password
		});

		await auth.api.setUserPassword({
			body: {
				userId: validatedId.id,
				newPassword: validatedPassword.password
			},
			headers
		});

		return true;
	}
};