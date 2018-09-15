import {Request, Response} from 'express';
import {Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, QueryParam, Req, Res} from 'routing-controllers';
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
                        @Res() res: Response,
                        @QueryParam('limit') limit: number,
                        @QueryParam('offset') offset: number,
                        @Param('id') gallerySectionId: number) {
    limit = limit || 25;
    offset = offset || 0;
    const {galleryItems, totalItems}  = await this.galleryItemService.getGalleryItemsBySectionId(req.user, gallerySectionId, limit, offset);
    res.setHeader('X-Total-Count', totalItems);
    return galleryItems;
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
    const gallerySection = await this.validateGallerySection(gallerySectionId, req);
    await this.galleryItemService.deleteGalleryItemsBySection(req.user, gallerySection);
    await gallerySection.destroy();
  }

  @Get('/users/me/gallery-sections/:id/gallery-item-s3-policy')
  async getGalleryItemS3Policy(@Req() req: Request,
                               @Param('id') gallerySectionId: number,
                               @QueryParam('key') key: string,
                               @QueryParam('contentType') contentType: string) {

    const gallerySection = await this.validateGallerySection(gallerySectionId, req);
    return this.galleryItemService.getGalleryItemS3Policy(gallerySection, key, contentType);
  }

  private async validateGallerySection(gallerySectionId: number, req: Request) {
    const gallerySection = await GallerySection.findById(gallerySectionId);
    if (!gallerySection) {
      throw new NotFoundError(`GallerySection with ID "${gallerySectionId}" not found`);
    }
    if (gallerySection.partyId !== req.user.partyId) {
      throw new ForbiddenError(`You're not allowed to remove GallerySection with ID "${gallerySectionId}"`);
    }
    return gallerySection;
  }

}
