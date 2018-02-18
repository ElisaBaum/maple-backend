import {Inject} from "di-typescript";
import {Get, JsonController} from "routing-controllers";
import {MAX_MUSIC_REQUESTS_PER_USER} from "./MusicRequestsService";

@Inject
@JsonController()
export class MusicRequestsController {

  @Get('/music-requests/limit')
  getMusicRequestArtists() {
    return {limit: MAX_MUSIC_REQUESTS_PER_USER};
  }

}
