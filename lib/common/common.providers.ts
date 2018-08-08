import {Provider} from 'injection-js';
import {Sequelize} from 'sequelize-typescript';
import {s3Factory} from './s3.factory';
import {S3} from 'aws-sdk';
import {sequelizeFactory} from './sequelize.factory';
import {S3Service} from './s3.service';
import {LambdaService} from "./lambda.service";

export const COMMON_PROVIDERS: Provider[] = [
  S3Service,
  LambdaService,
  {provide: Sequelize, useFactory: sequelizeFactory, deps: []},
  {provide: S3, useFactory: s3Factory, deps: []},
];
