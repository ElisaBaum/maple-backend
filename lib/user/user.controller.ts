import {Get, JsonController, Post, Req, Body, Patch, Param, OnUndefined} from "routing-controllers";
import {Injectable} from "injection-js";
import {Request} from "express";
import {UserService} from "./user.service";
import {User} from "./models/user.model";
import {OK} from 'http-status-codes';

@Injectable()
@JsonController()
export class UserController {

  constructor(protected userService: UserService) {
  }

  @OnUndefined(OK)
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

  @OnUndefined(OK)
  @Patch('/users/me/companions/:companionId')
  async updateCompanionPartially(@Req() req: Request,
                                 @Param('companionId') companionId: number,
                                 @Body() companion: Partial<User> & {accepted: boolean}) {
    const partyId = req.user.partyId;
    return this.userService.updateCompanionPartially(partyId, companionId, companion);
  }

}
