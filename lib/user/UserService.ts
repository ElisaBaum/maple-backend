import {Party} from "./models/Party";
import {defaultAttributes, User} from "./models/User";
import {UserNotFoundError} from "./errors/UserNotFoundError";
import {MaxCompanionCountExceededError} from "./errors/MaxCompanionCountExceededError";
import {PartyNotFoundError} from "./errors/PartyNotFoundError";

export class UserService {

  async updateUserPartially(userId: number, partialUser: Partial<User>) {
    await User.update(partialUser, {
      where: {id: userId},
      fields: ['name', 'email', 'phone', 'accepted']
    })
  }

  async getParty(partyId: number) {
    return Party.findByPrimary(partyId, {
      include: [User]
    });
  }

  async createCompanion(partyId: number, partialUser: Partial<User> & {name: string}) {
    const party = await this.getParty(partyId);

    if (party) {
      if (party.users.length < party.maxPersonCount) {
        // todo: set scope?

        const newUser = new User({
          name: partialUser.name,
          partyId: partyId,
          accepted: true,
          relationKey: 'plus-one'
        });

        return (await newUser.save()).copy(defaultAttributes);
      }

      throw new MaxCompanionCountExceededError();
    }

    throw new PartyNotFoundError();
  }

  async updateCompanionPartially(partyId: number,
                                 companionId: number,
                                 partialUser: Partial<User> & {accepted: boolean}) {

    const user = await User.findByPrimary(companionId, {
      include: [{
        model: Party,
        where: {id: partyId},
        required: true,
      }]
    });

    if (user) {
      await user.update(partialUser, {
        fields: ['accepted']
      });
    } else {
      throw new UserNotFoundError();
    }
  }

}
