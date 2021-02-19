import { ApodDatasource } from "../data/datasource/apod.datasource";
import { CronJob } from "cron";

const apodDatasource = new ApodDatasource();

export class ApodService {
  job: CronJob;
  constructor() {
    this.job = new CronJob("0 5,6,7,8 * * *", async () => {
      try {
        await apodDatasource.updateApod();
      } catch (error) {
        console.error(error);
      }
      if (!this.job.running) {
        this.job.start();
      }
    });
  }

  startJob() {
    this.job.start();
  }
}
