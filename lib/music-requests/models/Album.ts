import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Artist} from "./Artist";

@Table
export class Album extends Model<Album> {

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
