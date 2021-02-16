import { expect } from "chai";
import "mocha";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { User } from "../../data/entity/user.entity";
import { UserSubscription } from "../../domain/user-subscription.use-case";

const userDatasource = new UserDatasource();
const userSubscription = new UserSubscription();

describe("Subscribe user", () => {
  it("Should return a true when the user is subscribed", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    expect(await userSubscription.subscribeUser(user)).to.be.true;
  });

  it("Should save user id", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    await userSubscription.subscribeUser(user);
    let saved = await userDatasource.findUserById(user.id);
    expect(saved!.id).to.be.eq(user.id);
  });

  it("Should save user firstName", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    await userSubscription.subscribeUser(user);
    let saved = await userDatasource.findUserById(user.id);
    expect(saved!.firstName).to.be.eq(user.firstName);
  });

  it("Should save user as active true when subscribing", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    await userSubscription.subscribeUser(user);
    let saved = await userDatasource.findUserById(user.id);
    expect(saved!.isActive).to.be.true;
  });

  it("Should save user as active false when unsubscribing", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    await userSubscription.subscribeUser(user);
    await userSubscription.unsubscribeUser(user);
    let saved = await userDatasource.findUserById(user.id);
    expect(saved!.isActive).to.be.false;
  });

  it("Should return 'User already subscribed", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123;
    await userSubscription.subscribeUser(user);
    try {
      await userSubscription.subscribeUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("User already subscribed.");
      return;
    }
    expect.fail("Should have thrown an error");
  });

  it("Should return a true when the user is unsubscribed", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    await userSubscription.subscribeUser(user);
    expect(await userSubscription.unsubscribeUser(user)).to.be.true;
  });

  it("Should return error when unsubscribing the user fails", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.id = 123;
    await userSubscription.subscribeUser(user);
    try {
      return await userSubscription.unsubscribeUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("Error: Failed to unsubscribe user.");
    }
  });
});
