import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";
import { BotMessage } from "../web/bot.message";
import { TelegramService } from "../service/telegram.service";
export class UserUnsubscription {
  private telegramService: TelegramService;
  private userDatasource: UserDatasource;

  constructor() {
    this.userDatasource = new UserDatasource();
    this.telegramService = new TelegramService();
  }

  public async unsubscribeUser(user: User) {
    try {
      await this.userDatasource.deleteUser(user);
      await this.telegramService.sendTextMessageToUser(
        user,
        BotMessage.UnsubscriptionSuccessful
      );
    } catch (error) {
      console.error(error);
      await this.telegramService.sendTextMessageToUser(
        user,
        BotMessage.SubscriptionUnsuccessful
      );
    }
  }
}
