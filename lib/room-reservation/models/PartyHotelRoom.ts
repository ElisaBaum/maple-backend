import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {HotelRoom} from "./HotelRoom";

@Table
export class PartyHotelRoom extends Model<PartyHotelRoom> {

  @PrimaryKey
  @Column
  partyId: number;

  @ForeignKey(() => HotelRoom)
  @Column
  hotelRoomId: number;

  @BelongsTo(() => HotelRoom)
  hotelRoom: HotelRoom;

}
