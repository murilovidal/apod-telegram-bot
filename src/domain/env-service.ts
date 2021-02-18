require("dotenv").config();

export class EnvService {
  public URL_API = <string>process.env.URL_API;
  public BOT_KEY = <string>process.env.BOT_KEY;
  public API_KEY = <string>process.env.API_KEY;
  public URL_RANDOM = `${this.URL_API + this.API_KEY}&count=1`;
}
