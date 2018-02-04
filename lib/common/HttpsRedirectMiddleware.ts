import {Request, Response, NextFunction} from "express";
import {ExpressMiddlewareInterface, Middleware} from "routing-controllers";
import {Inject} from "di-typescript";
import {config} from '../config';
import {MOVED_TEMPORARILY} from 'http-status-codes';

@Inject
@Middleware({type: 'before'})
export class HttpsRedirectMiddleware implements ExpressMiddlewareInterface {

  use(request: Request, response: Response, next: NextFunction): any {
    const isProd = config.environment === 'prod';
    const isSecure = request.headers['x-forwarded-proto'] === 'https';

    if (isProd && !isSecure) {
      response.redirect(MOVED_TEMPORARILY, `https://${request.hostname + request.originalUrl}`);
      return;
    }
    next();
  }

}
