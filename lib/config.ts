import {minutes} from './utils/date';

export const config = {
  database: {
    host: process.env.DB_HOST as string,
    port: 5432,
    database: process.env.DB_NAME as string,
    dialect: process.env.DB_DIALECT || 'postgres',
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PWD as string,
  },
  auth: {
    maxFailedAttempts: parseFloat(process.env.AUTH_MAX_FAILED_ATTEMPTS || '6'),
    lockingTime: parseFloat(process.env.AUTH_LOCKING_TIME || '0') || minutes(15),
    jwt: {
      secret: process.env.JWT_SECRET as string,
      issuer: process.env.JWT_ISSUER as string,
      expiresIn: process.env.JWT_EXP as string,
    }
  }
};
