import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {RequestedArtist} from "./RequestedArtist";

@Table
export class UserRequestedArtist extends Model<UserRequestedArtist> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => RequestedArtist)
  @Column
  artistId: number;

}
