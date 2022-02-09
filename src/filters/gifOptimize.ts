import { execFile } from "child_process";
import { promisify } from "util";

import { Filter } from "../types/Filter";

/** GIF optimize フィルタ */
export const gifOptimize: Filter = async (transit, context) => {
  if (context.config.dev) {
    await context.file.copy(transit.srcFilePath, transit.distFilePath);

    return transit;
  }

  const gifsicle = await import("gifsicle");

  if (transit.distFilePath === undefined) {
    throw new Error(`distFilePath not set`);
  }

  await context.file.prepareWrite(transit.distFilePath, true);

  await promisify(execFile)(gifsicle.default, [
    "--interlace",
    "--output",
    transit.distFilePath,
    transit.srcFilePath,
  ]);

  return transit;
};
