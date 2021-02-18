import "mocha";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { User } from "../../data/entity/user.entity";
import { UserUnsubscription } from "../../domain/user-unsubscription.use-case";
import { UserSubscription } from "../../domain/user-subscription.use-case";
import { getConnection } from "typeorm";

describe("Unsubscribe user", () => {
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  chai.use(chaiAsPromised);
  const expect = chai.expect;
  let userDatasource: UserDatasource;
  let userSubscriptionUseCase: UserSubscription;
  let userUnsubscriptionUseCase: UserUnsubscription;

  before(() => {
    userDatasource = new UserDatasource();
    userUnsubscriptionUseCase = new UserUnsubscription();
    userSubscriptionUseCase = new UserSubscription();
  });

  beforeEach(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  it("Should save user as active false when unsubscribing", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;
    await userSubscriptionUseCase.subscribeUser(user);

    await userUnsubscriptionUseCase.unsubscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved!.isActive).to.be.false;
  });

  it("Should return a true when the user is unsubscribed", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    await userSubscriptionUseCase.subscribeUser(user);

    expect(await userUnsubscriptionUseCase.unsubscribeUser(user)).to.be.true;
  });

  it("Should return error when unsubscribing the user fails", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123;

    await userSubscriptionUseCase.subscribeUser(user);
    user.telegramId = 321;

    expect(userUnsubscriptionUseCase.unsubscribeUser(user)).to.eventually.throw(
      new Error("Failed to unsubscribe user.")
    );
  });
});
