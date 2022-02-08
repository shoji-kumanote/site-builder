import { Filter } from "../modules/Filter";
import { getDefaultPrettierConfig } from "../util/getDefaultPrettierConfig";

/** css format フィルタ */
export const cssFormat: Filter = async (transit) => {
  const prettier = await import("prettier");
  const config =
    (await prettier.default.resolveConfig(transit.srcFilePath)) ??
    getDefaultPrettierConfig();

  const result = prettier.default.format(transit.data, {
    ...config,
    parser: "css",
  });

  return transit.update(result, transit.sourceMap);
};
