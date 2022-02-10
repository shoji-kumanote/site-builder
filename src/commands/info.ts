import { Command } from "../types/Command";
import { WorkFlow } from "../types/WorkFlow";

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
    disabled: config.disabled,
  });

  logger.banner("page data");
  logger.info(config.getData());

  logger.banner("entries");

  const entries = await context.getEntries();

  const showWorkFlowInfo = (workFlow: WorkFlow): void => {
    const next = workFlow.next ?? [];

    logger.filterType(
      workFlow.filterType,
      workFlow.distPath,
      workFlow.sourceMap
    );

    if (next.length > 0) {
      for (const x of next) {
        logger.begin();
        showWorkFlowInfo(x);
        logger.end();
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
