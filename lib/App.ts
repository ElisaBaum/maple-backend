import {Inject} from "di-typescript";
import {Application} from "express";
import {Sequelize} from "sequelize-typescript";
import {createExpressServer, useContainer} from "routing-controllers";
import {injector} from "./injector";
import * as errorhandler from 'strong-error-handler';
import {AuthMiddleware} from "./authentication/AuthMiddleware";

@Inject
export class App {

  private _expressApp: Application;

  get expressApp(): Application {
    return this._expressApp;
  }

  constructor(protected sequelize: Sequelize) {

    useContainer(injector);

    this._expressApp = createExpressServer({
      controllers: [__dirname + "/**/*Controller.ts"],
      middlewares: [AuthMiddleware],
      cors: true,
      defaultErrorHandler: false,
      classTransformer: false,
    });

    this._expressApp.use(errorhandler({
      debug: process.env.ENV !== 'prod',
      log: true,
    }));
  }

}
