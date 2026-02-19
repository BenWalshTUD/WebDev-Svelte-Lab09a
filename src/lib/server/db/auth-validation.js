import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(6),
  firstname: z.string().min(1),
  surname: z.string().min(1),
  dob: z.string().min(1),
  email: z.string().email()
});