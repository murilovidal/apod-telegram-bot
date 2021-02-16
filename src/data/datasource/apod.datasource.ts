import { getConnection, UpdateResult } from "typeorm";
import { Apod } from "../entity/apod.entity";
import { EnvService } from "../../domain/env-service";
const axios = require("axios");

const envService = new EnvService();

export class ApodDatasource {
  URL_API: string;
  API_KEY: string;
  URL_RANDOM: string;

  constructor() {
    this.URL_API = envService.URL_API;
    this.API_KEY = envService.API_KEY;
    this.URL_RANDOM = envService.URL_RANDOM;
  }

  public async setApod(apod: Apod): Promise<Apod> {
    const connection = getConnection();
    const repository = connection.getRepository(Apod);

    return await repository.save(apod);
  }

  public async getApod(): Promise<Apod> {
    let connection = getConnection();
    let repository = connection.getRepository(Apod);
    let apod = await repository.createQueryBuilder("apod").getOne();

    if (apod == null) {
      throw new Error("No APOD available.");
    } else {
      return apod;
    }
  }

  public async getRandomApod(): Promise<Apod> {
    try {
      let dataRecovered = await axios.get(this.URL_RANDOM);
      if (dataRecovered.data.length) {
        let apod = new Apod();
        apod.url = dataRecovered.data[0].url;
        apod.title = dataRecovered.data[0].title;
        apod.explanation = dataRecovered.data[0].explanation;
        apod.mediaType = dataRecovered.data[0].media_type;

        return apod;
      } else if (dataRecovered.data) {
        let apod = new Apod();
        apod.url = dataRecovered.data.url;
        apod.title = dataRecovered.data.title;
        apod.explanation = dataRecovered.data.explanation;
        apod.mediaType = dataRecovered.data.media_type;

        return apod;
      } else {
        throw new Error("Unable to recover data.");
      }
    } catch (e) {
      console.error(e);
      throw new Error("Failed to retrieve data from " + this.URL_RANDOM);
    }
  }
}
