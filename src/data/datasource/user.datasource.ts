import { getConnection, InsertResult, UpdateResult } from "typeorm";
import { User } from "../entity/user.entity";

export class UserDatasource {
  public async setUser(user: User): Promise<InsertResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .insert()
      .values([{ telegramId: user.telegramId, firstName: user.firstName }])
      .execute();
  }

  public async updateUser(user: User): Promise<UpdateResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return repository.update(user.telegramId, { isActive: true });
  }

  public async findUserById(id: number): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    const user = await repository.findOne(id);

    if (!user) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  public async findUserByName(firstName: string): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    const user = await repository.findOne({ where: { firstName: firstName } });
    if (user == null) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  public async deleteUser(user: User): Promise<UpdateResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository.update(user.telegramId, { isActive: false });
  }
}
