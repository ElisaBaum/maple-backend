import BaseError from "@etianen/base-error";

export class UnauthorizedError extends BaseError {

  statusCode = 401;

}
