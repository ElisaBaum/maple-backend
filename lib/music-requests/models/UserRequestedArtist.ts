import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {RequestedArtist} from "./RequestedArtist";

@Table
export class UserRequestedArtist extends Model<UserRequestedArtist> {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  userId: number;

  @ForeignKey(() => RequestedArtist)
  @PrimaryKey
  @Column
  artistId: number;

}
