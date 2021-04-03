import "mocha";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { UserUnsubscription } from "../../domain/user-unsubscription.use-case";
import { UserSubscription } from "../../domain/user-subscription.use-case";
import { createConnection, getConnection } from "typeorm";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { BotMessage } from "../../web/bot.message";
import { Fakes } from "../fixtures/fakes.helper";

describe("Unsubscribe user", () => {
  chai.use(chaiAsPromised);
  let userDatasource: UserDatasource;
  let userSubscriptionUseCase: UserSubscription;
  let userUnsubscriptionUseCase: UserUnsubscription;
  let fakes: Fakes;

  before(async () => {
    const connection = await createConnection({
      name: "default",
      type: "postgres",
      host: "localhost",
      port: 33300,
      username: "apod_test",
      password: "apod_test",
      database: "apod_test",
      entities: ["src/data/entity/*.entity.ts"],
    });

    fakes = new Fakes();
    userDatasource = new UserDatasource();
    userUnsubscriptionUseCase = new UserUnsubscription();
    userSubscriptionUseCase = new UserSubscription();
  });

  beforeEach(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  after(() => {
    const connection = getConnection();
    connection.close();
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
