import { createConnection } from "typeorm";
import { ApodDatasource } from "./data/datasource/apod.datasource";
import { TelegramService } from "./domain/telegram.service";

const apodDatasource = new ApodDatasource();
const telegramService = new TelegramService();

(async () => {
  const connection = await createConnection();
  await connection.dropDatabase();
  await connection.synchronize();
  telegramService.start();
})();
