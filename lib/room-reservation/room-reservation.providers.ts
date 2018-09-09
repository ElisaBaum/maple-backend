import {Provider} from 'injection-js';
import {HotelRoomController} from './hotel-room.controller';
import {HotelRoomService} from './hotel-room.service';
import {UserHotelRoomController} from './user-hotel-room.controller';

export const ROOM_RESERVATION_PROVIDERS: Provider[] = [
  HotelRoomController,
  HotelRoomService,
  UserHotelRoomController,
];
