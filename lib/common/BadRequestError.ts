import BaseError from "@etianen/base-error";

export class BadRequestError extends BaseError {

  statusCode = 400;

}
