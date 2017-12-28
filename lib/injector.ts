import {Injector} from "di-typescript";
import {Sequelize} from "sequelize-typescript";
import {sequelizeFactory} from "./common/sequelizeFactory";
import {s3Factory} from './common/s3Factory';
import {S3} from 'aws-sdk';

export const injector = new Injector([
  {provide: Sequelize, useFactory: sequelizeFactory},
  {provide: S3, useFactory: s3Factory},
]);
