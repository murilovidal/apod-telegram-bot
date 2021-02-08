import {
  subscribeUser,
  unsubscribeUser,
} from "../../domain/subscribe-user.use-case";
import { expect } from "chai";
import "mocha";
import { User } from "../../data/entity/User.entity";

describe("subscribe-user || Should return a true when the user is subscribed", () => {
  it("Returns true", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    expect(await subscribeUser(user)).to.be.true;
  });
});

describe("subscribe-user || Should return error when subscribing the user fails", () => {
  it("Returns error", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.id = 123;
    try {
      return await subscribeUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("Failed to subscribe user.");
    }
  });
});

describe("subscribe-user || Should return 'User already registered'", () => {
  it("Returns message", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123;
    await subscribeUser(user);
    try {
      await subscribeUser(user);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown an error");
  });
});

describe("subscribe-user || Should return a true when the user is unsubscribed", () => {
  it("Returns true", async () => {
    let user = new User();
    user.firstName = "Rorschasch";
    user.id = 123445;
    await subscribeUser(user);
    expect(await unsubscribeUser(user)).to.be.true;
  });
});

describe("subscribe-user || Should return error when unsubscribing the user fails", () => {
  it("Returns error", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.id = 123;
    await subscribeUser(user);
    try {
      return await unsubscribeUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("Failed to unsubscribe user.");
    }
  });
});
