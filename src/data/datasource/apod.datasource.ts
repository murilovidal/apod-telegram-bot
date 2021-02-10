import { getConnection } from "typeorm";
import { Apod } from "../entity/apod.entity";

export class ApodDatasource {
  public async setApod(apod: Apod) {
    const connection = getConnection();
    const repository = await connection.getRepository(Apod);
    return await repository.save(apod);
  }

  public async getApod() {
    let connection = getConnection();
    let repository = await connection.getRepository(Apod);

    return repository.createQueryBuilder("apod").getOne();
  }
}
