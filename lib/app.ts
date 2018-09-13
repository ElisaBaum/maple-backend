import {Injectable, Injector} from "injection-js";
import * as express from "express";
import * as helmet from "helmet";
import {Application} from "express";
import {Sequelize} from "sequelize-typescript";
import * as cookieParser from "cookie-parser";
import {useExpressServer, useContainer} from "routing-controllers";
import * as errorhandler from 'strong-error-handler';
import {authMiddleware} from "./authentication/auth.middleware";
import * as path from 'path';
import {config} from './config';
import {httpRedirectMiddleWare} from './common/https-redirect.middleware';
import {AuthenticationService} from './authentication/authentication.service';
import {isTsNode} from './utils/ts-node';

@Injectable()
export class App {

  private expressApp: Application;

  constructor(private sequelize: Sequelize,
              authService: AuthenticationService,
              injector: Injector) {

    useContainer(injector);

    this.expressApp = express();
    this.expressApp.use(helmet());
    this.expressApp.use(httpRedirectMiddleWare());
    this.expressApp.use(express.static(config.static.path));
    this.expressApp.get(/^(?!\/api).*$/, (req, res) => res.sendFile(path.join(config.static.path, 'index.html')));
    this.expressApp.use(cookieParser());
    this.expressApp.use(authMiddleware(authService));

    useExpressServer(this.expressApp, {
      routePrefix: '/api',
      controllers: [__dirname + "/**/*.controller." + (isTsNode ? 'ts' : 'js')],
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
