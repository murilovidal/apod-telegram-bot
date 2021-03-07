import { Telegraf } from "telegraf";
import { Fakes } from "../fixtures/fakes.helper";
import * as sinon from "sinon";
import { TelegramPresentation } from "../../web/telegram-presentation";
import { expect } from "chai";

describe("Telegram Presentation", () => {
  let fakes: Fakes;
  let telegramPresentation: TelegramPresentation;

  before(() => {
    fakes = new Fakes();
    telegramPresentation = new TelegramPresentation();
  });

  it("Should Call telegram.bot", () => {
    const spy = sinon.spy(Telegraf.prototype, "command");

    telegramPresentation.startBotCommands();
    expect(spy.callCount).to.be.least(1);
  });
});
