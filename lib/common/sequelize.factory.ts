import {Sequelize} from "sequelize-typescript";
import {config} from '../config';
import {isTsNode} from '../utils/ts-node';

export const sequelizeFactory = () => new Sequelize({
  ...config.database,
  modelPaths: [
    __dirname + '/../**/*.model.' + (isTsNode ? 'ts' : 'js'),
  ],
  dialectOptions: {
    ssl: true
  }});
