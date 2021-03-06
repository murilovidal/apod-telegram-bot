import "mocha";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { UserUnsubscription } from "../../domain/user-unsubscription.use-case";
import { UserSubscription } from "../../domain/user-subscription.use-case";
import { Connection, getConnection } from "typeorm";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { BotMessage } from "../../web/bot.message";
import { Fakes } from "../fixtures/fakes.helper";
import { DbConnectionHelper } from "../../helper/db-connection-helper";

describe("Unsubscribe user", () => {
  chai.use(chaiAsPromised);
  const dbConnectionHelper = new DbConnectionHelper();
  let userDatasource: UserDatasource;
  let userSubscriptionUseCase: UserSubscription;
  let userUnsubscriptionUseCase: UserUnsubscription;
  let fakes: Fakes;

  before(async () => {
    fakes = new Fakes();
    let connection: Connection;
    try {
      connection = getConnection();
    } catch (error) {
      connection = await dbConnectionHelper.makeConnection();
    }

    userDatasource = new UserDatasource();
    userUnsubscriptionUseCase = new UserUnsubscription();
    userSubscriptionUseCase = new UserSubscription();
  });

  beforeEach(async () => {
    const connection = getConnection();
    await dbConnectionHelper.clear(connection);
  });

  it("Should save user as active false when unsubscribing", async () => {
    const user = fakes.getUser();
    await userSubscriptionUseCase.subscribeUser(user);

    await userUnsubscriptionUseCase.unsubscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved!.isActive).to.be.false;
  });

  it("Should return a true when the user is unsubscribed", async () => {
    const user = fakes.getUser();

    await userSubscriptionUseCase.subscribeUser(user);

    expect(userUnsubscriptionUseCase.unsubscribeUser(user)).to.eventually.throw(
      new Error(BotMessage.UnsubscriptionSuccessful)
    );
  });

  it("Should return error when unsubscribing the user fails", async () => {
    const user = fakes.getUser();

    await userSubscriptionUseCase.subscribeUser(user);
    user.telegramId = 321;

    expect(userUnsubscriptionUseCase.unsubscribeUser(user)).to.eventually.throw(
      new Error("Failed to unsubscribe user.")
    );
  });
});
