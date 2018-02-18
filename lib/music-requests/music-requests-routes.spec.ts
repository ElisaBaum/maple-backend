import * as request from "supertest";
import {injector} from "../injector";
import {expect} from "chai";
import {App} from "../App";
import {AuthenticationService} from "../authentication/AuthenticationService";
import {OK} from 'http-status-codes';
import {MAX_MUSIC_REQUESTS_PER_USER} from "./MusicRequestsService";

// tslint:disable:no-unused-expression

describe('routes.music-requests', () => {

  const app = injector.get(App);
  const authService = injector.get(AuthenticationService);
  const expressApp = app.getExpressApp();
  const createAuthToken = (userId) => authService.createJWToken({user: {id: userId, name: '', partyId: 1}});

  const baseURL = `/api/music-requests`;

  const url = `${baseURL}/limit`;
  const method = 'get';

  describe(`${method.toUpperCase()} ${url}`, () => {

    it(`should return requested artists for the current user`, async () => {
      const {body} = await request(expressApp)[method](url)
        .set('Authorization', `Bearer ${createAuthToken(1)}`)
        .expect(OK);

      expect(body).to.eql({limit: MAX_MUSIC_REQUESTS_PER_USER});
    });

  });

});
