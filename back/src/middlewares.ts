import HttpStatusCode from "#types/HttpStatusCode";
import { NextFunction, Request, Response } from "express";
import { LuciaError } from "lucia";

import ApiErrors from "~apiErrors";

/**
 * Log the incoming request on the command line.
 */
export function logger(req: Request, _: Response, next: NextFunction) {
	console.log("[%s] %s", req.method, req.path);
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
	console.log("[error] %s", err.message);

	if (err instanceof LuciaError) {
		switch (err.message) {
			case "AUTH_INVALID_KEY_ID":
				res
					.status(HttpStatusCode.BAD_REQUEST_400)
					.send(ApiErrors.INVALID_EMAIL_ADDRESS);
				break;

			case "AUTH_INVALID_PASSWORD":
				res
					.status(HttpStatusCode.BAD_REQUEST_400)
					.send(ApiErrors.INVALID_PASSWORD);
				break;

			case "AUTH_DUPLICATE_KEY_ID":
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
