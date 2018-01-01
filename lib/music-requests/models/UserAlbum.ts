import {Column, ForeignKey, Model} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {Album} from "./Album";

export class UserAlbum extends Model<UserAlbum> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Album)
  @Column
  albumId: number;

}
