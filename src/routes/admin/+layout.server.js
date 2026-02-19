// src/routes/admin/+layout.server.ts
import { error, redirect } from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  
  // Layer 1: Check if logged in
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  // Layer 2: Check if admin role
  if (locals.user.role !== 'admin') {
    throw error(403, 'Admin access required');
  }

  return {
    user: locals.user
  };
}