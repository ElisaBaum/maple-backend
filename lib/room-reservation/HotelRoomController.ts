import {Get, JsonController} from "routing-controllers";
import {Inject} from "di-typescript";
import {HotelRoomService} from "./HotelRoomService";

@Inject
@JsonController()
export class HotelRoomController {

  constructor(protected hotelRoomService: HotelRoomService) {
  }

  @Get('/hotel-rooms')
  getHotelRooms() {
    return this.hotelRoomService.getHotelRooms();
  }

}
