import "mocha";
import { User } from "../../data/entity/User.entity";
import { getUser, setUser } from "../../data/datasource/User.datasource";
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
  it("Returns error 'Cannot set user without firstName'", async () => {
    let user = new User();
    user.id = 123;
    try {
      await setUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("Cannot set user without firstName");
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should not save user without id", () => {
  it("Returns error 'Cannot set user without id'", async () => {
    let user = new User();
    user.firstName = "Aragorn";
    try {
      await setUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("Cannot set user without id");
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should not save user with same id", () => {
  it("Returns error 'User already set in database'", async () => {
    await setUser(fakeUser());
    try {
      await setUser(fakeUser());
    } catch (error) {
      expect(error.message).to.be.eq("User already set in database");
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should return a true when the user is registered in database", () => {
  it("Returns true", async () => {
    setUser(fakeUser()).then((result) => {
      expect(result).to.equal(true);
    });
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

describe("Should return message 'user not found'", () => {
  it("Returns message 'user not found'", async () => {
    try {
      await getUser(12345);
    } catch (error) {
      expect(error.message).to.be.eq("User not found");
      return;
    }
    expect.fail("Should have thrown error");
  });
});
