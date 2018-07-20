import {BelongsTo, Column, DefaultScope, ForeignKey, Model, Table} from 'sequelize-typescript';
import Party from '../../user/models/party.model';
import User from '../../user/models/user.model';

@DefaultScope({
  include: [{
    model: () => Party,
    include: [() => User]
  }],
  order: [
    ['id', 'DESC']
  ]
})
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

  @BelongsTo(() => Party)
  party: Party;

}
export default GallerySection;
