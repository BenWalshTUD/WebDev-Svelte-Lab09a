import { hash, verify } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';
import { authDataAccess } from '$lib/server/data-access/auth-data-access.js';
import { loginSchema, registerSchema } from '$lib/server/db/auth-validation.js';
import { AuthenticationError } from '$lib/server/utils/errors.js';

const argonOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

function stripPasswordHash(user) {
	// remove passwordHash before returning user object anywhere
	const { passwordHash: _ph, ...safeUser } = user;
	return safeUser;
}

export const authService = {
	async login(username, password) {
		const { username: u, password: p } = loginSchema.parse({ username, password });

		const user = await authDataAccess.findByUsername(u);
		if (!user) throw new AuthenticationError('Incorrect username or password');

		const valid = await verify(user.passwordHash, p, argonOptions);
		if (!valid) throw new AuthenticationError('Incorrect username or password');

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);

		return { user: stripPasswordHash(user), session, sessionToken };
	},

	async register(data) {
		const { password, ...validated } = registerSchema.parse(data);

		if (await authDataAccess.findByUsername(validated.username)) {
			throw new AuthenticationError('Username already exists');
		}

		if (await authDataAccess.findByEmail(validated.email)) {
			throw new AuthenticationError('Email already exists');
		}

		const passwordHash = await hash(password, argonOptions);

		const user = await authDataAccess.create({
			...validated,
			passwordHash,
			role: 'user'
		});

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);

		return { user: stripPasswordHash(user), session, sessionToken };
	}
};