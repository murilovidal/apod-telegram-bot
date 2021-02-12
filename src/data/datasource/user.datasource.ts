import { getConnection } from "typeorm";
import { User } from "../entity/user.entity";

export class UserDatasource {
  async setUser(_user: User) {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .insert()
      .values([{ id: _user.id, firstName: _user.firstName }])
      .execute();
  }
  async updateUser(_user: User) {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where("id = :id", { id: _user.id })
      .execute();
  }
  async findUserById(_id: number) {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    return await repository.findOne(_id);
  }

  async findUserByName(_name: string) {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    return await repository.findOne(_name);
  }

  async deleteUser(user: User) {
    let connection = getConnection();
    let repository = connection.getRepository(User);
    return await repository.update(user.id, { isActive: false });
  }
}
