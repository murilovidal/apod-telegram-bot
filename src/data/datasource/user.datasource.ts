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

  async updateUser(_user: User): Promise<UpdateResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where("id = :id", { id: _user.id })
      .execute();
  }

  async findUserById(_id: number): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    let user = await repository.findOne(_id);

    if (user == null) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  async findUserByName(_name: string): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    let user = await repository.findOne(_name);
    if (user == null) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  async deleteUser(user: User): Promise<UpdateResult> {
    let connection = getConnection();
    let repository = connection.getRepository(User);

    return await repository.update(user.id, { isActive: false });
  }
}
