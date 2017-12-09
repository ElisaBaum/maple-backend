import {Table, Column, Model, HasMany, DefaultScope} from 'sequelize-typescript';
import {User} from "./User";

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
