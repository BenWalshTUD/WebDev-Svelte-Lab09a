// utils/permissions.js
import { ForbiddenError } from './errors.js';

export function requireAdmin(user) {
  if (!user || user.role !== 'admin') {
    throw new ForbiddenError('Admin privileges required');
  }
}