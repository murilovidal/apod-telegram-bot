import { createConnection, getConnectionOptions } from "typeorm";
import { BotService } from "./service/bot.service";
import { EnvService } from "./service/env-service";
import { TelegramPresentation } from "./web/telegram-presentation";
import dotenv from "dotenv";
dotenv.config();

const envService = new EnvService();
const telegramPresentation = new TelegramPresentation(
  new BotService(envService)
);

(async () => {
  console.log("Creating database Connection...");

  const connection = await createConnection();

  await connection.synchronize();
  telegramPresentation.startBot();
  console.log("Bot started");
})();
