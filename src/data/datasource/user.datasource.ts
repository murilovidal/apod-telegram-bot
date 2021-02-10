import { getConnection } from "typeorm";
import { User } from "../entity/user.entity";

export class UserDatasource {
  public async setUser(_user: User) {
    const connection = getConnection();
    const repository = await connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .insert()
      .values([{ id: _user.id, firstName: _user.firstName }])
      .execute();
  }

  public async findUserById(_id: number) {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    return await repository.findOne(_id);
  }

  public async findUserByName(_name: string) {
    const connection = getConnection();
    const repository = await connection.getRepository(User);
    return repository.findOne(_name);
  }

  public async deleteUser(user: User) {
    let connection = getConnection();
    let repository = await connection.getRepository(User);
    return await repository.update(user.id, { isActive: false });
  }
}
