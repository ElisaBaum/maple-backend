import {Get, JsonController} from "routing-controllers";
import {Injectable} from "injection-js";
import {HotelRoomService} from "./hotel-room.service";

@Injectable()
@JsonController()
export class HotelRoomController {

  constructor(protected hotelRoomService: HotelRoomService) {
  }

  @Get('/hotel-rooms')
  getHotelRooms() {
    return this.hotelRoomService.getHotelRooms();
  }

}
