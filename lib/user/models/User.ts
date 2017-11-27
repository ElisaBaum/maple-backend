import {Table, Column, Model, BelongsTo, ForeignKey, DataType} from 'sequelize-typescript';
import {Party} from "./Party";
import {Relation} from "./Relation";

@Table
export class User extends Model<User> {

  @Column({unique: 'userPartyIndex'})
  name: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  accepted: boolean;

  @Column
  hashedPassword: string;

  @Column
  avatarUrl: string;

  @Column(DataType.JSON)
  scopes: string[];

  @Column
  visibleForOthers: boolean;

  @ForeignKey(() => Party)
  @Column({unique: 'userPartyIndex'})
  partyId: number;

  @BelongsTo(() => Party)
  party: Party;

  @ForeignKey(() => Relation)
  @Column
  relationKey: string;

  @BelongsTo(() => Relation)
  relation: Relation;

}
