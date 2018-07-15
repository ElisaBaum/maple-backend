import {Request, Response, NextFunction} from "express";
import {config} from '../config';
import {MOVED_TEMPORARILY} from 'http-status-codes';

export const httpRedirectMiddleWare = () => (request: Request, response: Response, next: NextFunction) => {
  const isProd = config.environment === 'prod';
  const isSecure = request.headers['x-forwarded-proto'] === 'https';

  if (isProd && !isSecure) {
    response.redirect(MOVED_TEMPORARILY, `https://${request.hostname + request.originalUrl}`);
    return;
  }
  next();
};
