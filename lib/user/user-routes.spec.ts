import {expect} from 'chai';
import * as request from 'supertest';
import {App} from '../App';
import {AuthenticationService} from '../authentication/AuthenticationService';
import {OK, UNAUTHORIZED} from 'http-status-codes';
import {User} from './models/User';
import {AuthUser} from '../authentication/AuthUser';
import {Party} from './models/Party';
import {RecursivePartial} from '../common/RecursivePartial';
import {injector} from '../injector';
import {config} from '../config';

describe('routes.users', () => {

  const app = injector.get(App);
  const authService = injector.get(AuthenticationService);
  const expressApp = app.getExpressApp();
  const sequelize = app.getSequelize();
  const toBase64 = value => new Buffer(value).toString('base64');

  const baseURL = `/users`;

  beforeEach(() => sequelize.sync({force: true}));

  let method = 'get';
  let url = `${baseURL}/me/token`;

  describe(`${method.toUpperCase()} ${url}`, () => {

    it(`should return jwt token with status ${OK} by jwt`, async () => {
      const userData: RecursivePartial<User> = {name: 'elisa', party: {code: 'abc'}};
      const {id, name, partyId} = await User.create(userData, {include: [Party.unscoped()]});
      const authUser: AuthUser = {id, name, partyId};
      const {body} = await request(expressApp)[method](url)
        .set('Authorization', `Bearer ${authService.createJWToken(authUser)}`)
        .expect(OK);

      expect(body).to.have.property('token').which.is.a('string');
    });

    it(`should return jwt token with status ${OK} by basic auth`, async () => {
      const userData: RecursivePartial<User> = {name: 'elisa', party: {code: 'abc'}};
      // const {name, party: {code}} = await User.create(userData, {include: [Party.unscoped()]});
      const user = await User.create(userData, {include: [Party.unscoped()]});
      const {name, party: {code}} = user;
      const {body} = await request(expressApp)[method](url)
        .set('Authorization', `Basic ${toBase64(`${name}:${code}`)}`)
        .expect(OK);

      expect(body).to.have.property('token').which.is.a('string');
    });

    it(`should return Unauthorized with status ${UNAUTHORIZED} due to wrong password`, async () => {
      const userData: RecursivePartial<User> = {name: 'elisa', party: {code: 'abc'}};
      const {name} = await User.create(userData, {include: [Party.unscoped()]});
      await request(expressApp)[method](url)
        .set('Authorization', `Basic ${toBase64(`${name}:wrong-password`)}`)
        .expect(UNAUTHORIZED);
    });

    it(`should return Unauthorized with status ${UNAUTHORIZED} due to not existing user`, async () => {
      const userData: RecursivePartial<User> = {name: 'elisa', party: {code: 'abc'}};
      const {party: {code}} = await User.create(userData, {include: [Party.unscoped()]});
      await request(expressApp)[method](url)
        .set('Authorization', `Basic ${toBase64(`non-existing-name:${code}`)}`)
        .expect(UNAUTHORIZED);
    });

    it(`should return Unauthorized with status ${UNAUTHORIZED} due to too many failed attempts`, async () => {
      const userData: RecursivePartial<User> = {name: 'elisa', party: {code: 'abc'}};
      const {name, party: {code}} = await User.create(userData, {include: [Party.unscoped()]});
      const requestWithWrongPassword = async () => await request(expressApp)[method](url)
        .set('Authorization', `Basic ${toBase64(`${name}:wrong-password`)}`);

      for(let i = 0; i < config.auth.maxFailedAttempts; i++) {
        await requestWithWrongPassword();
      }

      await request(expressApp)[method](url)
        .set('Authorization', `Basic ${toBase64(`${name}:${code}`)}`)
        .expect(UNAUTHORIZED)
      ;
    });

  });

});
