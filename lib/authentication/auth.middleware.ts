import * as passport from "passport";
import {basicStrategy} from "./strategies/basic-strategy";
import {AuthenticationService} from "./authentication.service";
import {jwtStrategy} from "./strategies/jwt-strategy";
import {jwtCsrfXssStrategy, jwtCsrfXssStrategyName} from './strategies/jwt-csrf-xss-strategy';

export const authMiddleware = (authService: AuthenticationService) => {
  passport.use(jwtCsrfXssStrategy(authService));
  passport.use(basicStrategy(authService));
  passport.use(jwtStrategy(authService));
  return passport.authenticate(['basic', jwtCsrfXssStrategyName, 'jwt'], {session: false});
};
