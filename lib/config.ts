import {minutes} from './utils/date';

export const config = {
  environment: process.env.ENV || 'dev',
  database: {
    host: process.env.DB_HOST as string,
    port: 5432,
    database: process.env.DB_NAME as string,
    dialect: process.env.DB_DIALECT || 'postgres',
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PWD as string,
    logging: process.env.DB_LOGGING === 'true'
  },
  aws: {
    config: {
      accessKeyId: process.env.AWS_ACCESS_KEY as string,
      secretAccessKey: process.env.AWS_SECRET_KEY as string,
      signatureVersion: 'v4',
      region: 'eu-central-1',
    },
    s3: {
      bucket: 'maple-backend',
      signedUrlExpirationTime: minutes(5).inSeconds(),
    },
  },
  auth: {
    maxFailedAttempts: parseFloat(process.env.AUTH_MAX_FAILED_ATTEMPTS || '5'),
    lockingTime: parseFloat(process.env.AUTH_LOCKING_TIME || '0') || minutes(15).inMs(),
    csrfTokenHeaderKey: process.env.CSRF_TOKEN_HEADER_KEY || 'x-csrf-token',
    jwt: {
      cookieKey: process.env.JWT_COOKIE_KEY || 'jwt',
      secret: process.env.JWT_SECRET as string,
      issuer: process.env.JWT_ISSUER as string,
      expiresIn: process.env.JWT_EXP as string,
    }
  }
};
