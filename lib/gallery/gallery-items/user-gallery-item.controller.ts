import {Request} from 'express';
import {Body, Delete, Get, JsonController, Param, Patch, Post, QueryParam, Req} from 'routing-controllers';
import {Injectable} from 'injection-js';
import {CreateGalleryItemDTO} from './create-gallery-item.dto';
import GalleryItem from './gallery-item.model';
import {NotFoundError} from '../../common/errors/not-found.error';
import uuid = require('uuid');
import {S3Service} from '../../common/s3.service';

@Injectable()
@JsonController()
export class UserGalleryItemController {

  constructor(private s3Service: S3Service) {

  }

  @Post('/users/me/gallery-items')
  createGalleryItem(@Req() req: Request,
                    @Body() item: CreateGalleryItemDTO) {
    return GalleryItem.create({
      ...item,
      partyId: req.user.partyId,
    });
  }

  @Patch('/users/me/gallery-items/:id')
  async updateGalleryItemPartially(@Req() req: Request,
                                   @Param('id') galleryItemId: number,
                                   @Body() item: Partial<CreateGalleryItemDTO>) {
    const galleryItem = await GalleryItem.findById(galleryItemId, {where: {partyId: req.user.partyId}});
    if (!galleryItem) {
      throw new NotFoundError(`GalleryItem with ID "${galleryItemId}" not found`);
    }
    await galleryItem.update(item, {fields: ['section', 'access']});
  }

  @Delete('/users/me/gallery-items/:id')
  async deleteGalleryItem(@Req() req: Request,
                          @Param('id') galleryItemId: number) {
    const galleryItem = await GalleryItem.findById(galleryItemId, {where: {partyId: req.user.partyId}});
    if (!galleryItem) {
      throw new NotFoundError(`GalleryItem with ID "${galleryItemId}" not found`);
    }
    await this.s3Service.deleteObject(galleryItem.key);
    await galleryItem.destroy();
  }

  @Get('/users/me/gallery-item-s3-policy')
  getGalleryItemS3Policy(@Req() req: Request,
                         @QueryParam('key') key: string,
                         @QueryParam('content-type') contentType: string) {
    const GALLERY_FOLDER = 'gallery';
    const acl = 'private';
    key = `${GALLERY_FOLDER}/${req.user.partyId}/${uuid()}-${key}`;
    return this.s3Service.getUploadPolicy({
      acl,
      key,
      contentType,
    });
  }


}
