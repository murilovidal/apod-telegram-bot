import "mocha";
import { getConnection } from "typeorm";
import { ApodDatasource } from "../../data/datasource/apod.datasource";
import { expect } from "chai";
import { Apod } from "../../data/entity/apod.entity";

const apodDatasource = new ApodDatasource();
function fakeApod() {
  let apod = new Apod();
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
    let apod = new Apod();
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
    let apod = new Apod();
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
    let apod = new Apod();
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
    let apod = new Apod();
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
    let apod = fakeApod();
    await apodDatasource.setApod(apod);
    expect(await apodDatasource.getApod()).to.be.instanceOf(Apod);
  });

  it("Should save apod title", async () => {
    let apod = fakeApod();
    await apodDatasource.setApod(apod);
    let saved = await apodDatasource.getApod();
    expect(saved!.title).to.be.eq(apod.title);
  });

  it("Should save apod explanation", async () => {
    let apod = fakeApod();
    await apodDatasource.setApod(apod);
    let saved = await apodDatasource.getApod();
    expect(saved!.explanation).to.be.eq(apod.explanation);
  });

  it("Should save apod url", async () => {
    let apod = fakeApod();
    await apodDatasource.setApod(apod);
    let saved = await apodDatasource.getApod();
    expect(saved!.url).to.be.eq(apod.url);
  });

  it("Should save apod media_type", async () => {
    let apod = fakeApod();
    await apodDatasource.setApod(apod);
    let saved = await apodDatasource.getApod();
    expect(saved!.mediaType).to.be.eq(apod.mediaType);
  });
});
