import {Sequelize} from "sequelize-typescript";

export const sequelize = new Sequelize({
  host: process.env.DB_HOST as string,
  port: 5432,
  database: process.env.DB_NAME as string,
  dialect: 'postgres',
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PWD as string,
  modelPaths: [__dirname + '/user/models'],
  dialectOptions: {
    ssl: true
  }
});
