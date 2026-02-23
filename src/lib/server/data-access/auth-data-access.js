import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

export const authDataAccess = {
  async findById(id) {
    const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return result[0] ?? null;
  },

  async findByUsername(username) {
    const result = await db.select().from(user).where(eq(user.username, username)).limit(1);
    return result[0] ?? null;
  },

  async findByEmail(email) {
    const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return result[0] ?? null;
  },

  async create(userData) {
    const result = await db.insert(user).values(userData).returning();
    return result[0];
  }
};