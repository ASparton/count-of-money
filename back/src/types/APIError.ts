import HttpStatusCode from "./HttpStatusCode";

type APIError = {
	id: string;
	code: HttpStatusCode;
};

export default APIError;
