import {Column, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript';
import User from '../../user/models/user.model';
import GalleryItem from './gallery-item.model';

@Table
export class GalleryItemRestrictedAccess extends Model<GalleryItemRestrictedAccess> {

  @PrimaryKey
  @ForeignKey(() => GalleryItem)
  @Column
  galleryItemId: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  userId: number;

}
export default GalleryItemRestrictedAccess;
