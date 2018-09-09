import {HotelRoom} from "./models/hotel-room.model";
import {PartyHotelRoom} from "./models/party-hotel-room.model";
import {HotelRoomNotFoundError} from "./errors/hotel-room-not-found.error";

export class HotelRoomService {

  getHotelRooms() {
    return HotelRoom.findAll();
  }

  async getReservedHotelRoom(partyId: number) {
    const reservedRoom = await PartyHotelRoom.find<PartyHotelRoom>({
      where: {
        partyId
      },
      include: [HotelRoom]
    });

    if (reservedRoom) {
      return reservedRoom.hotelRoom;
    }

    throw new HotelRoomNotFoundError();
  }

  async reserveHotelRoom(partyId: number, hotelRoomId: number) {
    const hotelRoom = await HotelRoom.findByPrimary(hotelRoomId);
    if (hotelRoom) {
      await PartyHotelRoom.upsert({hotelRoomId, partyId});
      return hotelRoom;
    }

    throw new HotelRoomNotFoundError();
  }

  async deleteHotelRoomReservation(partyId) {
    const affectedRows = await PartyHotelRoom.destroy({
      where: {
        partyId
      }
    });

    if (!affectedRows) {
      throw new HotelRoomNotFoundError();
    }
  }

}
