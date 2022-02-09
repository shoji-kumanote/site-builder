import { execFile } from "child_process";
import { promisify } from "util";

import { Filter } from "../types/Filter";

/** png optimize フィルタ */
export const pngOptimize: Filter = async (transit, context) => {
  if (context.config.dev) {
    await context.file.copy(transit.srcFilePath, transit.distFilePath);

    return transit;
  }

  const optipng = await import("optipng-bin");

  if (transit.distFilePath === undefined) {
    throw new Error(`distFilePath not set`);
  }

  await context.file.prepareWrite(transit.distFilePath, true);

  await promisify(execFile)(optipng.default, [
    "-clobber",
    "-i",
    "1",
    "-out",
    transit.distFilePath,
    transit.srcFilePath,
  ]);

  return transit;
};
