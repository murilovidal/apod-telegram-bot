require("dotenv").config();

export class EnvService {
  BASE_URL: string;
  URL_RANDOM: string;
  BOT_TOKEN: string;

  constructor() {
    this.BASE_URL = <string>process.env.URL_API + <string>process.env.API_KEY;
    this.URL_RANDOM =
      <string>process.env.URL_API + <string>process.env.API_KEY + "&count=1";
    this.BOT_TOKEN = <string>process.env.BOT_TOKEN;
  }
}
