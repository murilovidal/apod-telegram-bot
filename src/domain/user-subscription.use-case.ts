import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";

export class UserSubscription {
  private userDatasource = new UserDatasource();

  public async subscribeUser(user: User) {
    try {
      const newUser = await this.userDatasource.findUserById(user.telegramId);
      if (newUser.isActive) {
        throw new Error("User already subscribed.");
      } else if (!newUser.isActive) {
        try {
          await this.userDatasource.activateUser(newUser);
        } catch (error) {
          throw new Error("Failed to subscribe user.");
        }
      }
    } catch (error) {
      try {
        await this.userDatasource.setUser(user);
      } catch (error) {
        console.log(error);
        throw new Error("Failed to subscribe user.");
      }
    }
  }

  public async getAllSubscribers() {
    try {
      var users = await this.userDatasource.getAll();
    } catch (error) {
      console.error(error);
      throw new Error("Query failed.");
    }

    return users;
  }
}
