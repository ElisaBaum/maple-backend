import {Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import Party from '../../user/models/party.model';

@Table
export class GallerySection extends Model<GallerySection> {

  @Column({
    unique: 'name_party'
  })
  name: string;

  @ForeignKey(() => Party)
  @Column({
    unique: 'name_party'
  })
  partyId: number;

}
export default GallerySection;
