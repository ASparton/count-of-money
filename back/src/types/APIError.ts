import APIErrorId from "./APIErrorId";
import HttpStatusCode from "./HttpStatusCode";

type APIError = {
	id: APIErrorId;
	code: HttpStatusCode;
};

export default APIError;
