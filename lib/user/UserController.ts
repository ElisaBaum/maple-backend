import {Get, JsonController, Post, Req, Body, Patch, Param, OnUndefined} from "routing-controllers";
import {Inject} from "di-typescript";
import {Request} from "express";
import {AuthenticationService} from "../authentication/AuthenticationService";
import {UserService} from "./UserService";
import {User} from "./models/User";

@Inject
@JsonController()
export class UserController {

  constructor(protected authService: AuthenticationService,
              protected userService: UserService) {

  }

  @Get('/users/me/token')
  getUserToken(@Req() req: Request) {
    return {token: this.authService.createJWToken(req.user)};
  }

  @OnUndefined(200)
  @Patch('/users/me')
  async updateUserPartially(@Req() req: Request, @Body() user: Partial<User>) {
    const userId = req.user.id;
    return this.userService.updateUserPartially(userId, user);
  }

  @Get('/users/me/party')
  async getParty(@Req() req: Request) {
    const partyId = req.user.partyId;
    return this.userService.getParty(partyId);
  }

  @Post('/users/me/companions')
  async addCompanion(@Req() req: Request, @Body() companion: Partial<User> & {name: string}) {
    const {partyId} = req.user;
    return this.userService.createCompanion(partyId, companion);
  }

  @OnUndefined(200)
  @Patch('/users/me/companions/:companionId')
  async updateCompanionPartially(@Req() req: Request,
                                 @Param('companionId') companionId: number,
                                 @Body() companion: Partial<User> & {accepted: boolean}) {
    const partyId = req.user.partyId;
    return this.userService.updateCompanionPartially(partyId, companionId, companion);
  }

}
