import {AuthenticationService} from "../AuthenticationService";
import * as passport from 'passport';
import {Request} from "express";
import {Strategy, VerifiedCallback} from "passport-jwt";
import {config} from '../../config';
import {UnauthorizedError} from '../UnauthorizedError';

export const jwtCsrfXssStrategyName = 'jwt-csrf-xss';
export function jwtCsrfXssStrategy(authService: AuthenticationService): any {
  const {jwt: {issuer, secret, cookieKey}, csrfTokenHeaderKey} = config.auth;
  const strategy = new Strategy({
    issuer,
    secretOrKey: secret,
    passReqToCallback: true,
    jwtFromRequest: (req: Request) => req.cookies[cookieKey],
  }, (req: Request, payload: any, done: VerifiedCallback) => {
    const csrfHeaderToken = req.headers[csrfTokenHeaderKey];
    if (payload.csrfToken === csrfHeaderToken) {
      done(null, authService.getUserFromJWTPayload(payload));
    } else {
      done(new UnauthorizedError(`CSRF Token mismatch`));
    }
  });
  (strategy as passport.Strategy).name = jwtCsrfXssStrategyName;

  return strategy;
}
