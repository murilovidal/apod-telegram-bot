import { Telegraf } from "telegraf";
import { Fakes } from "../fixtures/fakes.helper";
import * as sinon from "sinon";
import { TelegramPresentation } from "../../web/telegram-presentation";
import { expect } from "chai";
import { BotService } from "../../service/bot.service";
import { EnvService } from "../../service/env-service";

describe("Telegram Presentation", () => {
  let fakes: Fakes;
  let telegramPresentation: TelegramPresentation;
  let envService: EnvService;

  before(() => {
    fakes = new Fakes();
    envService = new EnvService();
    telegramPresentation = new TelegramPresentation(new BotService(envService));
  });

  it("Should Call telegram.bot", () => {
    const spy = sinon.spy(Telegraf.prototype, "command");

    telegramPresentation.startBot();
    expect(spy.callCount).to.be.least(1);
  });
});
