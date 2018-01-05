import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {RequestedArtist} from "./RequestedArtist";

@Table
export class RequestedSong extends Model<RequestedSong> {

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
