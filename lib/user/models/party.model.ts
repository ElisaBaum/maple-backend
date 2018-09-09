import {Table, Column, Model, HasMany, DefaultScope} from 'sequelize-typescript';
import {User} from "./user.model";

@DefaultScope({attributes: ['id', 'maxPersonCount']})
@Table
export class Party extends Model<Party> {

  @Column
  code: string;

  @Column
  maxPersonCount: number;

  @HasMany(() => User)
  users: User[];

}
export default Party;
