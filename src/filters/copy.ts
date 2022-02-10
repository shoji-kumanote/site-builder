import { Filter } from "../types/Filter";

/** copy フィルタ */
export const copy: Filter = async (transit, context) => {
  await context.file.copy(transit.srcFilePath, transit.distFilePath);

  return transit;
};
