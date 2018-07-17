import {ReflectiveInjector} from "injection-js";
import {AUTHENTICATION_PROVIDERS} from './authentication/authentication.providers';
import {COMMON_PROVIDERS} from './common/common.providers';
import {DYNAMIC_CONTENT_PROVIDERS} from './dynamic-content/dynamic-content.providers';
import {MUSIC_REQUESTS_PROVIDERS} from './music-requests/music-requests.providers';
import {ROOM_RESERVATION_PROVIDERS} from './room-reservation/room-reservation.providers';
import {USER_PROVIDERS} from './user/user.providers';
import {App} from './app';
import {GALLERY_PROVIDERS} from './gallery/gallery.providers';

export const PROVIDERS = [
  App,
  ...COMMON_PROVIDERS,
  ...GALLERY_PROVIDERS,
  ...AUTHENTICATION_PROVIDERS,
  ...DYNAMIC_CONTENT_PROVIDERS,
  ...MUSIC_REQUESTS_PROVIDERS,
  ...ROOM_RESERVATION_PROVIDERS,
  ...USER_PROVIDERS,
];

export const injector = ReflectiveInjector.resolveAndCreate(PROVIDERS);
