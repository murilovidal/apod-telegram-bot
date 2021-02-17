import { getConnection, getRepository } from "typeorm";
import { Apod } from "../entity/apod.entity";
import { EnvService } from "../../domain/env-service";
const axios = require("axios");

export class ApodDatasource {
  BASE_URL: string;
  URL_RANDOM: string;
  protected envService: EnvService;

  constructor() {
    this.envService = new EnvService();
    this.BASE_URL = this.envService.BASE_URL;
    this.URL_RANDOM = this.envService.URL_RANDOM;
  }

  async setApod(apod: Apod): Promise<Apod> {
    const repository = getRepository(Apod);

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

  async getRandomApod(): Promise<Apod> {
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
  async getApodFromAPI(): Promise<Apod> {
    try {
      let response;
      const dataRecovered = await axios.get(this.BASE_URL);

      if (dataRecovered?.data) {
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
      throw new Error("Failed to retrieve data from " + this.BASE_URL);
    }
  }

  async updateApod() {
    const apod = await this.getApodFromAPI();
    await this.setApod(apod);
  }
}
