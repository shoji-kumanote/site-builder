import { Command } from "../modules/Command";
import { WorkFlow } from "../modules/WorkFlow";

/** info コマンド */
export const info: Command = async (context) => {
  const { logger, config } = context;

  logger.banner("info", "blue");

  logger.banner("cli option");
  logger.info({
    config: config.config,
    dryRun: config.dryRun,
    dev: config.dev,
  });

  logger.banner("config");
  logger.info({
    base: config.base,
    dist: config.dist,
    src: config.src,
    vendor: config.vendor,
    ignore: config.ignore,
  });

  logger.banner("page data");
  logger.info(config.getData());

  logger.banner("entries");

  const entries = await context.getEntries();

  const showWorkFlowInfo = (workFlow: WorkFlow): void => {
    if (workFlow.next.length > 0) {
      logger.filterType(workFlow.filterType);
      for (const x of workFlow.next) {
        logger.begin();
        showWorkFlowInfo(x);
        logger.end();
      }
    } else {
      logger.filterType(workFlow.filterType, workFlow.distPath);

      if (workFlow.sourceMap) {
        logger.filterType(workFlow.filterType, `${workFlow.distPath}.map`);
      }
    }
  };

  for (const entry of entries) {
    const workFlows = entry.getWorkFlows();

    if (workFlows.length > 0) {
      logger.entry(entry);
      for (const workFlow of workFlows) {
        logger.begin();
        showWorkFlowInfo(workFlow);
        logger.end();
      }
    } else {
      logger.entry(entry, "dim");
    }
    logger.info("");
  }
};
