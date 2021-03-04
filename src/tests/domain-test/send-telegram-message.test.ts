import "mocha";
import * as sinon from "sinon";
import { expect } from "chai";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { User } from "../../data/entity/user.entity";
import { SendTelegramMessage } from "../../domain/send-telegram-message.use-case";

describe("SendTelegramMessage Use case", () => {
  chai.use(chaiAsPromised);
  let sendTelegramMessage: SendTelegramMessage;

  before(() => {
    sendTelegramMessage = new SendTelegramMessage();
  });

  beforeEach(async () => {});

  it("Should send text message to user", async () => {
    const stub = sinon.stub(sendTelegramMessage);
    const user = new User();
    stub.sendTextMessageToUser(user, "message");
  });
});
