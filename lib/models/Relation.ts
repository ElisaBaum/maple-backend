import {Table, Column, Model, PrimaryKey} from 'sequelize-typescript';

@Table
export class Relation extends Model<Relation> {

  @PrimaryKey
  @Column
  key: string;

  @Column
  name: string;

}