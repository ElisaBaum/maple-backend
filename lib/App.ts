import {Inject} from "di-typescript";
import {Application} from "express";
import {Sequelize} from "sequelize-typescript";
import {createExpressServer, useContainer} from "routing-controllers";
import {injector} from "./injector";
import * as errorhandler from 'strong-error-handler';
import {AuthMiddleware} from "./authentication/AuthMiddleware";

@Inject
export class App {

  private expressApp: Application;

  constructor(protected sequelize: Sequelize) {

    useContainer(injector);

    this.expressApp = createExpressServer({
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
  }

  getExpressApp() {
    return this.expressApp;
  }

  getSequelize() {
    return this.sequelize;
  }

}
