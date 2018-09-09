import {BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {RequestedArtist} from "./requested-artist.model";
import {User} from "../../user/models/user.model";
import {UserRequestedSong} from "./user-requested-song.model";

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
export default RequestedSong;
