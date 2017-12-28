import {AuthenticationService} from "../AuthenticationService";
import {ExtractJwt, Strategy, VerifiedCallback} from "passport-jwt";
import {config} from '../../config';

export function jwtStrategy(authService: AuthenticationService): any {
  const {issuer, secret} = config.auth.jwt;
  return new Strategy({
    issuer,
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  }, (payload: any, done: VerifiedCallback) => {
    done(null, authService.getUserFromJWTPayload(payload));
  })
}
