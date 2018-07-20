import {Request} from 'express';
import {Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, QueryParam, Req} from 'routing-controllers';
import {Injectable} from 'injection-js';
import {CreateGalleryItemDTO} from '../gallery-items/create-gallery-item.dto';
import {NotFoundError} from '../../common/errors/not-found.error';
import GallerySection from './gallery-section.model';
import GalleryItem from '../gallery-items/gallery-item.model';
import {GalleryItemAccess} from '../gallery-items/gallery-item-access.enum';
import {Sequelize} from 'sequelize-typescript';
import {ForbiddenError} from '../../common/errors/forbidden.error';
import {S3Service} from '../../common/s3.service';

@Injectable()
@JsonController()
export class UserGallerySectionController {

  constructor(private s3Service: S3Service) {

  }

  @Get('/users/me/gallery-sections')
  getGallerySection(@Req() req: Request) {
    return GallerySection.findAll({
      where: {partyId: req.user.partyId},
    });
  }

  @Get('/users/me/gallery-sections/:id/gallery-items')
  async getGalleryItems(@Req() req: Request,
                        @QueryParam('limit') limit: number,
                        @QueryParam('offset') offset: number,
                        @Param('id') gallerySectionId: number) {
    limit = limit || 25;
    offset = offset || 0;
    return Promise.all(
      (await GalleryItem.findAll({
        where: {
          partyId: req.user.partyId,
          sectionId: gallerySectionId,
          [Sequelize.Op.or]: [
            {access: GalleryItemAccess.All},
            Sequelize.and(
              {access: GalleryItemAccess.Restricted},
              Sequelize.literal(`(
    		        SELECT COUNT(*) 
                FROM "GalleryItemRestrictedAccess"
                WHERE "galleryItemId" = "id" AND "userId" = ${req.user.id}
                ) > 0`)
            ),
          ],
        },
        limit,
        offset,
      }))
        .map(async (galleryItem) => {
          galleryItem.originalUrl = await this.s3Service.getSignedUrl(galleryItem.key);
          galleryItem.resizedUrl = await this.s3Service.getSignedUrl(galleryItem.resizedKey);
          return galleryItem;
        })
    );
  }

  @Post('/users/me/gallery-sections')
  createGallerySection(@Req() req: Request,
                       @Body() section: any) {
    return GallerySection.create({
      ...section,
      partyId: req.user.partyId,
    });
  }

  @OnUndefined(200)
  @Patch('/users/me/gallery-sections/:id')
  async updateGalleryItemPartially(@Req() req: Request,
                                   @Param('id') gallerySectionId: number,
                                   @Body() item: Partial<CreateGalleryItemDTO>) {
    const gallerySection = await GallerySection.findById(gallerySectionId);
    if (!gallerySection) {
      throw new NotFoundError(`GallerySection with ID "${gallerySectionId}" not found`);
    }
    if (gallerySection.partyId !== req.user.partyId) {
      throw new ForbiddenError(`You're not allowed to update GallerySection with ID "${gallerySectionId}"`);
    }
    await gallerySection.update(item, {fields: ['name']});
  }

  @OnUndefined(200)
  @Delete('/users/me/gallery-sections/:id')
  async deleteGalleryItem(@Req() req: Request,
                          @Param('id') gallerySectionId: number) {
    const gallerySection = await GallerySection.findById(gallerySectionId);
    if (!gallerySection) {
      throw new NotFoundError(`GallerySection with ID "${gallerySectionId}" not found`);
    }
    if (gallerySection.partyId !== req.user.partyId) {
      throw new ForbiddenError(`You're not allowed to remove GallerySection with ID "${gallerySectionId}"`);
    }
    await gallerySection.destroy();
  }

}
