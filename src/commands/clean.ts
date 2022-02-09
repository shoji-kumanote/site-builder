import path from "path";

import { Command } from "../types/Command";

/** clean コマンド */
export const clean: Command = async (context) => {
  const { logger, config } = context;

  logger.banner("clean", "blue");

  const entries = await context.getEntries();

  const files = entries
    .reduce(
      (prev: string[], x): string[] => [...prev, ...x.getDistPaths(true)],
      []
    )
    .map((x) => path.resolve(config.dist, x));

  await Promise.all(files.map((x) => context.file.unlink(x)));

  await context.file.removeEmptyDirs(context.config.dist);
};
