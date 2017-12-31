import {expect} from 'chai';
import * as request from 'supertest';
import {App} from '../App';
import {AuthenticationService} from '../authentication/AuthenticationService';
import {NOT_FOUND, OK} from 'http-status-codes';
import {injector} from '../injector';
import {DynamicContent} from './models/DynamicContent';

describe('routes.dynamic-content', () => {

  const app = injector.get(App);
  const authService = injector.get(AuthenticationService);
  const expressApp = app.getExpressApp();
  const sequelize = app.getSequelize();
  const createAuthToken = () => authService.createJWToken({user: {id: 1, name: '', partyId: 1}});

  const baseURL = `/api/dynamic-content`;

  beforeEach(() => sequelize.sync({force: true}));

  const method = 'get';
  const url = `${baseURL}/`;

  describe(`${method.toUpperCase()} ${url}/:key`, () => {

    it(`should return content with prepared content`, async () => {
      const dynamicContent = await DynamicContent.create({
        key: 'test',
        content: {
          headerImg: 'IMG_A',
          sub: {
            images: 'IMG_AA',
          },
        },
        resources: {
          IMG_A: 'a.jpg',
          IMG_AA: ['b.jpg', 'c.jpg'],
        },
      });
      const {body} = await request(expressApp)[method](`${url}${dynamicContent.key}`)
        .set('Authorization', `Bearer ${createAuthToken()}`)
        .expect(OK);

      const {content} = body;
      expect(content).to.have.property('headerImg').that.matches(/https:\/\/.*a\.jpg/);
      expect(content).to.have.property('sub')
        .that.have.property('images')
        .that.is.an('array')
      ;
      expect(content.sub.images[0]).to.match(/https:\/\/.*b\.jpg/);
      expect(content.sub.images[1]).to.match(/https:\/\/.*c\.jpg/);
    });

    it(`should return content even if content do not have resources`, async () => {
      const dynamicContent = await DynamicContent.create({
        key: 'test',
        content: {},
      });
      const {body} = await request(expressApp)[method](`${url}${dynamicContent.key}`)
        .set('Authorization', `Bearer ${createAuthToken()}`)
        .expect(OK);

      expect(body).to.be.an('object');
    });

    it(`should return ${NOT_FOUND}`, async () => {
      await request(expressApp)[method](`${url}${'blabla'}`)
        .set('Authorization', `Bearer ${createAuthToken()}`)
        .expect(NOT_FOUND);
    });

  });

});
