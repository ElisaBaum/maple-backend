import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {RequestedAlbum} from "./RequestedAlbum";

@Table
export class UserRequestedAlbum extends Model<UserRequestedAlbum> {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  userId: number;

  @ForeignKey(() => RequestedAlbum)
  @PrimaryKey
  @Column
  albumId: number;

}
