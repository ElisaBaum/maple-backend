import {Table, Model, Column, DefaultScope, BelongsToMany} from 'sequelize-typescript';
import {Party} from "../../user/models/Party";
import {PartyHotelRoom} from "./PartyHotelRoom";

@DefaultScope({
  order: [
    ['id', 'ASC']
  ]
})
@Table
export class HotelRoom extends Model<HotelRoom> {

  @Column
  description: string;

  @Column
  price: number;

  @Column
  maxPersonCount: number;

  @BelongsToMany(() => Party, () => PartyHotelRoom)
  parties: Party[];
}
