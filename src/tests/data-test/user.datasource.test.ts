import "mocha";
import { User } from "../../data/entity/user.entity";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { createConnection, getConnection } from "typeorm";
import { expect } from "chai";

const userDatasource = new UserDatasource();

function fakeUser() {
  let user = new User();
  user.id = 1984;
  user.firstName = "Beeblebrox";
  return user;
}

before(async () => {
  const connection = await createConnection();
  await connection.dropDatabase();
  await connection.synchronize();
  await userDatasource.setUser(fakeUser());
  return connection;
});

beforeEach(async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.synchronize();
});

describe("User datasource", () => {
  it("Should not save user without firstname", async () => {
    var user = new User();
    user.id = 123;
    try {
      await userDatasource.setUser(user);
    } catch (error) {
      expect(error.message).to.be.eq(
        'null value in column "firstName" violates not-null constraint'
      );
      return;
    }
    expect.fail(
      'Should have thrown error: null value in column "firstName" violates not-null constraint'
    );
  });

  it("Should not save user without id", async () => {
    let user = new User();
    user.firstName = "Aragorn";
    try {
      await userDatasource.setUser(user);
    } catch (error) {
      expect(error.message).to.be.eq(
        'null value in column "id" violates not-null constraint'
      );
      return;
    }
    expect.fail(
      'Should have thrown error: null value in column "id" violates not-null constraint'
    );
  });

  it("Should not save user with same id", async () => {
    var user = fakeUser();
    await userDatasource.setUser(user);
    try {
      await userDatasource.setUser(user);
    } catch (error) {
      expect(error.message).to.be.eq(
        'duplicate key value violates unique constraint "PK_cace4a159ff9f2512dd42373760"'
      );
      return;
    }
    expect.fail(
      'Should have thrown error: duplicate key value violates unique constraint "PK_cace4a159ff9f2512dd42373760"'
    );
  });

  it("Should return a user searched by id", async () => {
    await userDatasource.setUser(fakeUser());
    expect(await userDatasource.findUserById(1984)).to.be.instanceOf(User);
  });

  it("Should return a user searched by name", async () => {
    userDatasource.findUserByName("Beeblebrox").then((result) => {
      expect(result).to.equal(User);
    });
  });

  it("Should delete a user", async () => {
    let user = fakeUser();
    await userDatasource.setUser(user);
    expect((await userDatasource.deleteUser(user)).affected).to.be.eq(1);
  });

  it("Should save user id", async () => {
    let user = fakeUser();
    await userDatasource.setUser(user);
    let savedUser = await userDatasource.findUserById(user.id);
    expect(savedUser.id).to.be.eq(user.id);
  });

  it("Should save user firstName", async () => {
    let user = fakeUser();
    await userDatasource.setUser(user);
    let savedUser = await userDatasource.findUserById(user.id);
    expect(savedUser.firstName).to.be.eq(user.firstName);
  });
});
