import { createConnection } from "typeorm";
import { BotService } from "./service/bot.service";
import { EnvService } from "./service/env-service";
import { TelegramPresentation } from "./web/telegram-presentation";

const envService = new EnvService();
const telegramPresentation = new TelegramPresentation(
  new BotService(envService)
);

(async () => {
  const connection = await createConnection();
  await connection.synchronize();
  telegramPresentation.startBot();
})();
