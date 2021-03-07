import { Apod } from "../../data/entity/apod.entity";
import { User } from "../../data/entity/user.entity";

export class Fakes {
  public user: User;
  public apod: Apod;

  constructor() {
    this.user = new User();
    this.apod = new Apod();
    this.user.firstName = "Rorschach";
    this.user.telegramId = 1984;

    this.apod.explanation = "Explanation";
    this.apod.mediaType = "image";
    this.apod.title = "Nice Title";
    this.apod.url = "www.url.com";
  }
}
