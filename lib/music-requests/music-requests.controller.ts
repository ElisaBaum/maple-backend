import {Injectable} from "injection-js";
import {Get, JsonController} from "routing-controllers";
import {MAX_MUSIC_REQUESTS_PER_USER} from "./music-requests.service";

@Injectable()
@JsonController()
export class MusicRequestsController {

  @Get('/music-requests/limit')
  getMusicRequestArtists() {
    return {limit: MAX_MUSIC_REQUESTS_PER_USER};
  }

}
