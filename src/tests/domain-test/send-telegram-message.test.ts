import "mocha";
import * as sinon from "sinon";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { SendTelegramMessage } from "../../domain/send-telegram-message.use-case";
import { Fakes } from "../fixtures/fakes.helper";
import { BotService } from "../../service/bot.service";

describe("SendTelegramMessage Use case", () => {
  chai.use(chaiAsPromised);
  let sendTelegramMessage: SendTelegramMessage;
  let fakes: Fakes;

  before(() => {
    fakes = new Fakes();
    sendTelegramMessage = new SendTelegramMessage();
  });

  beforeEach(async () => {
    sinon.restore;
  });

  it("Should send text message to user", async () => {
    const user = fakes.user;
    const spy = sinon.spy(BotService.prototype, "sendText");

    sendTelegramMessage.sendTextToUser(user, "message");

    expect(spy.callCount).to.be.eq(1);
  });

  it("Should send media message to user", async () => {
    const user = fakes.user;
    const spy = sinon.spy(BotService.prototype, "sendMedia");
    const apod = fakes.apod;

    sendTelegramMessage.sendMediaToUser(user, apod);

    expect(spy.callCount).to.be.eq(1);
  });
});
