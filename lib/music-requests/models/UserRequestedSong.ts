import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {RequestedSong} from "./RequestedSong";

@Table
export class UserRequestedSong extends Model<UserRequestedSong> {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  userId: number;

  @ForeignKey(() => RequestedSong)
  @PrimaryKey
  @Column
  songId: number;

}
