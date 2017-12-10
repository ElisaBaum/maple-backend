import {expect} from 'chai';
import * as request from 'supertest';
import {App} from '../App';
import {AuthenticationService} from '../authentication/AuthenticationService';
import {OK} from 'http-status-codes';
import {User} from './models/User';
import {AuthUser} from '../authentication/AuthUser';
import {Party} from './models/Party';
import {RecursivePartial} from '../common/RecursivePartial';
import {injector} from '../injector';

describe('routes.users', () => {

  const app = injector.get(App);
  const authService = injector.get(AuthenticationService);
  const expressApp = app.getExpressApp();
  const sequelize = app.getSequelize();

  const baseURL = `/users`;

  beforeEach(() => sequelize.sync({force: true}));

  let method = 'get';
  let url = `${baseURL}/me/token`;

  describe(`${method.toUpperCase()} ${url}`, () => {

    it(`should user data (status: ${OK})`, async () => {
      const limit = 1;
      const offset = 0;
      const userData: RecursivePartial<User> = {name: 'elisa', party: {code: 'abc'}};
      const {id, name, partyId} = await User.create(userData, {include: [Party]});
      const authUser: AuthUser = {id, name, partyId};
      const {body} = await request(expressApp)[method](url)
        .query({limit, offset})
        .set('Authorization', `Bearer ${authService.createJWToken(authUser)}`)
        .expect(OK);

      expect(body).to.have.property('token').which.is.a('string');
    });

  });

});
