// zodSchemas.ts
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { user, productCategory, product, order, orderDetail } from './schema.js';

/** =========================
 * User Schemas
 * ========================= */
export const selectUserSchema = createSelectSchema(user);

export const insertUserSchema = createInsertSchema(user, {
  username: z.string().min(2, 'Username must be at least 2 characters'),
  passwordHash: z.string().min(30, 'Password hash is required'),
  firstname: z.string().min(1, 'Firstname is required'),
  surname: z.string().min(1, 'Surname is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  email: z.string().email('Must be a valid email'),
  role: z.enum(['user', 'admin']).default('user')
});

export const updateUserSchema = insertUserSchema
  .partial()
  .omit({
    id: true,
    passwordHash: true // update password separately
});

export const deleteUserSchema = z.object({
  id: z.coerce.number().int().positive()
});

/** =========================
 * Product Category Schemas
 * ========================= */
export const selectCategorySchema = createSelectSchema(productCategory);

export const insertCategorySchema = createInsertSchema(productCategory, {
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional()
});

export const updateCategorySchema = insertCategorySchema
  .partial()
  .omit({ id: true });

export const deleteCategorySchema = z.object({
  id: z.number().int().positive()
});

/** =========================
 * Product Schemas
 * ========================= */
export const selectProductSchema = createSelectSchema(product);

export const insertProductSchema = createInsertSchema(product, {
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().int().min(1, 'Price must be at least 1 cent'),
  image: z.string().optional(),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  categoryId: z.number().int().min(1, 'Category ID is required')
});

export const updateProductSchema = insertProductSchema
  .partial()
  .omit({ id: true });

export const deleteProductSchema = z.object({
  id: z.number().int().positive()
});

/** =========================
 * Order Schemas
 * ========================= */
export const selectOrderSchema = createSelectSchema(order);

export const insertOrderSchema = createInsertSchema(order, {
  userId: z.number().int().min(1, 'User ID is required'),
  status: z.string().default('pending'),
  total: z.number().int().min(0, 'Total cannot be negative')
});

export const updateOrderSchema = insertOrderSchema
  .partial()
  .omit({
    id: true,
    userId: true
});

export const deleteOrderSchema = z.object({
  id: z.number().int().positive()
});

/** =========================
 * Order Detail Schemas
 * ========================= */
export const selectOrderDetailSchema = createSelectSchema(orderDetail);

export const insertOrderDetailSchema = createInsertSchema(orderDetail, {
  orderId: z.number().int().min(1, 'Order ID is required'),
  productId: z.number().int().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().int().min(1, 'Unit price is required')
});

export const updateOrderDetailSchema = insertOrderDetailSchema
  .partial()
  .omit({
    id: true,
    orderId: true,
    productId: true
});

export const deleteOrderDetailSchema = z.object({
  id: z.number().int().positive()
});


/** =========================
 * Admin User Form Schemas
 * ========================= */

// For admin create user form (plaintext password)
export const adminCreateUserSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstname: z.string().min(1, 'Firstname is required'),
  surname: z.string().min(1, 'Surname is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  email: z.string().email('Must be a valid email'),
  role: z.enum(['user', 'admin']).default('user')
});

// For admin password reset form
export const adminResetPasswordSchema = z.object({
  id: z.coerce.number().int().positive(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});