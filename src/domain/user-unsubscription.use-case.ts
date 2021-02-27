import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";
import { BotMessage } from "../web/bot.message";
import { SendTelegramMessage } from "./send-telegram-message.use-case";

export class UserUnsubscription {
  private sendTelegramMessageUseCase: SendTelegramMessage;
  private userDatasource: UserDatasource;

  constructor() {
    this.userDatasource = new UserDatasource();
    this.sendTelegramMessageUseCase = new SendTelegramMessage();
  }

  public async unsubscribeUser(user: User): Promise<void> {
    try {
      await this.userDatasource.deleteUser(user);
      await this.sendTelegramMessageUseCase.sendTextMessageToUser(
        user,
        BotMessage.UnsubscriptionSuccessful
      );
    } catch (error) {
      console.error(error);
      await this.sendTelegramMessageUseCase.sendTextMessageToUser(
        user,
        BotMessage.SubscriptionUnsuccessful
      );
    }
  }
}
