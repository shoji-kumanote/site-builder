import { execFile } from "child_process";
import { promisify } from "util";

import { Filter } from "../types/Filter";

/** jpeg optimize フィルタ */
export const jpegOptimize: Filter = async (transit, context) => {
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
