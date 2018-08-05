import {Injectable} from "injection-js";
import GallerySection from "./gallery-section.model";
import {LambdaService} from "../../common/lambda.service";
import {config} from '../../config';

const GALLERY_ZIPPER = config.aws.lambda.galleryZipperName;

@Injectable()
export class GallerySectionService {

  constructor(private lambdaService: LambdaService) {

  }

  async getZippedGallerySection(gallerySection: GallerySection) {
    await this.lambdaService.invoke(GALLERY_ZIPPER, {
      srcFolderPath: `gallery/original/${gallerySection.id}/`
    });
  }

}
