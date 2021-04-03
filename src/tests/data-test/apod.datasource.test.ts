import "mocha";
import { createConnection, getConnection } from "typeorm";
import { ApodDatasource } from "../../data/datasource/apod.datasource";
import { Apod } from "../../data/entity/apod.entity";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import axios from "axios";
import ApodFixture from "../fixtures/apod.fixture.json";
import { Fakes } from "../fixtures/fakes.helper";

describe("Apod datasource ", async () => {
  chai.use(chaiAsPromised);
  let apodDatasource: ApodDatasource;
  let fakes: Fakes;

  before(async () => {
    fakes = new Fakes();

    const connection = await createConnection({
      name: "default",
      type: "postgres",
      host: "localhost",
      port: 33300,
      username: "apod_test",
      password: "apod_test",
      database: "apod_test",
      entities: ["src/data/entity/*.entity.ts"],
    });

    await connection.dropDatabase();
    await connection.synchronize();
    apodDatasource = new ApodDatasource();
  });

  after(() => {
    const connection = getConnection("default");
    connection.close();
  });

  beforeEach(async () => {
    sinon.restore();
    const connection = getConnection("default");
    await connection.dropDatabase();
    await connection.synchronize();
  });

  it("Should not save apod without url", async () => {
    const apod = fakes.getApod();
    apod.url = new Apod().url;

    expect(apodDatasource.setApod(apod)).to.eventually.throw(
      new Error('null value in column "url" violates not-null constraint')
    );
  });

  it("Should not save apod without title", async () => {
    const apod = fakes.getApod();
    apod.title = new Apod().title;

    expect(apodDatasource.setApod(apod)).to.eventually.throw(
      new Error('null value in column "title" violates not-null constraint')
    );
  });

  it("Should not save apod without explanation", async () => {
    const apod = fakes.getApod();
    apod.explanation = new Apod().explanation;

    expect(apodDatasource.setApod(apod)).to.eventually.throw(
      new Error(
        'null value in column "explanation" violates not-null constraint'
      )
    );
  });

  it("Should not save apod without media type", async () => {
    const apod = fakes.getApod();

    apod.mediaType = new Apod().mediaType;

    expect(apodDatasource.setApod(apod)).to.eventually.throw(
      new Error(
        'null value in column "media_type" violates not-null constraint'
      )
    );
  });

  it("Should return the latest instance of apod", async () => {
    sinon.stub(axios, "get").callsFake(async () => ApodFixture);

    const apod = await apodDatasource.getApod();

    expect(apod.url).to.be.eq(ApodFixture.data.url);
    expect(apod.title).to.be.eq(ApodFixture.data.title);
    expect(apod.mediaType).to.be.eq(ApodFixture.data.media_type);
    expect(apod.explanation).to.be.eq(ApodFixture.data.explanation);
  });

  it("Should save apod successfuly", async () => {
    const apod = fakes.getApod();
    await apodDatasource.setApod(apod);

    const saved = await apodDatasource.getApod();

    expect(saved!.title).to.be.eq(apod.title);
    expect(saved!.explanation).to.be.eq(apod.explanation);
    expect(saved!.url).to.be.eq(apod.url);
    expect(saved!.mediaType).to.be.eq(apod.mediaType);
  });

  it("Should get a complete random apod", async () => {
    sinon.stub(axios, "get").callsFake(async () => ApodFixture);

    const apod = await apodDatasource.getRandomApod();

    expect(apod.url).to.be.eq(ApodFixture.data.url);
    expect(apod.title).to.be.eq(ApodFixture.data.title);
    expect(apod.mediaType).to.be.eq(ApodFixture.data.media_type);
    expect(apod.explanation).to.be.eq(ApodFixture.data.explanation);
  });
});
