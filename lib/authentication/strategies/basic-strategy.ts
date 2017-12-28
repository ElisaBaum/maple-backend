import {BasicStrategy} from "passport-http";
import {AuthenticationService} from "../AuthenticationService";

export function basicStrategy(authService: AuthenticationService): any {
  return new BasicStrategy(async (nameOrEmail, codeOrPassword, done) => {
    try {
      const user = await authService.authenticate(nameOrEmail, codeOrPassword);
      done(null, user);
    } catch (e) {
      done(e);
    }
  })
}
