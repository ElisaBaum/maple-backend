import {RequestedArtist} from "./models/RequestedArtist";
import {UserRequestedArtist} from "./models/UserRequestedArtist";
import {User} from "../user/models/User";
import {RequestedAlbum} from "./models/RequestedAlbum";
import {RequestedSong} from "./models/RequestedSong";
import {UserRequestedAlbum} from "./models/UserRequestedAlbum";
import {RecursivePartial} from "../common/RecursivePartial";
import {UserRequestedSong} from "./models/UserRequestedSong";
import {UserMusicRequestNotFoundError} from "./errors/UserMusicRequestNotFoundError";
import {ArtistUrlNotProvidedError} from "./errors/ArtistUrlNotProvidedError";

export class MusicRequestsService {

  getRequestedArtists(userId) {
    return RequestedArtist.findAll({
      include: [{
        model: User,
        attributes: [],
        where: {id: userId}
      }]
    });
  }

  async saveRequestedArtist(userId, artist: Partial<RequestedArtist>) {
    const [savedArtist] = await RequestedArtist.findOrCreate({
      defaults: artist,
      where: {
        url: artist.url
      }
    });

    await UserRequestedArtist.create({
      userId,
      artistId: savedArtist.id
    });

    return savedArtist;
  }

  async deleteRequestedArtistForUser(userId, artistId) {
    const affectedRows = await UserRequestedArtist.destroy({
      where: {userId, artistId}
    });

    if (!affectedRows) {
      throw new UserMusicRequestNotFoundError();
    }
  }

  getRequestedAlbums(userId) {
    return RequestedAlbum.findAll({
      include: [{
        model: User,
        attributes: [],
        where: {id: userId}
      }, RequestedArtist]
    });
  }

  async saveRequestedAlbum(userId, album: RecursivePartial<RequestedAlbum>) {
    if (album.artist && album.artist.url) {
      const [savedArtist] = await RequestedArtist.findOrCreate({
        defaults: album.artist,
        where: {
          url: album.artist.url
        }
      });

      const albumToSave = {...album, artistId: savedArtist.id};
      delete albumToSave.artist;

      const [savedAlbum] = await RequestedAlbum.findOrCreate({
        defaults: albumToSave,
        where: {
          url: album.url
        }
      });

      savedAlbum['dataValues'].artist = savedArtist;

      await UserRequestedAlbum.create({
        userId,
        albumId: savedAlbum.id
      });

      return savedAlbum;
    }

    throw new ArtistUrlNotProvidedError();
  }

  async deleteRequestedAlbumForUser(userId, albumId) {
    const affectedRows = await UserRequestedAlbum.destroy({
      where: {userId, albumId}
    });

    if (!affectedRows) {
      throw new UserMusicRequestNotFoundError();
    }
  }

  getRequestedSongs(userId) {
    return RequestedSong.findAll({
      include: [{
        model: User,
        attributes: [],
        where: {id: userId}
      }, RequestedArtist]
    });
  }

  async saveRequestedSong(userId, song: RecursivePartial<RequestedSong>) {
    if (song.artist && song.artist.url) {
      const [savedArtist] = await RequestedArtist.findOrCreate({
        defaults: song.artist,
        where: {
          url: song.artist.url
        }
      });

      const songToSave = {...song, artistId: savedArtist.id};
      delete songToSave.artist;

      const [savedSong] = await RequestedSong.findOrCreate({
        defaults: songToSave,
        where: {
          url: song.url
        }
      });
      savedSong['dataValues'].artist = savedArtist;

      await UserRequestedSong.create({
        userId,
        songId: savedSong.id
      });

      return savedSong;
    }

    throw new ArtistUrlNotProvidedError();
  }

  async deleteRequestedSongForUser(userId, songId) {
    const affectedRows = await UserRequestedSong.destroy({
      where: {userId, songId}
    });

    if (!affectedRows) {
      throw new UserMusicRequestNotFoundError();
    }
  }
}
