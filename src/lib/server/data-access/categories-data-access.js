// categoriesDataAccess.js
import { db } from '../db/index.js';
import { productCategory } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const categoriesDataAccess = {

  /** Find a category by its ID */
  async findById(id) {
    const result = await db.select().from(productCategory).where(eq(productCategory.id, id)).limit(1);
    return result[0] ?? null;
  },

  /** Find a category by its name */
  async findByName(name) {
    const result = await db.select().from(productCategory).where(eq(productCategory.name, name)).limit(1);
    return result[0] ?? null;
  },

  /** Get all categories */
  async findAll() {
    return await db.select().from(productCategory);
  },

  /** Create a new category */
  async create(categoryData) {
    const result = await db.insert(productCategory).values(categoryData).returning();
    return result[0];
  },

  /** Update an existing category */
  async update(id, categoryData) {
    const result = await db.update(productCategory).set(categoryData).where(eq(productCategory.id, id)).returning();
    return result[0];
  },

  /** Delete a category */
  async delete(id) {
    const result = await db.delete(productCategory).where(eq(productCategory.id, id));
    return result.rowsAffected > 0;
  }
};
