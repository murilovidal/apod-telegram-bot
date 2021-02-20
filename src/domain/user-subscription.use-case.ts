import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";
import { TelegramService } from "../service/telegram.service";
import { BotMessage } from "../web/bot.message";
import { ErrorMessage } from "./error.message";

export class UserSubscription {
  private userDatasource: UserDatasource;
  private telegramService: TelegramService;

  constructor() {
    this.telegramService = new TelegramService();
    this.userDatasource = new UserDatasource();
  }

  public async subscribeUser(user: User) {
    try {
      const newUser = await this.userDatasource.findUserById(user.telegramId);
      if (newUser.isActive) {
        this.telegramService.sendTextMessageToUser(
          newUser,
          BotMessage.AlreadySubscribed
        );
      } else if (!newUser.isActive) {
        await this.userDatasource.activateUser(newUser);
        this.telegramService.sendTextMessageToUser(
          newUser,
          BotMessage.SubscriptionSuccessful
        );
      }
    } catch (error) {
      if (error == ErrorMessage.UserNotFound) {
        await this.userDatasource.setUser(user);
        this.telegramService.sendTextMessageToUser(
          user,
          BotMessage.SubscriptionSuccessful
        );
      }
      console.error(error);
      this.telegramService.sendTextMessageToUser(
        user,
        BotMessage.SubscriptionFailed
      );
    }
  }

  public async getAllSubscribers() {
    try {
      var users = await this.userDatasource.getAll();
    } catch (error) {
      console.error(error);
      throw new Error("Query failed.");
    }

    return users;
  }
}
