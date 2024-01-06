import HttpStatusCode from "#types/HttpStatusCode";

enum ApiErrors {
  /**
   * Raised when the email given to the login route is not used by a user
   * in the database.
   */
  INVALID_EMAIL_ADDRESS = "INVALID_EMAIL_ADDRESS",

  /**
   * Raised when the password given to the login route does not match that
   * of the user in the database.
   */
  INVALID_PASSWORD = "INVALID_PASSWORD",

  /**
   * Raised when something unexpectedly caused an error in the server.
   */
  UNEXPECTED_AUTHENTICATION_ERROR = "UNEXPECTED_AUTHENTICATION_ERROR",

  /**
   * Raised when something unexpectedly caused an error in the server.
   */
  UNEXPECTED_SERVER_ERROR = "UNEXPECTED_SERVER_ERROR",

  /**
   * Raised when an unexpected zod error occured when parsing the request.
   */
  REQUEST_PARSING_ERROR = "REQUEST_PARSING_ERROR",

  /**
   * Raised when the email given to the register route is already
   * used by a user in the database.
   */
  EMAIL_ALREADY_TAKEN = "EMAIL_ALREADY_TAKEN",

  /**
   * Raised when a problem occured during oauth.
   */
  OAUTH_REQUEST_ERROR = "OAUTH_REQUEST_ERROR",

  /**
   * Raised when the user token is not valid, or the token was not given.
   */
  UNAUTHORIZED = "UNAUTHORIZED",

  /**
   * Raised when the user is not admin and the endpoint reached need admin rights
   */
  FORBIDDEN = "FORBIDDEN",

  /**
   * Raised when the resource at the given id was not found by prisma.
   */
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",

  /**
   * Raised when the request is not in a valid format.
   */
  BAD_REQUEST = "BAD_REQUEST",
}

export class APIError extends Error {
  public errorCode: HttpStatusCode;

  constructor(type: ApiErrors, errorCode: HttpStatusCode) {
    super(type);
    this.errorCode = errorCode;
  }
}

export default ApiErrors;
