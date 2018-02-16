import {BadRequestError} from "../../common/errors/BadRequestError";

export class MaxMusicRequestsReachedError extends BadRequestError {
  message = 'Die maximale Anzahl an Musikwünschen ist erreicht.';
}
