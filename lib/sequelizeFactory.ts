import {Sequelize} from "sequelize-typescript";
import {config} from './config';

export const sequelizeFactory = () => new Sequelize({
  ...config.database,
  modelPaths: [
    __dirname + '/user/models',
    __dirname + '/dynamic-content/models',
  ],
  dialectOptions: {
    ssl: true
  }});
