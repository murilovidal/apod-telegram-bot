import { getConnection } from "typeorm";
import { Apod } from "../entity/apod.entity";
import { EnvService } from "../../domain/env-service";
const axios = require("axios");

export class ApodDatasource {
  URL_API: string;
  API_KEY: string;
  URL_RANDOM: string;
  protected envService: EnvService;

  constructor() {
    this.envService = new EnvService();
    this.URL_API = this.envService.URL_API;
    this.API_KEY = this.envService.API_KEY;
    this.URL_RANDOM = this.envService.URL_RANDOM;
  }

  public async setApod(apod: Apod): Promise<Apod> {
    const connection = getConnection();
    const repository = connection.getRepository(Apod);

    return repository.save(apod);
  }

  public async getApod(): Promise<Apod> {
    const connection = getConnection();
    const repository = connection.getRepository(Apod);
    const apod = await repository.findOne();

    if (apod == null) {
      throw new Error("No APOD available.");
    } else {
      return apod;
    }
  }

  public async getRandomApod(): Promise<Apod> {
    try {
      let response;
      const dataRecovered = await axios.get(this.URL_RANDOM);
      if (dataRecovered?.data?.length) {
        response = dataRecovered.data[0];
      } else if (dataRecovered?.data) {
        response = dataRecovered.data;
      } else {
        throw new Error("Unable to recover data.");
      }
      const apod = new Apod();
      apod.url = response.url;
      apod.title = response.title;
      apod.explanation = response.explanation;
      apod.mediaType = response.media_type;

      return apod;
    } catch (e) {
      console.error(e);
      throw new Error("Failed to retrieve data from " + this.URL_RANDOM);
    }
  }
}
