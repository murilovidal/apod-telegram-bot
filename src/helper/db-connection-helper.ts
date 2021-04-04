import { Connection, createConnection, getConnectionOptions } from "typeorm";
import * as dotenv from "dotenv";

export class DbConnectionHelper {
  constructor() {}
  public async makeConnection(): Promise<Connection> {
    console.log(process.env.npm_command);

    if (
      process.env.npm_command === "test" ||
      process.env.npm_command === "run-script"
    ) {
      dotenv.config({ path: ".env.test" });
    } else {
    }
    const connectionOptions = await getConnectionOptions();
    dotenv.config({ path: ".env.test" });
    console.log(process.env.TYPEORM_HOST);

    Object.assign(connectionOptions, {
      name: "default",
      TYPEORM_CONNECTION: process.env.TYPEORM_CONNECTION,
      TYPEORM_HOST: process.env.TYPEORM_HOST,
      TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
      TYPEORM_PASSWORD: process.env.TYPEORM_PASSWORD,
      TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
      TYPEORM_SYNCHRONIZE: process.env.TYPEORM_SYNCHRONIZE,
      TYPEORM_LOGGING: process.env.TYPEORM_LOGGING,
      TYPEORM_ENTITIES: process.env.TYPEORM_ENTITIES,
      TYPEORM_ENTITIES_DIR: process.env.TYPEORM_ENTITIES_DIR,
    });
    const connection = await createConnection(connectionOptions);
    return connection;
  }
  public async clear(connection: Connection): Promise<void> {
    await connection.dropDatabase();
    await connection.synchronize();
  }
}
