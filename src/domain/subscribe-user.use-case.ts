import "reflect-metadata";
import { createConnection } from "typeorm";
import { setUser } from "../data/datasource/User.datasource";
import { User } from "../data/entity/User.entity";

export async function subscribeUser(user: User) {
  try {
    var result = await setUser(user);
    console.log(result);
  } catch (error) {
    throw new Error("Failed to save user in database");
  }
  if (result) {
    return true;
  } else return false;
}
