import { User } from "../data/entity/user.entity";
import { UserDatasource } from "../data/datasource/user.datasource";

const ALREADY_SUBSCRIBED_MESSAGE =
  "QueryFailedError: duplicate key value violates unique constraint 'PK_cace4a159ff9f2512dd42373760'";
const userDatasource = new UserDatasource();
export async function subscribeUser(user: User) {
  try {
    await userDatasource.setUser(user);
    return true;
  } catch (error) {
    if (error == ALREADY_SUBSCRIBED_MESSAGE) {
      console.log(error);
      throw new Error(ALREADY_SUBSCRIBED_MESSAGE);
    } else {
      throw new Error("Failed to subscribe user.");
    }
  }
}

export async function unsubscribeUser(user: User) {
  try {
    await userDatasource.deleteUser(user);
    return true;
  } catch (error) {
    throw new Error("Failed to unsubscribe user");
  }
}
