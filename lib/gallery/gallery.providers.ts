import {Provider} from 'injection-js';
import {UserGallerySectionController} from './gallery-sections/user-gallery-section.controller';
import {GallerySectionController} from './gallery-sections/gallery-section.controller';
import {UserGalleryItemController} from './gallery-items/user-gallery-item.controller';

export const GALLERY_PROVIDERS: Provider[] = [
  UserGalleryItemController,
  UserGallerySectionController,
  GallerySectionController,
];
