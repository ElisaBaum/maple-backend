import {Table, Column, Model, HasMany} from 'sequelize-typescript';
import {User} from "./User";

@Table
export class Party extends Model<Party> {

  @Column
  code: string;

  @Column
  maxPersonCount: number;

  @HasMany(() => User)
  users: User[];

}