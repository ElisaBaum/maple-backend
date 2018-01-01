import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Artist} from "./Artist";

@Table
export class Song extends Model<Song> {

  @Column
  name: string;

  @Column
  url: string;

  @ForeignKey(() => Artist)
  @Column
  artistId: number;

  @BelongsTo(() => Artist)
  artist: Artist;
}
