import { getConnection } from "typeorm";
import { Apod } from "../entity/apod.entity";
require("dotenv").config();
const axios = require("axios");

export class ApodDatasource {
  protected URL_API = <string>process.env.URL_API;
  protected API_KEY = <string>process.env.API_KEY;
  protected URL_RANDOM = `${this.URL_API + this.API_KEY}&count=1`;

  public setApod(apod: Apod) {
    const connection = getConnection();
    const repository = connection.getRepository(Apod);
    return repository.save(apod);
  }

  public getApod() {
    let connection = getConnection();
    let repository = connection.getRepository(Apod);

    return repository.createQueryBuilder("apod").getOne();
  }

  public async getRandomApod() {
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
