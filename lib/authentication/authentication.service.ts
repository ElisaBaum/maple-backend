import * as jwt from 'jsonwebtoken';
import {Injectable} from "injection-js";
import {User} from "../user/models/user.model";
import {Party} from "../user/models/party.model";
import {UnauthorizedError} from "./unauthorized.error";
import {AuthUser} from "./auth-user.interface";
import {config} from '../config';
import {addMs} from '../utils/date';
import {randomBytes} from 'crypto';
import {Sequelize} from 'sequelize-typescript';

@Injectable()
export class AuthenticationService {

  async authenticate(nameOrEmail: string, codeOrPassword: string): Promise<AuthUser> {
    // TODO: Unterscheidung bauen
    const user = await this.authenticateByNameAndCode(nameOrEmail, codeOrPassword);
    return this.convertUserToAuthUser(user);
  }

  createJWToken(payload: {user: AuthUser; [key: string]: any}): string {
    const {secret, issuer, expiresIn} = config.auth.jwt;
    return jwt.sign({...payload}, secret, {issuer, expiresIn});
  }

  createCSRFToken() {
    const BYTES = 32;
    return randomBytes(BYTES).toString('hex');
  }

  getUserFromJWTPayload(payload: { user: AuthUser }): AuthUser {
    return payload.user;
  }

  private async authenticateByNameAndCode(name: string, code: string): Promise<User> {
    if (name && code) {
      const user = await User.unscoped().findOne({
        include: [{
          model: Party.unscoped(),
        }],
        where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', name)) as any
      });

      if (user && !user.isLocked()) {
        if (user.party.code === code) {
          user.failedAuthAttempts = 0;
          // no need to wait on the completion
          user.save();
          return user;
        } else {
          await this.processFailedAttempts(user);
        }
      }
    }
    throw new UnauthorizedError();
  }

  private convertUserToAuthUser({id, partyId, name, scopes}: User): AuthUser {
    return {id, partyId, name, scopes};
  }

  private async processFailedAttempts(user: User) {
    // add one more failed attempt
    user.failedAuthAttempts = (user.failedAuthAttempts || 0) + 1;
    // if failed attempt is equal to or greater than max attempts
    if (user.failedAuthAttempts >= config.auth.maxFailedAttempts) {
      // lock account
      user.lockedUntil = addMs(new Date(), config.auth.lockingTime);
      user.failedAuthAttempts = 0;
    }
    await user.save();
  }

}
