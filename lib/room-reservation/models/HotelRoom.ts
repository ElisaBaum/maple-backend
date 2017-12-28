import {Table, Model, Column, DefaultScope} from 'sequelize-typescript';

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
}
