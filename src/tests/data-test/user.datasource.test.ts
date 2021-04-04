import "mocha";
import { User } from "../../data/entity/user.entity";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { Connection, getConnection } from "typeorm";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Fakes } from "../fixtures/fakes.helper";
import { DbConnectionHelper } from "../../helper/db-connection-helper";

describe("User datasource", () => {
  chai.use(chaiAsPromised);
  let userDatasource: UserDatasource;
  let fakes: Fakes;
  const dbConnectionHelper = new DbConnectionHelper();

  before(async () => {
    fakes = new Fakes();
    let connection: Connection;
    try {
      connection = getConnection();
    } catch (error) {
      connection = await dbConnectionHelper.makeConnection();
    }
    userDatasource = new UserDatasource();
  });

  beforeEach(async () => {
    const connection = getConnection();
    await dbConnectionHelper.clear(connection);
  });

  it("Should not save user without firstname", () => {
    const user = new User();
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
    const user = fakes.getUser();
    await userDatasource.setUser(user);

    expect(userDatasource.setUser(user)).to.eventually.throw(
      new Error(
        'duplicate key value violates unique constraint "PK_c1ed111fba8a34b812d11f42352"'
      )
    );
  });

  it("Should return a user searched by id", async () => {
    const fakeUser = fakes.getUser();
    await userDatasource.setUser(fakeUser);

    const result = await userDatasource.findUserById(fakeUser.telegramId);
    expect(result.firstName).to.be.eq(fakeUser.firstName);
    expect(result.telegramId).to.be.eq(fakeUser.telegramId);
  });

  it("Should return a user searched by name", async () => {
    const user = fakes.getUser();
    await userDatasource.setUser(user);

    const result = await userDatasource.findUserByName(user.firstName);

    expect(result.telegramId).to.be.equal(user.telegramId);
    expect(result.firstName).to.be.equal(user.firstName);
  });

  it("Should delete a user", async () => {
    const user = fakes.getUser();

    await userDatasource.setUser(user);

    expect((await userDatasource.deleteUser(user)).affected).to.be.eq(1);
  });

  it("Should save user sucessfully", async () => {
    const user = fakes.getUser();
    await userDatasource.setUser(user);

    const savedUser = await userDatasource.findUserById(user.telegramId);

    expect(savedUser.telegramId).to.be.eq(user.telegramId);
    expect(savedUser.firstName).to.be.eq(user.firstName);
  });
});
