import { Command } from "../types/Command";
import { buildEntry } from "../util/buildEntry";

/** build コマンド */
export const build: Command = async (context) => {
  const { logger } = context;

  logger.banner("build", "blue");

  const entries = await context.getEntries();

  for (const entry of entries) {
    // eslint-disable-next-line no-await-in-loop
    await buildEntry(context, entry);
  }

  // context.dependency.dump(context.logger);
};
