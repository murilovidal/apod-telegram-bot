import "mocha";
import { getConnection } from "typeorm";
import { getApod, setApod } from "../../data/datasource/Apod.datasource";
import { expect } from "chai";
import { Apod } from "../../data/entity/Apod.entity";

function fakeApod() {
  let apod = new Apod();
  apod.url = "www.apod.com";
  apod.title = "Death Star";
  apod.explanation = "That's no moon.";
  apod.media_type = "image";
  return apod;
}

before(async () => {});

beforeEach(async () => {});

afterEach(async () => {
  const connection = await getConnection();
  await connection.dropDatabase();
  await connection.synchronize();
});

describe("Should not save apod without url", () => {
  it("Returns error 'Cannot set apod without url'", async () => {
    let apod = new Apod();
    apod.title = "Death Star";
    apod.explanation = "That's no moon.";
    apod.media_type = "image";
    try {
      await setApod(apod);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should not save apod without title", () => {
  it("Returns error 'Cannot set apod without title'", async () => {
    let apod = new Apod();
    apod.url = "www.apod.com";
    apod.explanation = "That's no moon.";
    apod.media_type = "image";
    try {
      await setApod(apod);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});
describe("Should not save apod without explanation", () => {
  it("Returns error 'Cannot set apod without explanation'", async () => {
    let apod = new Apod();
    apod.title = "Blue Death Star";
    apod.media_type = "image";
    try {
      await setApod(apod);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});
describe("Should not save apod without media type", () => {
  it("Returns error 'Cannot set apod without media type'", async () => {
    let apod = new Apod();
    apod.title = "Blue Death Star";
    apod.explanation = "That's no moon.";
    try {
      await setApod(apod);
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});

describe("Should return a true when the apod is registered in database", () => {
  it("Returns true", async () => {
    setApod(fakeApod()).then((result) => {
      expect(result).to.equal(true);
    });
  });
});

describe("Should return the latest instance of apod", () => {
  it("Returns apod", async () => {
    let apod = fakeApod();
    await setApod(apod);
    expect(await getApod()).to.be.instanceOf(Apod);
  });
});

describe("Should return error when no apod is found'", () => {
  it("Returns error", async () => {
    try {
      await getApod();
    } catch (error) {
      expect(error);
      return;
    }
    expect.fail("Should have thrown error");
  });
});
