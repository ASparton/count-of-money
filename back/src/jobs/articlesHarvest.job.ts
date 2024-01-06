import { harvestFromAllFeedsAndInsert } from "@controllers/articlesHarvest";
import { CronJob } from "cron";

const articlesHarvestJob = new CronJob(
  "* * * * *", // cronTime --> Every 1 minute
  function () {
    console.log("[JOB] Starting articles harvest...");
    harvestFromAllFeedsAndInsert()
      .then((nbArticlesCreated) => {
        console.log(
          `[JOB] Articles harvest terminated. ${nbArticlesCreated.count} articles harvested.`
        );
      })
      .catch(() => {
        console.error("[JOB] An error occured while running articles harvest!");
      });
  },
  null, // onComplete
  false, // start
  "America/Los_Angeles" // timeZone
);

export default articlesHarvestJob;
