import {Get, JsonController, OnNull, Param, Req} from 'routing-controllers';
import {Injectable} from 'injection-js';
import GallerySection from './gallery-section.model';
import {Request} from 'express';
import {GallerySectionService} from './gallery-section.service';
import {NotFoundError} from '../../common/errors/not-found.error';

@Injectable()
@JsonController()
export class GallerySectionController {

  constructor(private gallerySectionService: GallerySectionService) {

  }


  @Get('/gallery-sections')
  getGallerySections() {
    return GallerySection.findAll();
  }

  @OnNull(404)
  @Get('/gallery-sections/:id')
  getGallerySection(@Param('id') gallerySectionId: number) {
    return GallerySection.findById(gallerySectionId);
  }

  @Get('/gallery-sections/:id/zipped')
  async getZippedGallerySection(@Req() req: Request,
                                @Param('id') gallerySectionId: number) {
    const gallerySection = await this.validateGallerySection(gallerySectionId);
    return this.gallerySectionService.getZippedGallerySection(gallerySection);
  }

  private async validateGallerySection(gallerySectionId: number) {
    const gallerySection = await GallerySection.findById(gallerySectionId);
    if (!gallerySection) {
      throw new NotFoundError(`GallerySection with ID "${gallerySectionId}" not found`);
    }
    return gallerySection;
  }

}
