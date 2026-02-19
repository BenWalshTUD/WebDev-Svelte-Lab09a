// auth-service.js
import { hash, verify } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';
import { userDataAccess } from '$lib/server/data-access/user-data-access.js';
import { loginSchema, registerSchema } from '$lib/server/db/auth-validation.js';
import { AuthenticationError } from '$lib/server/utils/errors.js';

export const authService = {

  async login(username, password) {
    const { username: u, password: p } = loginSchema.parse({ username, password });

    const user = await userDataAccess.findByUsername(u);
    if (!user) throw new AuthenticationError('Incorrect username or password');

    const valid = await verify(user.passwordHash, p, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    if (!valid) throw new AuthenticationError('Incorrect username or password');

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, user.id);

    return { user, session, sessionToken };
  },

  async register(data) {
    const { password, ...validated } = registerSchema.parse(data);

    if (await userDataAccess.findByUsername(validated.username))
      throw new AuthenticationError('Username already exists');

    if (await userDataAccess.findByEmail(validated.email))
      throw new AuthenticationError('Email already exists');

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    const user = await userDataAccess.create({
      ...validated,
      passwordHash,
      role: 'user'
    });

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, user.id);

    return { user, session, sessionToken };
  }
};