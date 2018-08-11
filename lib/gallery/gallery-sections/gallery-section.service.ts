import {Injectable} from "injection-js";
import GallerySection from "./gallery-section.model";
import {LambdaService} from "../../common/lambda.service";
import {config} from '../../config';
import {S3Service} from "../../common/s3.service";

import {GALLERY_FOLDER, ZIPPED_FOLDER, ZIP_FILE_NAME} from '../shared/gallery.constants';

const GALLERY_ZIPPER = config.aws.lambda.galleryZipperName;

@Injectable()
export class GallerySectionService {

  constructor(private lambdaService: LambdaService, private s3Service: S3Service) {

  }

  async getZippedGallerySection(gallerySection: GallerySection) {
    const zipExists = await this.s3Service.hasObject(`gallery/zipped/${gallerySection.id}/images.zip`);

    if (!zipExists) {
      await this.lambdaService.invoke(GALLERY_ZIPPER, {
        srcFolderPath: `gallery/original/${gallerySection.id}/`
      });
    }

    return this.s3Service.getSignedUrl(`${GALLERY_FOLDER}/${ZIPPED_FOLDER}/${gallerySection.id}/${ZIP_FILE_NAME}`);
  }

}
