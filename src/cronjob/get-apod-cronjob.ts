import { CronJob } from "cron";

export class GetApodCron {
  private cronjob: CronJob;
  constructor() {
    this.cronjob = new CronJob();
  }
}
