import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { Apod } from "../data/entity/apod.entity";
import { TelegramService } from "../service/telegram.service";

const telegramService = new TelegramService();

@EventSubscriber()
export class ApodSubscriber implements EntitySubscriberInterface<Apod> {
  listenTo() {
    return Apod;
  }

  afterInsert(event: InsertEvent<Apod>) {
    telegramService.sendMediaToUsers(event.entity);
  }
}
