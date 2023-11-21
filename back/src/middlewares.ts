import { LuciaError } from 'lucia';
import { NextFunction, Request, Response } from 'express';

import ApiErrors from '~apiErrors';
import HttpStatusCode from '#types/HttpStatusCode';

import { auth } from '~lucia';

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
		userId: session.user.userId,
		sessionId: session.sessionId,
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
	console.log('[error] %s', err);

	if (err instanceof LuciaError) {
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
	}

	// TODO: handle zod errors
	else {
		res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
			.send(ApiErrors.UNEXPECTED_SERVER_ERROR);
	}

	next();
}
