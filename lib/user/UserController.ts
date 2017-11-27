import {Get, JsonController, Req, UseBefore} from "routing-controllers";
import {Inject} from "di-typescript";
import {AuthMiddleware} from "../authentication/AuthMiddleware";
import {Request} from "express";
import {AuthenticationService} from "../authentication/AuthenticationService";

@Inject
@JsonController()
@UseBefore(AuthMiddleware)
export class UserController {

  constructor(protected authService: AuthenticationService) {

  }

  @Get('/users/me/token')
  getUserToken(@Req() req: Request) {
    return {token: this.authService.createJWToken(req.user)};
  }


}
