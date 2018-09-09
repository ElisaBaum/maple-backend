import {GalleryItemAccess} from './gallery-item-access.enum';

export interface CreateGalleryItemDTO {
  key: string;
  originalName: string;
  resizedKey: string;
  type: string;
  sectionId: number;
  access: GalleryItemAccess;
  lastModifiedAt: Date;
}
