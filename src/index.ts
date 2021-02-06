import "reflect-metadata";
import { createConnection } from "typeorm";
import { setUser } from "./data/datasource/User.datasource";
import { User } from "./data/entity/User.entity";

async function start() {
  const connection = await createConnection();
  const repository = await connection.getRepository(User);
  let user = new User();
  user.firstName = "MuriloVidal";
  await repository.save(user);
  console.log(user);
  await connection.close();
}
start();
