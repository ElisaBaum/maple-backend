import {expect} from 'chai';
import * as request from 'supertest';
import {App} from '../app';
import {AuthenticationService} from '../authentication/authentication.service';
import {OK, NOT_FOUND} from 'http-status-codes';
import {injector} from '../injector';
import {HotelRoom} from "./models/hotel-room.model";
import {Party} from "../user/models/party.model";

describe('routes.user-hotel-rooms', () => {

  const app = injector.get(App);
  const authService = injector.get(AuthenticationService);
  const expressApp = app.getExpressApp();
  const sequelize = app.getSequelize();
  const createAuthToken = (partyId) => authService.createJWToken({user: {id: 1, name: '', partyId}});

  const baseURL = `/api/users/me/hotel-rooms`;

  beforeEach(() => sequelize.sync({force: true}));

  {
    const method = 'get';
    const url = `${baseURL}/reserved`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      it(`should return reserved hotel room for the current user`, async () => {
        const hotelRoom = await HotelRoom.create({
          description: 'room',
          price: 12,
          maxPersonCount: 2,
          parties: [
            {code: '234', maxPersonCount: 2}
          ]
        }, {include: [Party]});
        const [party] = hotelRoom.parties;

        const {body} = await request(expressApp)[method](url)
        .set('Authorization', `Bearer ${createAuthToken(party.id)}`)
        .expect(OK);

        const expectedHotelRoom = hotelRoom.toJSON();
        delete expectedHotelRoom.parties;

        expect(body).to.eql(expectedHotelRoom);
      });

      it(`should return ${NOT_FOUND} if no reserved hotel room is found for the current user`, async () => {
        await request(expressApp)[method](url)
        .set('Authorization', `Bearer ${createAuthToken(1)}`)
        .expect(NOT_FOUND);
      });

    });
  }

  {
    const method = 'delete';
    const url = `${baseURL}/reserved`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      it(`should delete reserved hotel room for the current user`, async () => {
        const hotelRoom = await HotelRoom.create({
          description: 'room',
          price: 12,
          maxPersonCount: 2,
          parties: [
            {code: '234', maxPersonCount: 2}
          ]
        }, {include: [Party]});
        const [party] = hotelRoom.parties;

        await request(expressApp)[method](url)
        .set('Authorization', `Bearer ${createAuthToken(party.id)}`)
        .expect(OK);
      });

      it(`should return ${NOT_FOUND} if no reserved hotel room is found for the current user`, async () => {
        await request(expressApp)[method](url)
        .set('Authorization', `Bearer ${createAuthToken(1)}`)
        .expect(NOT_FOUND);
      });
    });
  }

  {
    const method = 'post';
    const url = `${baseURL}`;

    describe(`${method.toUpperCase()} ${url}/:hotelRoomId`, () => {

      it(`should reserve and return hotel room for the current user`, async () => {
        const hotelRoom = await HotelRoom.create({
          description: 'room',
          price: 12,
          maxPersonCount: 2
        });

        const party = await Party.create(
          {code: '234', maxPersonCount: 2}
        );

        const {body} = await request(expressApp)[method](`${url}/${hotelRoom.id}`)
        .set('Authorization', `Bearer ${createAuthToken(party.id)}`)
        .expect(OK);

        expect(body).to.eql(hotelRoom.toJSON());
      });

      it(`should return ${NOT_FOUND} if no hotel room is found for the id`, async () => {
        await request(expressApp)[method](`${url}/123`)
        .set('Authorization', `Bearer ${createAuthToken(1)}`)
        .expect(NOT_FOUND);
      });

    });
  }

});
