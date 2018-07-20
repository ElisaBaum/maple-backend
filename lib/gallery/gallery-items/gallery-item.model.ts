import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import Party from '../../user/models/party.model';
import {GalleryItemAccess} from './gallery-item-access.enum';
import GallerySection from '../gallery-sections/gallery-section.model';
import User from '../../user/models/user.model';
import GalleryItemRestrictedAccess from './gallery-item-restricted-access.model';

@Table
export class GalleryItem extends Model<GalleryItem> {

  @Column
  key: string;

  @Column
  resizedKey: string;

  @Column(DataType.VIRTUAL)
  originalUrl: string;

  @Column(DataType.VIRTUAL)
  resizedUrl: string;

  @Column
  type: string;

  @ForeignKey(() => GallerySection)
  @Column
  sectionId: number;

  @ForeignKey(() => Party)
  @Column
  partyId: number;

  @Column
  lastModifiedAt: Date;

  @Column
  access: GalleryItemAccess;

  @BelongsToMany(() => User, () => GalleryItemRestrictedAccess)
  usersThatHaveAccess: User[];

  @BelongsTo(() => Party)
  party: Party;

}
export default GalleryItem;
