import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../user/models/User";
import {RequestedAlbum} from "./RequestedAlbum";

@Table
export class UserRequestedAlbum extends Model<UserRequestedAlbum> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => RequestedAlbum)
  @Column
  albumId: number;

}
