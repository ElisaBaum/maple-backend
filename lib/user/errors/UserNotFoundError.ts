import {NotFoundError} from "../../common/errors/NotFoundError";

export class UserNotFoundError extends NotFoundError {

  message = 'Der Nutzer konnte nicht gefunden werden.';

}
