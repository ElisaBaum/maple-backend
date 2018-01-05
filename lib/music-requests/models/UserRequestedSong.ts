import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {RequestedSong} from "./RequestedSong";

@Table
export class UserRequestedSong extends Model<UserRequestedSong> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => RequestedSong)
  @Column
  songId: number;

}
