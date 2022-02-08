import { MinifyOutput } from "terser";

import { Filter } from "../types/Filter";

/**
 * terser の結果からソースマップを得る
 *
 * @param result - terser の結果
 * @returns ソースマップ
 */
const getSourceMap = (result: MinifyOutput): string | undefined => {
  if (result.map === undefined || typeof result.map === "string") {
    return result.map;
  }

  return JSON.stringify(result.map);
};

/** js minify フィルタ */
export const jsMinify: Filter = async (transit) => {
  const terser = await import("terser");

  const result = await terser.minify(transit.data, {
    sourceMap: {
      content: transit.sourceMap,
    },
  });

  return transit.update(result.code ?? "", getSourceMap(result));
};
