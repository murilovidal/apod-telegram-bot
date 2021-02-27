import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";
import { BotService } from "../service/bot.service";
import { BotMessage } from "../web/bot.message";
import { ErrorMessage } from "./error.message";
import { SendTelegramMessage } from "./send-telegram-message.use-case";

export class UserSubscription {
  private userDatasource: UserDatasource;
  private sendTelegramMessageUseCase: SendTelegramMessage;

  constructor() {
    this.sendTelegramMessageUseCase = new SendTelegramMessage();
    this.userDatasource = new UserDatasource();
  }

  public async subscribeUser(user: User): Promise<void> {
    try {
      const newUser = await this.userDatasource.findUserById(user.telegramId);
      if (newUser.isActive) {
        this.sendTelegramMessageUseCase.sendTextMessageToUser(
          newUser,
          BotMessage.AlreadySubscribed
        );
      } else if (!newUser.isActive) {
        await this.userDatasource.activateUser(newUser);
        this.sendTelegramMessageUseCase.sendTextMessageToUser(
          newUser,
          BotMessage.SubscriptionSuccessful
        );
      }
    } catch (error) {
      if (error == ErrorMessage.UserNotFound) {
        await this.userDatasource.setUser(user);
        this.sendTelegramMessageUseCase.sendTextMessageToUser(
          user,
          BotMessage.SubscriptionSuccessful
        );
      }
      console.error(error);
      this.sendTelegramMessageUseCase.sendTextMessageToUser(
        user,
        BotMessage.SubscriptionFailed
      );
    }
  }

  public async getAllSubscribers(): Promise<User[]> {
    try {
      var users = await this.userDatasource.getAll();
    } catch (error) {
      console.error(error);
      throw new Error("Query failed.");
    }

    return users;
  }
}
