import BaseError from "@etianen/base-error";

export class NotFoundError extends BaseError {

  statusCode = 404;

}
