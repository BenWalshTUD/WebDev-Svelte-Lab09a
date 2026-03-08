// src/routes/admin/+layout.server.js
import { error, redirect } from "@sveltejs/kit";
import { usersService } from '$lib/server/services/users-service.js';

export async function load({ locals }) {
  
  // Layer 1: Check if logged in
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

    // Get user details
    const fullUser = await usersService.getById(Number(locals.user.id));

  // Layer 2: Check if admin role
  if (fullUser.role !== 'admin') {
    throw error(403, 'Admin access required');
  }

  return {
    user: fullUser
  };
}
