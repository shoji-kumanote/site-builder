import path from "path";

import { Context } from "../modules/Context";
import { Entry } from "../modules/Entry";
import { Transit } from "../modules/Transit";

import { applyWorkFlow } from "./applyWorkFlow";

export const buildEntry = async (
  context: Context,
  entry: Entry
): Promise<void> => {
  const distPath = entry.getPrimaryDistPath();
  // eslint-disable-next-line no-await-in-loop
  const transit = await Transit.create(
    entry.entryPath,
    entry.srcFilePath,
    distPath === undefined
      ? undefined
      : path.resolve(context.config.dist, distPath)
  );

  context.logger.entry(entry);

  for (const workFlow of entry.getWorkFlows()) {
    // eslint-disable-next-line no-await-in-loop
    await applyWorkFlow(workFlow, transit, context);
  }
};
