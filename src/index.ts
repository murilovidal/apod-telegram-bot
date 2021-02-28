import { createConnection } from "typeorm";
import { TelegramPresentation } from "./web/telegram-presentation";

const telegramPresentation = new TelegramPresentation();

(async () => {
  const connection = await createConnection();
  await connection.synchronize();
  telegramPresentation.startBotCommands();
})();
