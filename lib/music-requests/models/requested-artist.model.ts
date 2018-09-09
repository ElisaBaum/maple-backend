import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {RequestedAlbum} from "./requested-album.model";
import {RequestedSong} from "./requested-song.model";
import {UserRequestedArtist} from "./user-requested-artist.model";
import {User} from "../../user/models/user.model";

@Table
export class RequestedArtist extends Model<RequestedArtist> {

  @Column
  name: string;

  @Column
  url: string;

  @Column
  imageUrl: string;

  @HasMany(() => RequestedAlbum)
  albums: RequestedAlbum[];

  @HasMany(() => RequestedSong)
  songs: RequestedSong[];

  @BelongsToMany(() => User, () => UserRequestedArtist)
  users: User[];
}
export default RequestedArtist;
