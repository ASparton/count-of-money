import { LuciaError } from 'lucia';
import { NextFunction, Request, Response } from 'express';

import ApiErrors from '~apiErrors';
import HttpStatusCode from '#types/HttpStatusCode';

import { auth } from '~lucia';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/**
 * Log the incoming request on the command line.
 */
export function logger(req: Request, _: Response, next: NextFunction) {
	console.log('[%s] %s', req.method, req.path);
	next();
}

/**
 * Only pass to the next middleware if the request is authenticated.
 */
export async function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	console.log('[AUTH] protected endpoint middleware');
	const handler = auth.handleRequest(req, res);
	const session = await handler.validateBearerToken();

	if (!session) {
		return res
			.status(HttpStatusCode.UNAUTHORIZED_401)
			.send(ApiErrors.UNAUTHORIZED);
	}

	// Set user and session info for convenience
	req.lucia = {
		sessionId: session.sessionId,
		user: session.user,
	};

	next();
}
/**
 * Handle errors raised by the controllers.
 */
export function errorHandler<T>(
	err: T,
	_: Request,
	res: Response,
	next: NextFunction,
) {
	if (err instanceof LuciaError) {
		console.log('[error] %s', err.message);
		switch (err.message) {
			case 'AUTH_INVALID_KEY_ID':
				res
					.status(HttpStatusCode.BAD_REQUEST_400)
					.send(ApiErrors.INVALID_EMAIL_ADDRESS);
				break;

			case 'AUTH_INVALID_PASSWORD':
				res
					.status(HttpStatusCode.BAD_REQUEST_400)
					.send(ApiErrors.INVALID_PASSWORD);
				break;

			case 'AUTH_DUPLICATE_KEY_ID':
				res
					.status(HttpStatusCode.BAD_REQUEST_400)
					.send(ApiErrors.EMAIL_ALREADY_TAKEN);
				break;

			default:
				res
					.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
					.send(ApiErrors.UNEXPECTED_AUTHENTICATION_ERROR);
				break;
		}
	} else if (err instanceof ZodError) {
		console.log('[error] %s', err.message);
		res.status(HttpStatusCode.BAD_REQUEST_400).send(err.message);
	} else if (err instanceof PrismaClientKnownRequestError) {
		console.log('[error] %s %s', err.code, err.meta);
		switch (err.code) {
			case 'P2003':
				res
					.status(HttpStatusCode.NOT_FOUND_404)
					.send(ApiErrors.RESOURCE_NOT_FOUND);
				break;

			default:
				res
					.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
					.send(ApiErrors.UNEXPECTED_SERVER_ERROR);
				break;
		}
	} else {
		console.log('[error] %s', err);
		res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
			.send(ApiErrors.UNEXPECTED_SERVER_ERROR);
	}

	next();
}
