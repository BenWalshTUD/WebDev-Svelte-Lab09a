import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

const publicCols = {
  id: user.id,
  username: user.username,
  firstname: user.firstname,
  surname: user.surname,
  dob: user.dob,
  email: user.email,
  role: user.role
};

export const usersDataAccess = {
  async findById(id) {
    const result = await db.select(publicCols).from(user).where(eq(user.id, id)).limit(1);
    return result[0] ?? null;
  },

  async findAll() {
    return await db.select(publicCols).from(user);
  },

  async create(userData) {
    const result = await db.insert(user).values(userData).returning(publicCols);
    return result[0];
  },

  async update(id, userData) {
    const result = await db.update(user).set(userData).where(eq(user.id, id)).returning(publicCols);
    return result[0] ?? null;
  },

  async delete(id) {
    const result = await db.delete(user).where(eq(user.id, id));
    return result.rowsAffected > 0;
  }
};