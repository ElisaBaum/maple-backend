import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {Album} from "./Album";
import {Song} from "./Song";

@Table
export class Artist extends Model<Artist> {

  @Column
  name: string;

  @Column
  url: string;

  @Column
  imageUrl: string;

  @HasMany(() => Album)
  albums: Album[];

  @HasMany(() => Song)
  songs: Song[];

}
