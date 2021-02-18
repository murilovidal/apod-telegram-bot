import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";

export class UserUnsubscription {
  private userDatasource = new UserDatasource();

  public async unsubscribeUser(user: User) {
    try {
      await this.userDatasource.deleteUser(user);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to unsubscribe user");
    }
  }
}
