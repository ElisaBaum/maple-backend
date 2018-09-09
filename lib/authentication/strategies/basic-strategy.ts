import {BasicStrategy} from "@baum/passport-http";
import {AuthenticationService} from "../authentication.service";

overrideBasicStrategyChallenge();

export function basicStrategy(authService: AuthenticationService): any {
  return new BasicStrategy(async (nameOrEmail, codeOrPassword, done) => {
    try {
      const user = await authService.authenticate(nameOrEmail, codeOrPassword);
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
}

/**
 * Prevents browser from opening native login popup
 * see https://stackoverflow.com/a/17473627
 */
function overrideBasicStrategyChallenge() {
  const challengeKey = '_challenge';
  const orig = BasicStrategy.prototype[challengeKey];
  BasicStrategy.prototype[challengeKey] = function() {
    return orig.call(this).replace('Basic', 'xBasic');
  };
}
