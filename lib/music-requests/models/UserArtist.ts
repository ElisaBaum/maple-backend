import {Column, ForeignKey, Model} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {Artist} from "./Artist";

export class UserArtist extends Model<UserArtist> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Artist)
  @Column
  artistId: number;

}
