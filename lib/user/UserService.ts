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

  async getParty(partyId: number) {
    return Party.findByPrimary<Party>(partyId, {
      include: [User]
    });
  }

  async createCompanion(partyId: number, companion: any) {
    const party = await this.getParty(partyId);

    if (party) {
      if (party.users.length < party.maxPersonCount) {
        const newUser = new User({
          name: companion.name,
          partyId: partyId,
          relationKey: 'plus-one'
        });

        return (await newUser.save()).copy(defaultAttributes);
      }

      throw new MaxCompanionCountExceededError();
    }

    throw new PartyNotFoundError();
  }

  async updateCompanionPartially(partyId: number, companionId: number, companion: any) {
    const user = await User.findByPrimary<User>(companionId, {
      include: [{
        model: Party,
        where: {id: partyId},
        required: true,
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
