import {Party} from "./models/Party";
import {defaultAttributes, User} from "./models/User";
import {UserNotFoundError} from "./errors/UserNotFoundError";
import {MaxCompanionCountExceededError} from "./errors/MaxCompanionCountExceededError";
import {PartyNotFoundError} from "./errors/PartyNotFoundError";

export class UserService {

  async updateUserPartially(userId: number, user: any) {
    await User.update(user, {
      where: {id: userId},
      fields: ['name', 'email', 'phone', 'accepted']
    })
  }

  async createCompanion(userId: number, companion: any) {
    const user = await User.findByPrimary<User>(userId, {
      include: [{
        model: Party,
        include: [User]
      }]
    });

    if (user) {
      const {party} = user;

      if (party) {
        if (party.users.length < party.maxPersonCount) {
          const newUser = new User({
            name: companion.name,
            partyId: party.id,
            relationKey: 'plus-one'
          });

          return (await newUser.save()).copy(defaultAttributes);
        }

        throw new MaxCompanionCountExceededError();
      }

      throw new PartyNotFoundError();
    }

    throw new UserNotFoundError();
  }

  async updateCompanionPartially(userId: number, companionId: number, companion: any) {
    const user = await User.findByPrimary<User>(companionId, {
      include: [{
        model: Party,
        include: [{
          model: User,
          where: {id: userId}
        }]
      }]
    });

    if (user) {
      await user.update(companion, {
        fields: ['accepted']
      });
    } else {
      throw new UserNotFoundError();
    }
  }

}
