import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";
import { BotMessage } from "../web/bot.message";

export class UserUnsubscription {
  private userDatasource: UserDatasource;

  constructor() {
    this.userDatasource = new UserDatasource();
  }

  public async unsubscribeUser(user: User): Promise<string> {
    try {
      await this.userDatasource.deleteUser(user);
      return BotMessage.UnsubscriptionSuccessful;
    } catch (error) {
      console.error(error);
      return BotMessage.SubscriptionUnsuccessful;
    }
  }
}
