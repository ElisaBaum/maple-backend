import {NotFoundError} from "../../common/NotFoundError";

export class UserNotFoundError extends NotFoundError {

  message = 'Der Nutzer konnte nicht gefunden werden.';

}
