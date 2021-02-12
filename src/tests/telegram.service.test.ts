import { expect, use } from "chai";
import "mocha";
import { User } from "../data/entity/user.entity";
import { TelegramService } from "../domain/telegram.service";
import { UserSubscription } from "../domain/user-subscription.use-case";

const userSubscription = new UserSubscription();
const telegramService = new TelegramService();

describe("Bot service", () => {
  it("Should subscribe user", () => {
    let user = new User();
    user.firstName = "Boromir";
    user.id = 123;
  });
});
