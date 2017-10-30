import {Injector} from "di-typescript";
import {sequelize} from "./sequelize";
import {Sequelize} from "sequelize-typescript";

export const injector = new Injector([
  {provide: Sequelize, useValue: sequelize}
]);