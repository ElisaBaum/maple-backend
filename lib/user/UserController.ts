import {Get, JsonController, Req} from "routing-controllers";
import {Inject} from "di-typescript";
import {Request} from "express";
import {AuthenticationService} from "../authentication/AuthenticationService";

@Inject
@JsonController()
export class UserController {

  constructor(protected authService: AuthenticationService) {

  }

  @Get('/users/me/token')
  getUserToken(@Req() req: Request) {
    return {token: this.authService.createJWToken(req.user)};
  }


}
