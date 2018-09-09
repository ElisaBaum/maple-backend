import {Get, JsonController, OnNull, Param} from 'routing-controllers';
import {Injectable} from 'injection-js';
import GallerySection from './gallery-section.model';

@Injectable()
@JsonController()
export class GallerySectionController {

  @Get('/gallery-sections')
  getGallerySections() {
    return GallerySection.findAll();
  }

  @OnNull(404)
  @Get('/gallery-sections/:id')
  getGallerySection(@Param('id') gallerySectionId: number) {
    return GallerySection.findById(gallerySectionId);
  }

}
