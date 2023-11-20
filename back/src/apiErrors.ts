import APIError from "./types/APIError";
import HttpStatusCode from "./types/HttpStatusCode";

export const ResourceNotFound: APIError = {
	id: "RESOURCE_NOT_FOUND",
	code: HttpStatusCode.NOT_FOUND_404,
};

export const InvalidCredentials: APIError = {
	id: "INVALID_CREDENTIALS",
	code: HttpStatusCode.BAD_REQUEST_400,
};
