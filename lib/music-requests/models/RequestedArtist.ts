import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {RequestedAlbum} from "./RequestedAlbum";
import {RequestedSong} from "./RequestedSong";
import {UserRequestedArtist} from "./UserRequestedArtist";
import {User} from "../../user/models/User";

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
