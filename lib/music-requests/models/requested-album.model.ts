import {BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {RequestedArtist} from "./requested-artist.model";
import {User} from "../../user/models/user.model";
import {UserRequestedAlbum} from "./user-requested-album.model";

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
export default RequestedAlbum;
