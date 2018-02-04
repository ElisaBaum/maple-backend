import {Inject} from "di-typescript";
import * as express from "express";
import * as helmet from "helmet";
import {Application} from "express";
import {Sequelize} from "sequelize-typescript";
import * as cookieParser from "cookie-parser";
import {useExpressServer, useContainer} from "routing-controllers";
import {injector} from "./injector";
import * as errorhandler from 'strong-error-handler';
import {AuthMiddleware} from "./authentication/AuthMiddleware";
import * as path from 'path';
import {config} from './config';

@Inject
export class App {

  private expressApp: Application;

  constructor(protected sequelize: Sequelize) {

    useContainer(injector);

    this.expressApp = express();
    this.expressApp.use(helmet());
    this.expressApp.use(express.static(config.static.path));
    this.expressApp.use(cookieParser());
    useExpressServer(this.expressApp, {
      routePrefix: '/api',
      controllers: [__dirname + "/**/*Controller.ts"],
      middlewares: [AuthMiddleware],
      cors: true,
      defaultErrorHandler: false,
      classTransformer: false,
    });
    this.expressApp.use(errorhandler({
      debug: process.env.ENV !== 'prod',
      log: true,
    }));
    this.expressApp.get('*', (req, res) => res.sendFile(path.join(config.static.path, 'index.html')));
  }

  getExpressApp() {
    return this.expressApp;
  }

  getSequelize() {
    return this.sequelize;
  }

}
