import { createConnection } from "typeorm";
import { TelegramService } from "./service/telegram.service";

const telegramService = new TelegramService();

(async () => {
  const connection = await createConnection();
  await connection.synchronize();
  telegramService.start();
})();
