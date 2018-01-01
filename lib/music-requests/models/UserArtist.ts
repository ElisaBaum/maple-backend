import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {Artist} from "./Artist";

@Table
export class UserArtist extends Model<UserArtist> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Artist)
  @Column
  artistId: number;

}
