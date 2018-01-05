import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {RequestedAlbum} from "./RequestedAlbum";
import {RequestedSong} from "./RequestedSong";

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

}
