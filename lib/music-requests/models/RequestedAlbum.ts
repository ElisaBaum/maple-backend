import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {RequestedArtist} from "./RequestedArtist";

@Table
export class RequestedAlbum extends Model<RequestedAlbum> {

  @Column
  name: string;

  @Column
  url: string;

  @ForeignKey(() => RequestedArtist)
  @Column
  artistId: number;

  @BelongsTo(() => RequestedArtist)
  artist: RequestedArtist;

}
