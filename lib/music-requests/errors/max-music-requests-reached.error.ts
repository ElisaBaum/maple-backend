import {BadRequestError} from "../../common/errors/bad-request.error";

export class MaxMusicRequestsReachedError extends BadRequestError {
  message = 'Die maximale Anzahl an Musikwünschen ist erreicht.';
}
