import "mocha";
import { User } from "../../data/entity/User.entity";
import {
  deleteUser,
  getUser,
  setUser,
} from "../../data/datasource/User.datasource";
import { createConnection, getConnection } from "typeorm";
import { expect } from "chai";

function fakeUser() {
  let user = new User();
  user.id = 1984;
  user.firstName = "Beeblebrox";
  return user;
}

before(async () => {
  const connection = await createConnection();
  await connection.synchronize();
  await setUser(fakeUser());
  return connection;
});

beforeEach(async () => {
  const connection = await getConnection();
});

afterEach(async () => {
  const connection = await getConnection();
  await connection.dropDatabase();
  await connection.synchronize();
});

describe("Should not save user without firstname", () => {
  it("Returns error", async () => {
    let user = new User();
    user.id = 123;
    try {
      await setUser(user);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should not save user without id", () => {
  it("Returns error", async () => {
    let user = new User();
    user.firstName = "Aragorn";
    try {
      await setUser(user);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should not save user with same id", () => {
  it("Returns error", async () => {
    await setUser(fakeUser());
    try {
      await setUser(fakeUser());
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should return a true when the user is registered in database", () => {
  it("Returns true", async () => {
    expect(await setUser(fakeUser())).to.be.true;
  });
});

describe("Should return a user searched by id", () => {
  it("Returns user", async () => {
    await setUser(fakeUser());
    expect(await getUser(1984)).to.be.instanceOf(User);
  });
});

describe("Should return a user searched by name", () => {
  it("Returns user", async () => {
    getUser("Beeblebrox").then((result) => {
      expect(result).to.equal(User);
    });
  });
});

describe("Should return error when user is not found", () => {
  it("Returns message error", async () => {
    try {
      await getUser(12345);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should delete a user", () => {
  it("Returns success", async () => {
    let user = fakeUser();
    await setUser(user);
    expect((await deleteUser(user)).affected).to.be.eq(1);
  });
});

describe("Should return error when failed to delete user", () => {
  it("Returns error", async () => {
    let user = fakeUser();
    user.id = 988;
    try {
      await deleteUser(user.id);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});
