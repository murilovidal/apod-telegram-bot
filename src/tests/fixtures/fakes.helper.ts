import { Apod } from "../../data/entity/apod.entity";
import { User } from "../../data/entity/user.entity";

export class Fakes {
  constructor() {}

  public getUser(): User {
    const fakeUser = new User();
    fakeUser.firstName = "Rorschach";
    fakeUser.telegramId = 1984;
    return fakeUser;
  }
  public getApod(): Apod {
    const fakeApod = new Apod();

    fakeApod.url = "www.apod.com";
    fakeApod.title = "Death Star";
    fakeApod.explanation = "That's no moon";
    fakeApod.mediaType = "image";

    return fakeApod;
  }
}
