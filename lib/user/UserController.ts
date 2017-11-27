import {Get, JsonController, Post, Req, Body, Patch, Param, OnUndefined} from "routing-controllers";
import {Inject} from "di-typescript";
import {Request} from "express";
import {AuthenticationService} from "../authentication/AuthenticationService";
import {UserService} from "./UserService";

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
  async updateUserPartially(@Req() req: Request, @Body() user: any) {
    const userId = req.user.id;
    return this.userService.updateUserPartially(userId, user);
  }

  @Post('/users/me/companions')
  async addCompanion(@Req() req: Request, @Body() companion: any) {
    const userId = req.user.id;
    return this.userService.createCompanion(userId, companion);
  }

  @OnUndefined(200)
  @Patch('/users/me/companions/:companionId')
  async updateCompanionPartially(@Req() req: Request, @Param('companionId') companionId: number, @Body() companion: any) {
    const userId = req.user.id;
    return this.userService.updateCompanionPartially(userId, companionId, companion);
  }

}
