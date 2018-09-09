import {Provider} from 'injection-js';
import {UserAuthenticationController} from './user-authentication.controller';
import {AuthenticationService} from './authentication.service';

export const AUTHENTICATION_PROVIDERS: Provider[] = [
  UserAuthenticationController,
  AuthenticationService,
];
