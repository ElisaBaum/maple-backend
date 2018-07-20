import {GalleryItemAccess} from './gallery-item-access.enum';

export interface CreateGalleryItemDTO {
  key: string;
  type: string;
  sectionId: number;
  access: GalleryItemAccess;
  lastModifiedAt: Date;
}
