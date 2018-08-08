import {Request} from 'express';
import {Body, Delete, JsonController, OnUndefined, Param, Patch, Post, Req} from 'routing-controllers';
import {Injectable} from 'injection-js';
import {CreateGalleryItemDTO} from './create-gallery-item.dto';
import GalleryItem from './gallery-item.model';
import {NotFoundError} from '../../common/errors/not-found.error';
import {ForbiddenError} from '../../common/errors/forbidden.error';
import {GalleryItemService} from './gallery-item.service';

@Injectable()
@JsonController()
export class UserGalleryItemController {

  constructor(private galleryItemService: GalleryItemService) {

  }

  @Post('/users/me/gallery-items')
  createGalleryItem(@Req() req: Request,
                    @Body() item: CreateGalleryItemDTO) {
    return GalleryItem.create({
      ...item,
      partyId: req.user.partyId,
    });
  }

  @OnUndefined(200)
  @Patch('/users/me/gallery-items/:id')
  async updateGalleryItemPartially(@Req() req: Request,
                                   @Param('id') galleryItemId: number,
                                   @Body() item: Partial<CreateGalleryItemDTO>) {
    const galleryItem = await GalleryItem.findById(galleryItemId);
    if (!galleryItem) {
      throw new NotFoundError(`GalleryItem with ID "${galleryItemId}" not found`);
    }
    if (galleryItem.partyId !== req.user.partyId) {
      throw new ForbiddenError(`You're not allowed to update GalleryItem with ID "${galleryItemId}"`);
    }
    await galleryItem.update(item, {fields: ['section', 'access']});
  }

  @OnUndefined(200)
  @Delete('/users/me/gallery-items/:id')
  async deleteGalleryItem(@Req() req: Request,
                          @Param('id') galleryItemId: number) {
    const galleryItem = await GalleryItem.findById(galleryItemId);
    if (!galleryItem) {
      throw new NotFoundError(`GalleryItem with ID "${galleryItemId}" not found`);
    }
    if (galleryItem.partyId !== req.user.partyId) {
      throw new ForbiddenError(`You're not allowed to remove GalleryItem with ID "${galleryItemId}"`);
    }
    await this.galleryItemService.deleteGalleryItem(galleryItem);
  }

}
