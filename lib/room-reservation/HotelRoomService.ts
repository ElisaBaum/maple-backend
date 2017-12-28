import {HotelRoom} from "./models/HotelRoom";
import {PartyHotelRoom} from "./models/PartyHotelRoom";
import {HotelRoomNotFoundError} from "./errors/HotelRoomNotFoundError";

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
    } else {
      throw new HotelRoomNotFoundError();
    }
  }

  async deleteHotelRoomReservation(partyId) {
    await PartyHotelRoom.destroy({
      where: {
        partyId
      }
    });
  }

}
