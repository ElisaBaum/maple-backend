import {Request} from 'express';
import {Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, QueryParam, Req} from 'routing-controllers';
import {Injectable} from 'injection-js';
import {CreateGalleryItemDTO} from '../gallery-items/create-gallery-item.dto';
import {NotFoundError} from '../../common/errors/not-found.error';
import GallerySection from './gallery-section.model';
import {ForbiddenError} from '../../common/errors/forbidden.error';
import {GalleryItemService} from '../gallery-items/gallery-item.service';

@Injectable()
@JsonController()
export class UserGallerySectionController {

  constructor(private galleryItemService: GalleryItemService) {

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
    return this.galleryItemService.getGalleryItemsBySectionId(req.user, gallerySectionId, limit, offset);
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
  async updateGallerySectionPartially(@Req() req: Request,
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
  async deleteGallerySection(@Req() req: Request,
                             @Param('id') gallerySectionId: number) {
    const gallerySection = await GallerySection.findById(gallerySectionId);
    if (!gallerySection) {
      throw new NotFoundError(`GallerySection with ID "${gallerySectionId}" not found`);
    }
    if (gallerySection.partyId !== req.user.partyId) {
      throw new ForbiddenError(`You're not allowed to remove GallerySection with ID "${gallerySectionId}"`);
    }
    await this.galleryItemService.deleteGalleryItemsBySection(req.user, gallerySection);
    await gallerySection.destroy();
  }

}
