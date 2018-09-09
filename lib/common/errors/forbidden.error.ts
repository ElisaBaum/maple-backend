import BaseError from "@etianen/base-error";

export class ForbiddenError extends BaseError {

  statusCode = 403;
}
