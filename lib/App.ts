import * as express from 'express';
import {Inject} from "di-typescript";
import {Application} from "express";
import {Sequelize} from "sequelize-typescript";

@Inject
export class App {

  private _expressApp: Application;

  get expressApp(): Application {
    return this._expressApp;
  }

  constructor(protected sequelize: Sequelize) {
    this._expressApp = express();
  }

}