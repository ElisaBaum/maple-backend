import {NotFoundError} from "../../common/errors/not-found.error";

export class UserNotFoundError extends NotFoundError {

  message = 'Der Nutzer konnte nicht gefunden werden.';

}
