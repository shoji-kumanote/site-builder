import { execFile } from "child_process";
import { promisify } from "util";

import { Filter } from "../types/Filter";

/** png optimize フィルタ */
export const pngOptimize: Filter = async (transit, context) => {
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
