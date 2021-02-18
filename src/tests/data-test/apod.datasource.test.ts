import "mocha";
import { getConnection } from "typeorm";
import { ApodDatasource } from "../../data/datasource/apod.datasource";
import { expect } from "chai";
import { Apod } from "../../data/entity/apod.entity";

const apodDatasource = new ApodDatasource();
function fakeApod() {
  const apod = new Apod();
  apod.url = "www.apod.com";
  apod.title = "Death Star";
  apod.explanation = "That's no moon.";
  apod.mediaType = "image";
  return apod;
}

beforeEach(async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.synchronize();
});

describe("Apod datasource ", async () => {
  it("Should not save apod without url", async () => {
    const apod = new Apod();
    apod.title = "Death Star";
    apod.explanation = "That's no moon.";
    apod.mediaType = "image";

    try {
      await apodDatasource.setApod(apod);
    } catch (error) {
      expect(error.message).to.be.eq(
        'null value in column "url" violates not-null constraint'
      );
      return;
    }

    expect.fail(
      'Should have thrown error:null value in column "id" violates not-null constraint'
    );
  });

  it("Should not save apod without title", async () => {
    const apod = new Apod();
    apod.url = "www.apod.com";
    apod.explanation = "That's no moon.";
    apod.mediaType = "image";

    try {
      await apodDatasource.setApod(apod);
    } catch (error) {
      expect(error.message).to.be.eq(
        'null value in column "title" violates not-null constraint'
      );
      return;
    }

    expect.fail(
      'Should have thrown error:null value in column "title" violates not-null constraint'
    );
  });

  it("Should not save apod without explanation", async () => {
    const apod = new Apod();
    apod.url = "www.BlueDeathStar.com";
    apod.title = "Blue Death Star";
    apod.mediaType = "image";

    try {
      await apodDatasource.setApod(apod);
    } catch (error) {
      expect(error.message).to.be.eq(
        'null value in column "explanation" violates not-null constraint'
      );
      return;
    }

    expect.fail(
      'Should have thrown error:null value in column "explanation" violates not-null constraint'
    );
  });

  it("Should not save apod without media type", async () => {
    const apod = new Apod();
    apod.url = "www.BlueDeathStar.com";
    apod.title = "Blue Death Star";
    apod.explanation = "That's no moon.";

    try {
      await apodDatasource.setApod(apod);
    } catch (error) {
      expect(error.message).to.be.eq(
        'null value in column "media_type" violates not-null constraint'
      );
      return;
    }

    expect.fail(
      'Should have thrown error:null value in column "media_type" violates not-null constraint'
    );
  });

  it("Should return the latest instance of apod", async () => {
    const apod = fakeApod();
    await apodDatasource.setApod(apod);

    expect(await apodDatasource.getApod()).to.be.instanceOf(Apod);
  });

  it("Should save apod successfuly", async () => {
    const apod = fakeApod();
    await apodDatasource.setApod(apod);

    const saved = await apodDatasource.getApod();

    expect(saved!.title).to.be.eq(apod.title);
    expect(saved!.explanation).to.be.eq(apod.explanation);
    expect(saved!.url).to.be.eq(apod.url);
    expect(saved!.mediaType).to.be.eq(apod.mediaType);
  });
});
