import {expect} from 'chai';
import * as request from 'supertest';
import {App} from '../app';
import {AuthenticationService} from '../authentication/authentication.service';
import {NOT_FOUND, OK} from 'http-status-codes';
import {DynamicContent} from './models/dynamic-content.model';
import {ReflectiveInjector} from 'injection-js';
import {S3Service} from '../common/s3.service';
import {PROVIDERS} from '../injector';

describe('routes.dynamic-content', () => {

  const unPrefixedObjectListMock = ['b.jpg', 'c.jpg'];
  const s3Mock: Partial<S3Service> = {
    listObjects: (prefix?: string) => Promise.resolve(unPrefixedObjectListMock.map(obj => `${prefix}/${obj}`)),
    getSignedUrl: (key: string) => Promise.resolve(`https://${key}`)
  };

  const injector = ReflectiveInjector.resolveAndCreate([
    ...PROVIDERS,
    {provide: S3Service, useValue: s3Mock},
  ]);

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
          IMG_AA: 'some_folder/*',
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
