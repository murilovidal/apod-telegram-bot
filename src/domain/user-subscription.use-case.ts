import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";

export class UserSubscription {
  private userDatasource = new UserDatasource();

  public async subscribeUser(user: User) {
    try {
      await this.userDatasource.setUser(user);
      return true;
    } catch (error) {
      if (
        /^QueryFailedError: duplicate key value violates unique constraint/.test(
          error
        )
      ) {
        console.log(error);
        this.userDatasource.updateUser(user);
        throw new Error("User already subscribed.");
      } else {
        console.error(error);
        throw new Error("Failed to subscribe user.");
      }
    }
  }
}
