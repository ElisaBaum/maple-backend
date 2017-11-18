import {BadRequestError} from "../../common/BadRequestError";

export class MaxCompanionCountExceededError extends BadRequestError {

  message = 'Es kann keine weitere Begleitung hinzugefügt werden.';

}
