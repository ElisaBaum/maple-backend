import * as jwt from 'jsonwebtoken';
import {Inject} from "di-typescript";
import {User} from "../user/models/User";
import {Party} from "../user/models/Party";
import {UnauthorizedError} from "./UnauthorizedError";
import {AuthUser} from "./AuthUser";

@Inject
export class AuthenticationService {

  async authenticate(nameOrEmail: string, codeOrPassword: string): Promise<AuthUser> {
    // TODO: Unterscheidung bauen
    const user = await this.authenticateByNameAndCode(nameOrEmail, codeOrPassword);
    return this.convertUserToAuthUser(user);
  }

  createJWToken(user: AuthUser): string {
    return jwt.sign({user},
      process.env.JWT_SECRET as string,
      {issuer: process.env.JWT_ISSUER, expiresIn: process.env.JWT_EXP});
  }

  getUserFromJWTPayload(payload: {user: AuthUser}): AuthUser {
    return payload.user;
  }

  private async authenticateByNameAndCode(name: string, code: string): Promise<User> {
    if (name && code) {
      const user = await User.findOne<User>({
        include: [{
          model: Party,
          where: {code}
        }],
        where: {name}
      });

      if (user) return user;
    }

    throw new UnauthorizedError();
  }

  private convertUserToAuthUser({id, partyId, name, scopes}: User): AuthUser {
    return {id, partyId, name, scopes};
  }

}
