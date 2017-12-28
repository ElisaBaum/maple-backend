import {expect} from 'chai';
import * as request from 'supertest';
import {App} from '../App';
import {AuthenticationService} from '../authentication/AuthenticationService';
import {OK} from 'http-status-codes';
import {injector} from '../injector';
import {HotelRoom} from "./models/HotelRoom";

describe('routes.hotel-rooms', () => {

  const app = injector.get(App);
  const authService = injector.get(AuthenticationService);
  const expressApp = app.getExpressApp();
  const sequelize = app.getSequelize();
  const createAuthToken = () => authService.createJWToken({id: 1, name: '', partyId: 1});

  const baseURL = `/hotel-rooms`;

  beforeEach(() => sequelize.sync({force: true}));

  const method = 'get';
  const url = `${baseURL}`;

  describe(`${method.toUpperCase()} ${url}`, () => {

    it(`should return all hotel rooms`, async () => {
      const hotelRoom = await HotelRoom.create({
        description: 'room',
        price: 12,
        maxPersonCount: 2,
      });

      const {body} = await request(expressApp)[method](url)
      .set('Authorization', `Bearer ${createAuthToken()}`)
      .expect(OK);

      expect(body).to.eql([hotelRoom.toJSON()]);
    });

  });

});
