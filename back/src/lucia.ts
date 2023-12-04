import { prisma } from '@lucia-auth/adapter-prisma';
import { github } from '@lucia-auth/oauth/providers';
import { lucia } from 'lucia';

import 'lucia/polyfill/node';

import { PrismaClient } from '@prisma/client';
import { express } from 'lucia/middleware';

export const database = new PrismaClient();

export const auth = lucia({
	// Set to 'PROD' to use HTTPS
	env: 'DEV',

	adapter: prisma(database),
	middleware: express(),

	getUserAttributes: (user) => ({
		email: user.email,
		username: user.username,
		currency: user.currency,
		is_admin: user.is_admin,
	}),
});

export const githubAuth = github(auth, {
	clientId: process.env.GITHUB_CLIENT_ID ?? '',
	clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
});

export type Auth = typeof auth;
