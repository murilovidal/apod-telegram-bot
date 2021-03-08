require("dotenv").config();

export class EnvService {
  public APOD_URL: string;
  public URL_RANDOM: string;
  public BOT_TOKEN: string;

  constructor() {
    this.APOD_URL = <string>process.env.BASE_URL + <string>process.env.API_KEY;
    this.URL_RANDOM =
      <string>process.env.BASE_URL + <string>process.env.API_KEY + "&count=1";
    this.BOT_TOKEN = <string>process.env.BOT_TOKEN;
  }
}
