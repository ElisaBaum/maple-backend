import {BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {RequestedArtist} from "./RequestedArtist";
import {User} from "../../user/models/User";
import {UserRequestedSong} from "./UserRequestedSong";

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

  @BelongsToMany(() => User, () => UserRequestedSong)
  users: User[];
}
