import "mocha";
import { createConnection, getConnection, getConnectionOptions } from "typeorm";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { UserSubscription } from "../../domain/user-subscription.use-case";
import { UserUnsubscription } from "../../domain/user-unsubscription.use-case";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Fakes } from "../fixtures/fakes.helper";

describe("Subscribe user", () => {
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
    userSubscriptionUseCase = new UserSubscription();
    userUnsubscriptionUseCase = new UserUnsubscription();
  });

  after(() => {
    const connection = getConnection();
    connection.close();
  });

  beforeEach(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  it("Should save user when it subscribes first time", async () => {
    const user = fakes.getUser();

    await userSubscriptionUseCase.subscribeUser(user);

    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved.telegramId).to.be.eq(user.telegramId);
    expect(saved.firstName).to.be.eq(user.firstName);
  });

  it("Should save user as active true when subscribing", async () => {
    const user = fakes.getUser();

    await userSubscriptionUseCase.subscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved.isActive).to.be.true;
  });

  it("Should return 'User already subscribed when user is already saved and active", async () => {
    const user = fakes.getUser();

    await userSubscriptionUseCase.subscribeUser(user);

    expect(userSubscriptionUseCase.subscribeUser(user)).to.eventually.throw(
      new Error("User already subscribed")
    );
  });
});
