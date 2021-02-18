import { getConnection, InsertResult, UpdateResult } from "typeorm";
import { User } from "../entity/user.entity";

export class UserDatasource {
  async setUser(_user: User): Promise<InsertResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .insert()
      .values([{ id: _user.id, firstName: _user.firstName }])
      .execute();
  }

  async updateUser(user: User): Promise<UpdateResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where("id = :id", { id: user.id })
      .execute();
  }

  async findUserById(id: number): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    const user = await repository.findOne(id);

    if (!user) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  async findUserByName(firstName: string): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    const user = await repository.findOne({ where: { firstName: firstName } });
    if (user == null) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  async deleteUser(user: User): Promise<UpdateResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository.update(user.id, { isActive: false });
  }
}
