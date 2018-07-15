import {Injectable} from "injection-js";
import {Body, Delete, Get, JsonController, OnUndefined, Param, Post, Req} from "routing-controllers";
import {MusicRequestsService} from "./music-requests.service";
import {Request} from "express";
import {RequestedArtist} from "./models/requested-artist.model";
import {RequestedSong} from "./models/requested-song.model";
import {RequestedAlbum} from "./models/requested-album.model";
import {RecursivePartial} from "../common/recursive-partial.type";

@Injectable()
@JsonController()
export class UserMusicRequestsController {

  constructor(protected musicRequestsService: MusicRequestsService) {
  }

  @Get('/users/me/music-request-artists')
  getMusicRequestArtists(@Req() req: Request) {
    const {id} = req.user;
    return this.musicRequestsService.getRequestedArtists(id);
  }

  @Post('/users/me/music-request-artists')
  addMusicRequestArtist(@Req() req: Request, @Body() artist: Partial<RequestedArtist>) {
    const {id} = req.user;
    return this.musicRequestsService.saveRequestedArtist(id, artist);
  }

  @OnUndefined(200)
  @Delete('/users/me/music-request-artists/:artistId')
  deleteMusicRequestArtist(@Req() req: Request, @Param('artistId') artistId: number) {
    const {id} = req.user;
    return this.musicRequestsService.deleteRequestedArtistForUser(id, artistId);
  }

  @Get('/users/me/music-request-albums')
  getMusicRequestAlbums(@Req() req: Request) {
    const {id} = req.user;
    return this.musicRequestsService.getRequestedAlbums(id);
  }

  @Post('/users/me/music-request-albums')
  addMusicRequestAlbum(@Req() req: Request, @Body() album: RecursivePartial<RequestedAlbum>) {
    const {id} = req.user;
    return this.musicRequestsService.saveRequestedAlbum(id, album);
  }

  @OnUndefined(200)
  @Delete('/users/me/music-request-albums/:albumId')
  deleteMusicRequestAlbum(@Req() req: Request, @Param('albumId') albumId: number) {
    const {id} = req.user;
    return this.musicRequestsService.deleteRequestedAlbumForUser(id, albumId);
  }

  @Get('/users/me/music-request-songs')
  getMusicRequestSongs(@Req() req: Request) {
    const {id} = req.user;
    return this.musicRequestsService.getRequestedSongs(id);
  }

  @Post('/users/me/music-request-songs')
  addMusicRequestSong(@Req() req: Request, @Body() song: RecursivePartial<RequestedSong>) {
    const {id} = req.user;
    return this.musicRequestsService.saveRequestedSong(id, song);
  }

  @OnUndefined(200)
  @Delete('/users/me/music-request-songs/:songId')
  deleteMusicRequestSong(@Req() req: Request, @Param('songId') songId: number) {
    const {id} = req.user;
    return this.musicRequestsService.deleteRequestedSongForUser(id, songId);
  }
}
