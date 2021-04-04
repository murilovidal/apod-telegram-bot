import { getConnection } from "typeorm";
import { BotService } from "./service/bot.service";
import { EnvService } from "./service/env-service";
import { TelegramPresentation } from "./web/telegram-presentation";
import dotenv from "dotenv";
import { DbConnectionHelper } from "./helper/db-connection-helper";
dotenv.config();

const envService = new EnvService();
const telegramPresentation = new TelegramPresentation(
  new BotService(envService)
);
const dbConnectionHelper = new DbConnectionHelper();

(async () => {
  await dbConnectionHelper.makeConnection();
  const connection = getConnection();
  await connection.synchronize();
  telegramPresentation.startBot();
  console.log("Bot started");
})();
