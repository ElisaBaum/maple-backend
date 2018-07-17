import {Request} from 'express';
import {Body, Delete, Get, JsonController, Param, Patch, Post, Req} from 'routing-controllers';
import {Injectable} from 'injection-js';
import {CreateGalleryItemDTO} from '../gallery-items/create-gallery-item.dto';
import {NotFoundError} from '../../common/errors/not-found.error';
import GallerySection from './gallery-section.model';
import GalleryItem from '../gallery-items/gallery-item.model';
import {GalleryItemAccess} from '../gallery-items/gallery-item-access.enum';
import {Sequelize} from 'sequelize-typescript';
import User from '../../user/models/user.model';

@Injectable()
@JsonController()
export class UserGallerySectionController {

  @Get('/users/me/gallery-sections')
  getGallerySection(@Req() req: Request) {
    return GallerySection.findAll({
      where: {partyId: req.user.partyId},
    });
  }

  @Get('/gallery-sections/:id/gallery-items')
  getGalleryItems(@Req() req: Request, @Param('id') gallerySectionId: number) {
    return GalleryItem.findAll({
      include: [{
        model: User,
        where: {id: req.user.id},
        required: false,
      }],
      where: {
        partyId: req.user.partyId,
        sectionId: gallerySectionId,
        [Sequelize.Op.or]: [
          {access: GalleryItemAccess.All},
          {
            access: GalleryItemAccess.Restricted,
            ['$usersThatHaveAccess.id$']: {
              [Sequelize.Op.not]: null,
            }
          },
        ],
      }
    });
  }

  @Post('/users/me/gallery-sections')
  createGallerySection(@Req() req: Request,
                       @Body() section: any) {
    return GallerySection.create({
      ...section,
      partyId: req.user.partyId,
    });
  }

  @Patch('/users/me/gallery-sections/:id')
  async updateGalleryItemPartially(@Req() req: Request,
                                   @Param('id') gallerySectionId: number,
                                   @Body() item: Partial<CreateGalleryItemDTO>) {
    const gallerySection = await GallerySection.findById(gallerySectionId, {where: {partyId: req.user.partyId}});
    if (!gallerySection) {
      throw new NotFoundError(`GallerySection with ID "${gallerySectionId}" not found`);
    }
    await gallerySection.update(item, {fields: ['name']});
  }

  @Delete('/users/me/gallery-sections/:id')
  async deleteGalleryItem(@Req() req: Request,
                          @Param('id') gallerySectionId: number) {
    const gallerySection = await GallerySection.findById(gallerySectionId, {where: {partyId: req.user.partyId}});
    if (!gallerySection) {
      throw new NotFoundError(`GallerySection with ID "${gallerySectionId}" not found`);
    }
    await gallerySection.destroy();
  }

}
