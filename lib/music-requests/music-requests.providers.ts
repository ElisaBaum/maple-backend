import {Provider} from 'injection-js';
import {MusicRequestsService} from './music-requests.service';
import {MusicRequestsController} from './music-requests.controller';
import {UserMusicRequestsController} from './user-music-requests.controller';

export const MUSIC_REQUESTS_PROVIDERS: Provider[] = [
  MusicRequestsService,
  MusicRequestsController,
  UserMusicRequestsController,
];
