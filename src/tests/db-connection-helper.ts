import { Connection, createConnection, getConnectionOptions } from "typeorm";
import * as dotenv from "dotenv";

export class DbConnectionHelper {
  constructor() {
    dotenv.config({ path: ".env.test" });
  }
  public async makeConnection(): Promise<Connection> {
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
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
}
