import {Delete, Get, JsonController, OnUndefined, Param, Post, Req} from "routing-controllers";
import {Injectable} from "injection-js";
import {Request} from "express";
import {HotelRoomService} from "./hotel-room.service";

@Injectable()
@JsonController()
export class UserHotelRoomController {

  constructor(protected hotelRoomService: HotelRoomService) {
  }

  @Get('/users/me/hotel-rooms/reserved')
  getReservedHotelRoom(@Req() req: Request) {
    const {partyId} = req.user;
    return this.hotelRoomService.getReservedHotelRoom(partyId);
  }

  @OnUndefined(200)
  @Delete('/users/me/hotel-rooms/reserved')
  deleteHotelRoomReservation(@Req() req: Request) {
    const {partyId} = req.user;
    return this.hotelRoomService.deleteHotelRoomReservation(partyId);
  }

  @Post('/users/me/hotel-rooms/:hotelRoomId')
  reserveHotelRoom(@Req() req: Request, @Param('hotelRoomId') hotelRoomId: number) {
    const {partyId} = req.user;
    return this.hotelRoomService.reserveHotelRoom(partyId, hotelRoomId);
  }

}
