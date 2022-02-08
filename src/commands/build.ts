import path from "path";

import { Command } from "../modules/Command";
import { Transit } from "../modules/Transit";
import { applyWorkFlow } from "../util/applyWorkFlow";

/** build コマンド */
export const build: Command = async (context) => {
  const { logger } = context;

  logger.banner("build", "blue");

  const entries = await context.getEntries();

  for (const entry of entries) {
    const distPath = entry.getPrimaryDistPath();
    // eslint-disable-next-line no-await-in-loop
    const transit = await Transit.create(
      entry.entryPath,
      entry.srcFilePath,
      distPath === undefined
        ? undefined
        : path.resolve(context.config.dist, distPath)
    );

    logger.entry(entry);

    for (const workFlow of entry.getWorkFlows()) {
      // eslint-disable-next-line no-await-in-loop
      await applyWorkFlow(workFlow, transit, context);
    }
  }

  context.dependency.dump();
};
