import {GalleryItemAccess} from './gallery-item-access.enum';

export interface CreateGalleryItemDTO {
  key: string;
  sectionId: number;
  access: GalleryItemAccess;
  lastModifiedAt: Date;
}
