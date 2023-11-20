import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";

import "lucia/polyfill/node";

import { PrismaClient } from "@prisma/client";
import { express } from "lucia/middleware";

export const database = new PrismaClient();

export const auth = lucia({
	// Set to 'PROD' to use HTTPS
	env: "DEV",

	adapter: prisma(database),
	middleware: express(),

	getUserAttributes: (user) => ({
		email: user.email,
	}),
});

export type Auth = typeof auth;
