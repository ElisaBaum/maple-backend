process.env.ENVIRONMENT = 'test';
process.env.PORT = '3000';

process.env.DB_NAME = 'maple-test';
process.env.DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
process.env.DB_USERNAME = 'root';
process.env.DB_HOST = 'localhost';
process.env.DB_PWD = '';
process.env.DB_LOGGING = 'false';

process.env.JWT_SECRET = 'jwt_secret';
process.env.JWT_ISSUER = 'jwt_issuer';
process.env.JWT_EXP = '20m';

process.env.AWS_ACCESS_KEY = 'test';
process.env.AWS_SECRET_KEY = 'test';
