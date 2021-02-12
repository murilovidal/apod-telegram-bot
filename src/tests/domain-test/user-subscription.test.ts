import { expect } from "chai";
import "mocha";
import { User } from "../../data/entity/user.entity";
import { UserSubscription } from "../../domain/user-subscription.use-case";

const userSubscription = new UserSubscription();
describe("Subscribe user", () => {
  it("Should return a true when the user is subscribed", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    expect(await userSubscription.subscribeUser(user)).to.be.true;
  });

  it("Should return error when subscribing the user fails", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.id = 123;
    try {
      return await userSubscription.subscribeUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("Failed to subscribe user.");
    }
  });

  it("Should return 'User already registered", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123;
    await userSubscription.subscribeUser(user);
    try {
      await userSubscription.subscribeUser(user);
    } catch (error) {
      expect(error);
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
