import {Request, Response, NextFunction, RequestHandler} from "express";
import {ExpressMiddlewareInterface, Middleware} from "routing-controllers";
import * as passport from "passport";
import {basicStrategy} from "./strategies/basic-strategy";
import {Inject} from "di-typescript";
import {AuthenticationService} from "./AuthenticationService";
import {jwtStrategy} from "./strategies/jwt-strategy";

@Inject
@Middleware({ type: 'before' })
export class AuthMiddleware implements ExpressMiddlewareInterface {

  private handler: RequestHandler;

  constructor(protected authService: AuthenticationService) {
    passport.use(basicStrategy(authService));
    passport.use(jwtStrategy(authService));
    this.handler = passport.authenticate(['basic', 'jwt'], {session: false});
  }

  use(request: Request, response: Response, next: NextFunction): any {
    return this.handler(request, response, next);
  }

}
