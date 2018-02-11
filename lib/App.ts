import {Inject, Injector} from "di-typescript";
import * as express from "express";
import * as helmet from "helmet";
import {Application} from "express";
import {Sequelize} from "sequelize-typescript";
import * as cookieParser from "cookie-parser";
import {useExpressServer, useContainer} from "routing-controllers";
import * as errorhandler from 'strong-error-handler';
import {authMiddleware} from "./authentication/authMiddleware";
import * as path from 'path';
import {config} from './config';
import {httpRedirectMiddleWare} from './common/httpsRedirectMiddleware';
import {AuthenticationService} from './authentication/AuthenticationService';

@Inject
export class App {

  private expressApp: Application;

  constructor(protected sequelize: Sequelize,
              protected injector: Injector,
              protected authService: AuthenticationService) {

    useContainer(injector);

    this.expressApp = express();
    this.expressApp.use(helmet());
    this.expressApp.use(httpRedirectMiddleWare());
    this.expressApp.use(express.static(config.static.path));
    this.expressApp.get(/^(?!\/api).*$/, (req, res) => res.sendFile(path.join(config.static.path, 'index.html')));
    this.expressApp.use(cookieParser());
    this.expressApp.use(authMiddleware(this.authService));

    useExpressServer(this.expressApp, {
      routePrefix: '/api',
      controllers: [__dirname + "/**/*Controller.ts"],
      defaultErrorHandler: false,
      classTransformer: false,
    });

    this.expressApp.use(errorhandler({
      debug: process.env.ENV !== 'prod',
      log: true,
    }));
  }

  getExpressApp() {
    return this.expressApp;
  }

  getSequelize() {
    return this.sequelize;
  }

}
