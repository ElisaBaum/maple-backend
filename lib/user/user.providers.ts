import {Provider} from 'injection-js';
import {UserController} from './user.controller';
import {UserService} from './user.service';

export const USER_PROVIDERS: Provider[] = [
  UserController,
  UserService,
];
