import {Request} from 'express';
import {Body, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, QueryParam, Req} from 'routing-controllers';
import {Injectable} from 'injection-js';
import {CreateGalleryItemDTO} from './create-gallery-item.dto';
import GalleryItem from './gallery-item.model';
import {NotFoundError} from '../../common/errors/not-found.error';
import uuid = require('uuid');
import {S3Service} from '../../common/s3.service';
import {ForbiddenError} from '../../common/errors/forbidden.error';
import {GALLERY_FOLDER, ORIGINAL_FOLDER, RESIZED_FOLDER} from '../shared/gallery.constants';

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
    await this.s3Service.deleteObject(galleryItem.key);
    await galleryItem.destroy();
  }

  @Get('/users/me/gallery-item-s3-policy')
  getGalleryItemS3Policy(@Req() req: Request,
                         @QueryParam('key') key: string,
                         @QueryParam('contentType') contentType: string) {
    const acl = 'private';
    const galleryPartyPath = `${GALLERY_FOLDER}/${req.user.partyId}`;
    const objectName = `${uuid()}-${key}`;
    const resizedKey = `${galleryPartyPath}/${RESIZED_FOLDER}/${objectName}`;
    key = `${galleryPartyPath}/${ORIGINAL_FOLDER}/${objectName}`;
    const policy =  this.s3Service.getUploadPolicy({acl, key, contentType});
    return {...policy, resizedKey};
  }


}
