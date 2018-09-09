import {BadRequestError} from "../../common/errors/bad-request.error";

export class MaxCompanionCountExceededError extends BadRequestError {

  message = 'Es kann keine weitere Begleitung hinzugefügt werden.';

}
