import {Injectable} from 'injection-js';
import GalleryItem from './gallery-item.model';
import {S3Service} from '../../common/s3.service';
import {GALLERY_FOLDER, ORIGINAL_FOLDER, RESIZED_FOLDER} from '../shared/gallery.constants';
import uuid = require('uuid');
import {Sequelize} from 'sequelize-typescript';
import {GalleryItemAccess} from './gallery-item-access.enum';
import GallerySection from '../gallery-sections/gallery-section.model';

@Injectable()
export class GalleryItemService {

  constructor(private s3Service: S3Service) {

  }

  async getGalleryItemsBySectionId(user,
                                   sectionId: number,
                                   limit: number,
                                   offset: number) {
    const {rows: galleryItems, count} = await GalleryItem.findAndCountAll({
      where: {
        partyId: user.partyId,
        sectionId,
        [Sequelize.Op.or]: [
          {access: GalleryItemAccess.All},
          Sequelize.and(
            {access: GalleryItemAccess.Restricted},
            Sequelize.literal(`(
    		        SELECT COUNT(*) 
                FROM "GalleryItemRestrictedAccess"
                WHERE "galleryItemId" = "id" AND "userId" = ${user.id}
                ) > 0`)
          ),
        ],
      },
      limit,
      offset,
    });
    const preparedItems = await Promise.all(galleryItems
      .map(async (galleryItem) => {
        const [originalUrl, resizedUrl] = await Promise.all([
          this.s3Service.getSignedUrl(galleryItem.key),
          this.s3Service.getSignedUrl(galleryItem.resizedKey),
        ]);
        galleryItem.originalUrl = originalUrl;
        galleryItem.resizedUrl = resizedUrl;
        return galleryItem;
      })
    );
    return {galleryItems: preparedItems, totalItems: count};
  }

  async deleteGalleryItemsBySection(user, gallerySection: GallerySection) {
    const limit = 50;
    let offset = 0;
    let totalCount;

    while (totalCount === undefined || offset < totalCount) {
      const {rows: galleryItems, count} = await GalleryItem.findAndCountAll({
        where: {
          partyId: user.partyId,
          sectionId: gallerySection.id,
        },
        limit,
        offset,
      });
      await Promise.all(galleryItems.map(galleryItem => this.deleteGalleryItem(galleryItem)));
      offset = offset + limit;
      totalCount = count;
    }
  }

  async deleteGalleryItem(galleryItem: GalleryItem) {
    await Promise.all([
      this.s3Service.deleteObject(galleryItem.key),
      this.s3Service.deleteObject(galleryItem.resizedKey),
    ]);
    await galleryItem.destroy();
  }

  getGalleryItemS3Policy(gallerySection: GallerySection, key: string, contentType: string) {
    const acl = 'private';
    const prefix = uuid();
    const normalizedKey = key.replace(/\s/g, '_');
    const getPath = folder => `${GALLERY_FOLDER}/${folder}/${gallerySection.id}/${prefix}-${normalizedKey}`;
    const resizedKey = getPath(RESIZED_FOLDER);
    const originalKey = getPath(ORIGINAL_FOLDER);
    const policy = this.s3Service.getUploadPolicy({acl, key: originalKey, contentType});
    return {...policy, resizedKey};
  }

}
