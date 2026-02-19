// user-data-access.js
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

export const userDataAccess = {

  async findById(id) {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0] ?? null;
  },

  async findByUsername(username) {
    const result = await db.select().from(user).where(eq(user.username, username));
    return result[0] ?? null;
  },

  async findByEmail(email) {
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0] ?? null;
  },

  async findAll() {
    return await db.select().from(user);
  },

  async create(userData) {
    const result = await db.insert(user).values(userData).returning();
    return result[0];
  },

  async update(id, userData) {
    const result = await db.update(user).set(userData).where(eq(user.id, id)).returning();
    return result[0] ?? null;
  },

  async delete(id) {
    const result = await db.delete(user).where(eq(user.id, id)).returning();
    return result[0] ?? null;
  }
};
