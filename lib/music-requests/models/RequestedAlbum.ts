import {BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {RequestedArtist} from "./RequestedArtist";
import {User} from "../../user/models/User";
import {UserRequestedAlbum} from "./UserRequestedAlbum";

@Table
export class RequestedAlbum extends Model<RequestedAlbum> {

  @Column
  name: string;

  @Column
  url: string;

  @Column
  imageUrl: string;

  @ForeignKey(() => RequestedArtist)
  @Column
  artistId: number;

  @BelongsTo(() => RequestedArtist)
  artist: RequestedArtist;

  @BelongsToMany(() => User, () => UserRequestedAlbum)
  users: User[];

}
