import {Get, JsonController} from 'routing-controllers';
import {Injectable} from 'injection-js';
import GallerySection from './gallery-section.model';

@Injectable()
@JsonController()
export class GallerySectionController {

  @Get('/gallery-sections')
  getGallerySection() {
    return GallerySection.findAll();
  }

}
