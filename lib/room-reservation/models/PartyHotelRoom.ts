import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {HotelRoom} from "./HotelRoom";
import {Party} from "../../user/models/Party";

@Table
export class PartyHotelRoom extends Model<PartyHotelRoom> {

  @PrimaryKey
  @ForeignKey(() => Party)
  @Column
  partyId: number;

  @ForeignKey(() => HotelRoom)
  @Column
  hotelRoomId: number;

  @BelongsTo(() => HotelRoom)
  hotelRoom: HotelRoom;

}
