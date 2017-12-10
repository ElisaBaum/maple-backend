import {Injector} from "di-typescript";
import {Sequelize as SequelizeTypeScript} from "sequelize-typescript";
import {sequelizeFactory} from "./sequelizeFactory";

export const injector = new Injector([
  {provide: SequelizeTypeScript, useFactory: sequelizeFactory}
]);
