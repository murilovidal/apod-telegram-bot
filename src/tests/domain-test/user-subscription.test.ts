import "mocha";
import { getConnection } from "typeorm";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { User } from "../../data/entity/user.entity";
import { UserSubscription } from "../../domain/user-subscription.use-case";
import { UserUnsubscription } from "../../domain/user-unsubscription.use-case";

describe("Subscribe user", () => {
  const chai = require("chai");
  const chaiAsPromised = require("chai-as-promised");
  chai.use(chaiAsPromised);
  const expect = chai.expect;
  let userDatasource: UserDatasource;
  let userSubscriptionUseCase: UserSubscription;
  let userUnsubscriptionUseCase: UserUnsubscription;

  before(() => {
    userDatasource = new UserDatasource();
    userSubscriptionUseCase = new UserSubscription();
    userUnsubscriptionUseCase = new UserUnsubscription();
  });

  beforeEach(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  it("Should return a true when the user is subscribed", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    expect(await userSubscriptionUseCase.subscribeUser(user)).to.be.true;
  });

  it("Should save user when it subscribes first time", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    await userSubscriptionUseCase.subscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved!.telegramId).to.be.eq(user.telegramId);
    expect(saved!.firstName).to.be.eq(user.firstName);
  });

  it("Should save user as active true when subscribing", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    await userSubscriptionUseCase.subscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved.isActive).to.be.true;
  });

  it("Should return 'User already subscribed", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123;

    await userSubscriptionUseCase.subscribeUser(user);

    expect(userSubscriptionUseCase.subscribeUser(user)).to.eventually.throw(
      new Error("User already subscribed")
    );
  });
});