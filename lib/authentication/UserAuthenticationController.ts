import {Inject} from 'di-typescript';
import {Request, Response} from "express";
import {Get, JsonController, OnUndefined, Post, Req, Res} from 'routing-controllers';
import {AuthenticationService} from './AuthenticationService';
import {config} from '../config';
import {OK} from 'http-status-codes';

@Inject
@JsonController()
export class UserAuthenticationController {

  constructor(protected authService: AuthenticationService) {
  }

  @Get('/users/me/token')
  getUserToken(@Req() req: Request) {
    return {token: this.authService.createJWToken({user: req.user})};
  }

  @Post('/login')
  login(@Req() req: Request, @Res() res: Response) {
    const {environment, auth: {jwt: {cookieKey}}} = config;
    const csrfToken = this.authService.createCSRFToken();
    const payload = {csrfToken, user: req.user};
    const jwtToken = this.authService.createJWToken(payload);

    res.cookie(cookieKey, jwtToken, {httpOnly: true, secure: environment === 'prod'});
    return payload;
  }

  @OnUndefined(OK)
  @Post('/logout')
  logout(@Res() res: Response) {
    const {environment, auth: {jwt: {cookieKey}}} = config;
    res.cookie(cookieKey, '', {httpOnly: true, secure: environment === 'prod'});
  }

}
