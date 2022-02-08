import { Filter } from "../types/Filter";
import { addDocType } from "../util/addDocType";
import { getDefaultPrettierConfig } from "../util/getDefaultPrettierConfig";

/** html format フィルタ */
export const htmlFormat: Filter = async (transit) => {
  const prettier = await import("prettier");
  const config =
    (await prettier.default.resolveConfig(transit.srcFilePath)) ??
    getDefaultPrettierConfig();

  return transit.update(
    addDocType(
      prettier.default.format(transit.data, {
        printWidth: 150,
        ...config,
        parser: "glimmer",
      })
    )
  );
};
