import {Table, Model, Column, PrimaryKey, DataType} from "sequelize-typescript";

@Table
export class DynamicContent<T> extends Model<DynamicContent<T>> {

  @PrimaryKey
  @Column
  key: string;

  @Column(DataType.JSON)
  content: T;

}
