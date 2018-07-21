import {Provider} from 'injection-js';
import {UserGallerySectionController} from './gallery-sections/user-gallery-section.controller';
import {GallerySectionController} from './gallery-sections/gallery-section.controller';
import {UserGalleryItemController} from './gallery-items/user-gallery-item.controller';
import {GalleryItemService} from './gallery-items/gallery-item.service';

export const GALLERY_PROVIDERS: Provider[] = [
  GalleryItemService,
  UserGalleryItemController,
  UserGallerySectionController,
  GallerySectionController,
];
