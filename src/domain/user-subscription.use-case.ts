import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";
import { BotMessage } from "../web/bot.message";
import { ErrorMessage } from "./error.message";

export class UserSubscription {
  private userDatasource: UserDatasource;

  constructor() {
    this.userDatasource = new UserDatasource();
  }

  public async subscribeUser(user: User): Promise<string> {
    try {
      const newUser = await this.userDatasource.findUserById(user.telegramId);
      if (newUser.isActive) {
        return BotMessage.AlreadySubscribed;
      } else {
        await this.userDatasource.activateUser(newUser);
        return BotMessage.SubscriptionSuccessful;
      }
    } catch (error) {
      console.error(error.message);
      if (error.message == ErrorMessage.UserNotFound) {
        await this.userDatasource.setUser(user);

        return BotMessage.SubscriptionSuccessful;
      } else {
        console.error(error);

        return BotMessage.SubscriptionFailed;
      }
    }
  }
}
