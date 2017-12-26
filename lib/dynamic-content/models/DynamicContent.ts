import {Table, Model, Column, PrimaryKey, DataType} from "sequelize-typescript";

export type Resources = { [key: string]: string | string[] };

@Table
export class DynamicContent<T> extends Model<DynamicContent<T>> {

  @PrimaryKey
  @Column
  key: string;

  @Column(DataType.JSON)
  content: T;

  @Column(DataType.JSON)
  resources: Resources;

}
