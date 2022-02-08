import { RemoveViewBoxPlugin, RemoveAttrsPlugin, OptimizeOptions } from "svgo";

import { Filter } from "../modules/Filter";

/** viewBoxを削除しない設定 */
const removeViewBox: RemoveViewBoxPlugin = {
  name: "removeViewBox",
  active: false,
};

/** id属性やdata-*属性を削除する設定 */
const removeAttrs: RemoveAttrsPlugin = {
  name: "removeAttrs",
  params: {
    attrs: ["data-.*", "id"],
  },
};

/** svgoの最適化競って */
const options: OptimizeOptions = {
  plugins: [removeViewBox, removeAttrs],
};

/** svg optimize フィルタ */
export const svgOptimize: Filter = async (transit, context) => {
  const svgo = await import("svgo");

  const result = svgo.optimize(transit.data, options);

  if (!("data" in result)) {
    context.logger.fileFailure("svg", transit.srcFilePath, result.error);

    return transit;
  }

  return transit.update(result.data.toString());
};
