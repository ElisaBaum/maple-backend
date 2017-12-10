
process.env.ENVIRONMENT = 'test';
process.env.PORT = '3000';

process.env.DB_NAME = 'test-server-test';
process.env.DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
process.env.DB_USERNAME = 'root';
process.env.DB_HOST = 'localhost';
process.env.DB_PWD = '';
process.env.DB_LOGGING = 'false';

process.env.JWT_SECRET = 'jwt_secret';
process.env.USER_PWD_PEPPER = 'user_pwd_pepper';
