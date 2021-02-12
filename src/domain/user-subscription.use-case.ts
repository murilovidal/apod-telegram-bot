import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";

export class UserSubscription {
  protected ALREADY_SUBSCRIBED_MESSAGE =
    'QueryFailedError: duplicate key value violates unique constraint "PK_cace4a159ff9f2512dd42373760"';
  protected userDatasource = new UserDatasource();

  async subscribeUser(user: User) {
    try {
      await this.userDatasource.setUser(user);
      return true;
    } catch (error) {
      if (error == this.ALREADY_SUBSCRIBED_MESSAGE) {
        console.log(error);
        this.userDatasource.updateUser(user);
        throw new Error("User already subscribed.");
      } else {
        console.error(error);
        throw new Error("Failed to subscribe user.");
      }
    }
  }

  async unsubscribeUser(user: User) {
    try {
      await this.userDatasource.deleteUser(user);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to unsubscribe user");
    }
  }
}
