import { usersDataAccess } from '$lib/server/data-access/users-data-access.js';
import { NotFoundError, ForbiddenError } from '$lib/server/utils/errors.js';
import { requireAdmin } from '$lib/server/utils/permissions.js';

import {
	insertUserSchema,
	updateUserSchema,
	deleteUserSchema,
	adminCreateUserSchema,
	adminResetPasswordSchema
} from '$lib/server/db/validation.js';

import { hash } from '@node-rs/argon2';

export const usersService = {
	/** Admin: Get all users */
	async getAllUsers(currentUser) {
		requireAdmin(currentUser);
		return await usersDataAccess.findAll();
	},

	/** Admin: Create user (form has plaintext password) */
	async createUser(currentUser, form) {
		requireAdmin(currentUser);

		// validate incoming form
		const validatedForm = adminCreateUserSchema.parse(form);

		// hash password
		const passwordHash = await hash(validatedForm.password);

		// convert form -> DB insert shape
		const insertCandidate = {
			username: validatedForm.username,
			passwordHash,
			firstname: validatedForm.firstname,
			surname: validatedForm.surname,
			dob: validatedForm.dob,
			email: validatedForm.email,
			role: validatedForm.role
		};

		// validate with drizzle-zod insert schema
		const validatedInsert = insertUserSchema.parse(insertCandidate);

		return await usersDataAccess.create(validatedInsert);
	},

	/** Admin: Update user (no password here) */
	async updateUser(currentUser, id, patch) {
		requireAdmin(currentUser);

		// prevent admin from demoting themselves
		if (currentUser.id === id && patch.role && patch.role !== 'admin') {
			throw new ForbiddenError('You cannot remove your own admin privileges');
		}

		const validated = updateUserSchema.parse(patch);

		const updated = await usersDataAccess.update(id, validated);
		if (!updated) throw new NotFoundError('User not found after update');

		return updated;
	},

	/** Admin: Delete user */
	async deleteUser(currentUser, id) {
		requireAdmin(currentUser);

		// prevent self delete
		if (currentUser.id === id) throw new ForbiddenError('You cannot delete your own account');

		const validated = deleteUserSchema.parse({ id });

		const deleted = await usersDataAccess.delete(validated.id);
		if (!deleted) throw new NotFoundError('User not found to delete');

		return deleted;
	},

	/** Admin: Reset password */
	async resetPassword(currentUser, payload) {
		requireAdmin(currentUser);

		const validated = adminResetPasswordSchema.parse(payload);

		const passwordHash = await hash(validated.password);

		const updated = await usersDataAccess.update(validated.id, { passwordHash });
		if (!updated) throw new NotFoundError('User not found after password reset');

		return updated;
	}
};