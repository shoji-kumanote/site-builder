import { Filter } from "../types/Filter";
import { getDefaultPrettierConfig } from "../util/getDefaultPrettierConfig";

/** js format フィルタ */
export const jsFormat: Filter = async (transit) => {
  const prettier = await import("prettier");
  const config =
    (await prettier.default.resolveConfig(transit.srcFilePath)) ??
    getDefaultPrettierConfig();

  const result = prettier.default.format(transit.data, {
    ...config,
    parser: "babel",
  });

  return transit.update(result, transit.sourceMap);
};
