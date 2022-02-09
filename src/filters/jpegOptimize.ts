import { execFile } from "child_process";
import { promisify } from "util";

import { Filter } from "../types/Filter";

/** jpeg optimize フィルタ */
export const jpegOptimize: Filter = async (transit, context) => {
  if (context.config.dev) {
    await context.file.copy(transit.srcFilePath, transit.distFilePath);

    return transit;
  }

  const jpegTran = await import("jpegtran-bin");

  if (transit.distFilePath === undefined) {
    throw new Error(`distFilePath not set`);
  }

  await context.file.prepareWrite(transit.distFilePath, true);

  await promisify(execFile)(jpegTran.default, [
    "-progressive",
    "-optimize",
    "-outfile",
    transit.distFilePath,
    transit.srcFilePath,
  ]);

  return transit;
};
