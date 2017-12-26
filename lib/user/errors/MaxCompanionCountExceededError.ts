import {BadRequestError} from "../../common/errors/BadRequestError";

export class MaxCompanionCountExceededError extends BadRequestError {

  message = 'Es kann keine weitere Begleitung hinzugefügt werden.';

}
