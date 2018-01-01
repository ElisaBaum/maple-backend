import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {Song} from "./Song";

@Table
export class UserSong extends Model<UserSong> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Song)
  @Column
  songId: number;

}
