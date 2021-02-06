import { create } from "domain";
import { userInfo } from "os";
import "reflect-metadata";
import { getConnection } from "typeorm";
import { isError } from "util";
import { User } from "../entity/User.entity";

export async function setUser(user: User) {
  const connection = await getConnection();
  const repository = await connection.getRepository(User);
  if (user.id == null) {
    throw new Error("Cannot set user without id");
  } else if (user.firstName == null) {
    throw new Error("Cannot set user without firstName");
  } else {
    let newUser = await repository.findOne(user.id);
    if (newUser && newUser.deletedAt) {
      try {
        await repository.restore(newUser.id);
        return true;
      } catch (error) {
        throw new Error("Failed to restore user.");
      }
    } else if (newUser == null) {
      try {
        await repository.save(user);
        return true;
      } catch (error) {
        throw new Error("Failed to create user.");
      }
    } else if (newUser != null) {
      throw new Error("User already set in database");
    }
  }
}

export async function getUser(x: any) {
  let connection = await getConnection();
  let repository = await connection.getRepository(User);
  if (typeof x == "number") {
    let user = await repository.findOne(x);
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  } else if (typeof x == "string") {
    let user = await repository.find({
      where: [{ firstName: x }],
    });
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  }
}
