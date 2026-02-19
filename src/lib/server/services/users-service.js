// users-service.js
import { usersDataAccess } from '../data-access/users-data-access.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { requireAdmin } from '../utils/permissions.js';
import {
  insertUserSchema,
  updateUserSchema,
  deleteUserSchema
} from '../db/validation.js';

export const usersService = {

  /** Admin: Get all users */
  async getAllUsers(currentUser) {
    requireAdmin(currentUser);
    return await usersDataAccess.findAll();
  },

  /** Admin: Get user by ID */
  async getUserById(currentUser, id) {
    requireAdmin(currentUser);

    const user = await usersDataAccess.findById(id);
    if (!user) throw new NotFoundError('User not found');

    return user;
  },

  /** Admin: Create user */
  async createUser(currentUser, userData) {
    requireAdmin(currentUser);

    const validated = insertUserSchema.parse(userData);
    return await usersDataAccess.create(validated);
  },

  /** Admin: Update user */
  async updateUser(currentUser, id, userData) {
    requireAdmin(currentUser);

    // Prevent admin from demoting themselves
    if (currentUser.id === id && userData.role && userData.role !== 'admin') {
      throw new ForbiddenError('You cannot remove your own admin privileges');
    }

    const validated = updateUserSchema.parse(userData);

    const updated = await usersDataAccess.update(id, validated);
    if (!updated) throw new NotFoundError('User not found after update');

    return updated;
  },

  /** Admin: Delete user */
  async deleteUser(currentUser, id) {
    requireAdmin(currentUser);

    // Prevent suicide delete
    if (currentUser.id === id) {
      throw new ForbiddenError('You cannot delete your own account');
    }

    const validated = deleteUserSchema.parse({ id });

    const deleted = await usersDataAccess.delete(validated.id);
    if (!deleted) throw new NotFoundError('User not found to delete');

    return deleted;
  }
};