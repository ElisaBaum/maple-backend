import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {User} from "../../user/models/user.model";
import {RequestedAlbum} from "./requested-album.model";

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
export default UserRequestedAlbum;
