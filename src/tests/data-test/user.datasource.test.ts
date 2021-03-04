import "mocha";
import { User } from "../../data/entity/user.entity";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { getConnection } from "typeorm";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

function fakeUser() {
  const user = new User();
  user.telegramId = 1984;
  user.firstName = "Beeblebrox";
  return user;
}

describe("User datasource", () => {
  chai.use(chaiAsPromised);
  let userDatasource: UserDatasource;

  before(async () => {
    userDatasource = new UserDatasource();
    await userDatasource.setUser(fakeUser());
  });

  beforeEach(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  it("Should not save user without firstname", () => {
    var user = new User();
    user.telegramId = 123;

    expect(userDatasource.setUser(user)).to.eventually.throw(
      new Error(
        'null value in column "first_name" violates not-null constraint'
      )
    );
  });

  it("Should not save user without id", () => {
    const user = new User();
    user.firstName = "Aragorn";

    expect(userDatasource.setUser(user)).to.eventually.throw(
      new Error(
        'null value in column "telegram_id" violates not-null constraint'
      )
    );
  });

  it("Should not save user with same id", async () => {
    var user = fakeUser();
    await userDatasource.setUser(user);

    expect(userDatasource.setUser(user)).to.eventually.throw(
      new Error(
        'duplicate key value violates unique constraint "PK_c1ed111fba8a34b812d11f42352"'
      )
    );
  });

  it("Should return a user searched by id", async () => {
    await userDatasource.setUser(fakeUser());

    expect(await userDatasource.findUserById(1984)).to.be.instanceOf(User);
  });

  it("Should return a user searched by name", async () => {
    const user = fakeUser();
    await userDatasource.setUser(user);

    const result = await userDatasource.findUserByName(user.firstName);

    expect(result.telegramId).to.be.equal(user.telegramId);
  });

  it("Should delete a user", async () => {
    const user = fakeUser();

    await userDatasource.setUser(user);

    expect((await userDatasource.deleteUser(user)).affected).to.be.eq(1);
  });

  it("Should save user sucessfully", async () => {
    const user = fakeUser();
    await userDatasource.setUser(user);

    const savedUser = await userDatasource.findUserById(user.telegramId);

    expect(savedUser.telegramId).to.be.eq(user.telegramId);
    expect(savedUser.firstName).to.be.eq(user.firstName);
  });
});
