import * as request from "supertest";
import {injector} from "../injector";
import {expect} from "chai";
import {App} from "../App";
import {AuthenticationService} from "../authentication/AuthenticationService";
import {OK, NOT_FOUND, INTERNAL_SERVER_ERROR, BAD_REQUEST} from 'http-status-codes';
import {User} from "../user/models/User";
import {Party} from "../user/models/Party";
import {Relation} from "../user/models/Relation";
import {UserRequestedArtist} from "./models/UserRequestedArtist";
import {UserRequestedAlbum} from "./models/UserRequestedAlbum";
import {UserRequestedSong} from "./models/UserRequestedSong";
import {RequestedArtist} from "./models/RequestedArtist";
import {RequestedAlbum} from "./models/RequestedAlbum";
import {RequestedSong} from "./models/RequestedSong";

// tslint:disable:no-unused-expression

describe('routes.user-music-request', () => {

  const app = injector.get(App);
  const authService = injector.get(AuthenticationService);
  const expressApp = app.getExpressApp();
  const sequelize = app.getSequelize();
  const createAuthToken = (userId) => authService.createJWToken({user: {id: userId, name: '', partyId: 1}});

  const baseURL = `/api/users/me`;

  beforeEach(() => sequelize.sync({force: true}));

  const user = {
    name: 'username',
    party: {code: '234', maxPersonCount: 2},
    relation: {key: 'bride', name: 'bride'}
  };

  const artist = {
    name: 'artistName',
    url: 'artistUrl',
    imageUrl: 'imageUrl'
  };

  const album = {
    name: 'albumName',
    url: 'albumUrl',
    imageUrl: 'albumImageUrl'
  };

  const song = {
    name: 'songName',
    url: 'songUrl'
  };

  {
    const method = 'get';
    const url = `${baseURL}/music-request-artists`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      it(`should return requested artists for the current user`, async () => {
        const createdArtist = await RequestedArtist.create({
          ...artist,
          users: [user]
        }, {
          include: [User]
        });

        const {body} = await request(expressApp)[method](url)
          .set('Authorization', `Bearer ${createAuthToken(createdArtist.users[0].id)}`)
          .expect(OK);

        const expectedRequestedArtist = createdArtist.toJSON();
        delete expectedRequestedArtist.users;

        expect(body).to.eql([expectedRequestedArtist]);
      });

      it(`should return an empty array if the current user has no associated artists`, async () => {
        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](url)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .expect(OK);

        expect(body).to.eql([]);
      });

    });
  }

  {
    const method = 'post';
    const url = `${baseURL}/music-request-artists`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      it(`should create artist and associate it to current users and return artist`, async () => {
        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(artist)
          .expect(OK);

        const userRequestedArtist = await UserRequestedArtist.find({
          where: {userId: createdUser.id}
        });

        expect(userRequestedArtist).to.have.property('artistId', body.id);

        delete body.id;
        expect(body).to.eql(artist);
      });

      it(`should associate artist to current users and return artist`, async () => {
        await RequestedArtist.create(artist);

        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(artist)
          .expect(OK);

        const expectedArtist = await RequestedArtist.findAll({
          where: {
            url: artist.url
          }
        });
        expect(expectedArtist.length).to.eql(1);

        const userRequestedArtist = await UserRequestedArtist.find({
          where: {userId: createdUser.id}
        });

        expect(userRequestedArtist).to.have.property('artistId', body.id);

        delete body.id;
        expect(body).to.eql(artist);
      });

      it(`should throw error if artist is already associated to current user`, async () => {
        const createdArtist = await RequestedArtist.create({
          ...artist,
          users: [user]
        }, {
          include: [User]
        });

        await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdArtist.users[0].id)}`)
          .send(artist)
          .expect(INTERNAL_SERVER_ERROR);
      });
    });
  }

  {
    const method = 'delete';
    const url = `${baseURL}/music-request-artists`;

    describe(`${method.toUpperCase()} ${url}/:artistId`, () => {

      it(`should delete association of artist to users requested artists`, async () => {
        const createdArtist = await RequestedArtist.create({
          ...artist,
          users: [user]
        }, {
          include: [User]
        });

        await request(expressApp)[method](`${url}/${createdArtist.id}`)
          .set('Authorization', `Bearer ${createAuthToken(createdArtist.users[0].id)}`)
          .expect(OK);

        const userRequestedArtist = await UserRequestedArtist.find({
          where: {userId: createdArtist.users[0].id}
        });

        expect(userRequestedArtist).to.be.null;

      });

      it(`should return with 404 if requested artist is associated to current user`, async () => {
        const createdUser = await createUser();
        const createdArtist = await RequestedArtist.create(artist);

        await request(expressApp)[method](`${url}/${createdArtist.id}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .expect(NOT_FOUND);
      });

    });
  }

  {
    const method = 'get';
    const url = `${baseURL}/music-request-albums`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      it(`should return albums associated to current user`, async () => {
        const createdAlbum = await RequestedAlbum.create({
          ...album,
          artist,
          users: [user]
        }, {include: [RequestedArtist, User]});

        const {body} = await request(expressApp)[method](url)
          .set('Authorization', `Bearer ${createAuthToken(createdAlbum.users[0].id)}`)
          .expect(OK);

        const expectedRequestedAlbum = createdAlbum.toJSON();
        delete expectedRequestedAlbum.users;

        expect(body).to.eql([expectedRequestedAlbum]);
      });

      it(`should return an empty array if the current user has no associated albums`, async () => {
        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](url)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .expect(OK);

        expect(body).to.eql([]);
      });

    });
  }

  {
    const method = 'post';
    const url = `${baseURL}/music-request-albums`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      const albumToSend = {
        ...album,
        artist
      };


      it(`should create artist and album and associate album to current user and return album`, async () => {
        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(albumToSend)
          .expect(OK);

        const expectedAlbum = await RequestedAlbum.find({
          where: {
            url: albumToSend.url
          },
          include: [RequestedArtist]
        });
        expect(expectedAlbum).to.not.be.null;
        expect(body).to.eql((expectedAlbum as RequestedAlbum).toJSON());

        const userRequestedAlbum = await UserRequestedAlbum.find({
          where: {userId: createdUser.id}
        });
        expect(userRequestedAlbum).to.have.property('albumId', body.id);
      });

      it(`should create album, associate it to current user and return album`, async () => {
        await RequestedArtist.create(artist);

        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(albumToSend)
          .expect(OK);

        const expectedArtist = await RequestedArtist.findAll({
          where: {
            url: artist.url
          }
        });
        expect(expectedArtist.length).to.eql(1);

        const expectedAlbum = await RequestedAlbum.find({
          where: {
            url: albumToSend.url
          },
          include: [RequestedArtist]
        });
        expect(expectedAlbum).to.not.be.null;
        expect(body).to.eql((expectedAlbum as RequestedAlbum).toJSON());

        const userRequestedAlbum = await UserRequestedAlbum.find({
          where: {userId: createdUser.id}
        });
        expect(userRequestedAlbum).to.have.property('albumId', body.id);
      });

      it(`should associate album to current user and return album`, async () => {
        await RequestedAlbum.create({
          ...album,
          artist
        }, {
          include: [RequestedArtist]
        });

        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(albumToSend)
          .expect(OK);

        const expectedArtist = await RequestedArtist.findAll({
          where: {
            url: artist.url
          }
        });
        expect(expectedArtist.length).to.eql(1);

        const expectedAlbum = await RequestedAlbum.findAll({
          where: {
            url: album.url
          },
          include: [RequestedArtist]
        });
        expect(expectedAlbum.length).to.eql(1);
        expect(body).to.eql(expectedAlbum[0].toJSON());

        const userRequestedAlbum = await UserRequestedAlbum.find({
          where: {userId: createdUser.id}
        });
        expect(userRequestedAlbum).to.have.property('albumId', body.id);
      });

      it(`should throw error if album is already associated to current user`, async () => {
        const createdAlbum = await RequestedAlbum.create({
          ...album,
          artist,
          users: [user]
        }, {
          include: [User, RequestedArtist]
        });

        await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdAlbum.users[0].id)}`)
          .send(albumToSend)
          .expect(INTERNAL_SERVER_ERROR);
      });

      it(`should throw error if album does not contain artist url`, async () => {
        const createdUser = await createUser();

        await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send({
            ...album,
            artist: {
              name: 'artist'
            }
          })
          .expect(BAD_REQUEST);
      });

    });
  }

  {
    const method = 'delete';
    const url = `${baseURL}/music-request-albums`;

    describe(`${method.toUpperCase()} ${url}/:albumId`, () => {

      it(`should delete association of album to current user`, async () => {
        const createdAlbum = await RequestedAlbum.create({
          ...album,
          artist,
          users: [user]
        }, {
          include: [User, RequestedArtist]
        });

        await request(expressApp)[method](`${url}/${createdAlbum.id}`)
          .set('Authorization', `Bearer ${createAuthToken(createdAlbum.users[0].id)}`)
          .expect(OK);

        const userRequestedAlbum = await UserRequestedAlbum.find({
          where: {userId: createdAlbum.users[0].id}
        });

        expect(userRequestedAlbum).to.be.null;

      });

      it(`should return with 404 if album is not associated to current user`, async () => {
        const createdUser = await createUser();

        const createdAlbum = await RequestedAlbum.create({
          ...album,
          artist
        }, {
          include: [RequestedArtist]
        });

        await request(expressApp)[method](`${url}/${createdAlbum.id}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .expect(NOT_FOUND);
      });

    });
  }

  {
    const method = 'get';
    const url = `${baseURL}/music-request-songs`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      it(`should return albums associated to the current user`, async () => {
        const createdSong = await RequestedSong.create({
          ...song,
          artist,
          users: [user]
        }, {include: [RequestedArtist, User]});

        const {body} = await request(expressApp)[method](url)
          .set('Authorization', `Bearer ${createAuthToken(createdSong.users[0].id)}`)
          .expect(OK);

        const expectedRequestedSong = createdSong.toJSON();
        delete expectedRequestedSong.users;

        expect(body).to.eql([expectedRequestedSong]);
      });

      it(`should return an empty array if the current user has no associated songs`, async () => {
        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](url)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .expect(OK);

        expect(body).to.eql([]);
      });

    });
  }

  {
    const method = 'post';
    const url = `${baseURL}/music-request-songs`;

    describe(`${method.toUpperCase()} ${url}`, () => {

      const songToSend = {
        ...song,
        artist
      };

      it(`should create artist and song and associate song to current user and return song`, async () => {
        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(songToSend)
          .expect(OK);

        const expectedSong = await RequestedSong.find({
          where: {
            url: song.url
          },
          include: [RequestedArtist]
        });
        expect(expectedSong).to.not.be.null;
        expect(body).to.eql((expectedSong as RequestedAlbum).toJSON());

        const userRequestedSong = await UserRequestedSong.find({
          where: {userId: createdUser.id}
        });
        expect(userRequestedSong).to.have.property('songId', body.id);
      });

      it(`should create song, associate it to current user and return song`, async () => {
        await RequestedArtist.create(artist);

        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(songToSend)
          .expect(OK);

        const expectedArtist = await RequestedArtist.findAll({
          where: {
            url: artist.url
          }
        });
        expect(expectedArtist.length).to.eql(1);

        const expectedSong = await RequestedSong.find({
          where: {
            url: song.url
          },
          include: [RequestedArtist]
        });
        expect(expectedSong).to.not.be.null;
        expect(body).to.eql((expectedSong as RequestedSong).toJSON());

        const userRequestedSong = await UserRequestedSong.find({
          where: {userId: createdUser.id}
        });
        expect(userRequestedSong).to.have.property('songId', body.id);
      });

      it(`should associate song to current user and return song`, async () => {
        await RequestedSong.create({
          ...song,
          artist
        }, {
          include: [RequestedArtist]
        });

        const createdUser = await createUser();

        const {body} = await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send(songToSend)
          .expect(OK);

        const expectedArtist = await RequestedArtist.findAll({
          where: {
            url: artist.url
          }
        });
        expect(expectedArtist.length).to.eql(1);

        const expectedSong = await RequestedSong.findAll({
          where: {
            url: song.url
          },
          include: [RequestedArtist]
        });
        expect(expectedSong.length).to.eql(1);
        expect(body).to.eql(expectedSong[0].toJSON());

        const userRequestedSong = await UserRequestedSong.find({
          where: {userId: createdUser.id}
        });
        expect(userRequestedSong).to.have.property('songId', body.id);
      });

      it(`should throw error if song is already associated to current user`, async () => {
        const createdSong = await RequestedSong.create({
          ...song,
          artist,
          users: [user]
        }, {
          include: [User, RequestedArtist]
        });

        await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdSong.users[0].id)}`)
          .send(songToSend)
          .expect(INTERNAL_SERVER_ERROR);
      });

      it(`should throw error if song does not contain artist url`, async () => {
        const createdUser = await createUser();

        await request(expressApp)[method](`${url}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .send({
            name: 'songName',
            url: 'songUrl',
            artist: {
              name: 'artist'
            }
          })
          .expect(BAD_REQUEST);
      });

    });
  }

  {
    const method = 'delete';
    const url = `${baseURL}/music-request-songs`;

    describe(`${method.toUpperCase()} ${url}/:songId`, () => {

      it(`should delete association of song to current user`, async () => {
        const createdSong = await RequestedSong.create({
          ...song,
          artist,
          users: [user]
        }, {
          include: [User, RequestedArtist]
        });

        await request(expressApp)[method](`${url}/${createdSong.id}`)
          .set('Authorization', `Bearer ${createAuthToken(createdSong.users[0].id)}`)
          .expect(OK);

        const userRequestedSong = await UserRequestedSong.find({
          where: {userId: createdSong.users[0].id}
        });

        expect(userRequestedSong).to.be.null;

      });

      it(`should return with 404 if requested song is not associated to current user`, async () => {
        const createdUser = await createUser();

        const createdSong = await RequestedSong.create({
          ...song,
          artist
        }, {
          include: [RequestedArtist]
        });

        await request(expressApp)[method](`${url}/${createdSong.id}`)
          .set('Authorization', `Bearer ${createAuthToken(createdUser.id)}`)
          .expect(NOT_FOUND);
      });

    });
  }

  function createUser() {
    return User.create({
      name: 'username',
      party: {code: '234', maxPersonCount: 2},
      relation: {key: 'bride', name: 'bride'}
    }, {include: [Party, Relation]});
  }

});
