import {Column, ForeignKey, Model} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {Song} from "./Song";

export class UserSong extends Model<UserSong> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Song)
  @Column
  songId: number;

}
