import {AuthenticationService} from "./AuthenticationService";
import {ExtractJwt, Strategy, VerifiedCallback} from "passport-jwt";

export function jwtStrategy(authService: AuthenticationService): any {
  return new Strategy({
    issuer: process.env.JWT_ISSUER as string,
    secretOrKey: process.env.JWT_SECRET as string,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  }, (payload: any, done: VerifiedCallback) => {
    done(null, authService.getUserFromJWTPayload(payload));
  })
}
