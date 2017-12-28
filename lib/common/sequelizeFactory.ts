import {Sequelize} from "sequelize-typescript";
import {config} from '../config';

export const sequelizeFactory = () => new Sequelize({
  ...config.database,
  modelPaths: [
    __dirname + '/../*/models/*',
  ],
  dialectOptions: {
    ssl: true
  }});
