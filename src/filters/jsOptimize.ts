import { BabelFileResult, TransformOptions } from "@babel/core";

import { Transit } from "../modules/Transit";
import { Filter } from "../types/Filter";

/**
 * babelによる js transpile
 *
 * @param transit - 作業用データ
 * @returns babelの結果
 */
const transpile = async (transit: Transit): Promise<BabelFileResult> => {
  const babel = await import("@babel/core");
  const env = (await import("@babel/preset-env")).default;

  return new Promise((resolve, reject) => {
    const options: TransformOptions = {
      comments: false,
      presets: [env],
    };

    if (transit.sourceMap !== null && transit.sourceMap !== undefined) {
      options.inputSourceMap = JSON.parse(transit.sourceMap);
    } else {
      options.sourceMaps = true;
      options.sourceFileName = transit.srcFileName;
    }

    babel.transform(transit.data, options, (err, result) => {
      if (err) {
        reject(err);
      } else if (result === null) {
        reject(new Error("unknown babel error"));
      } else {
        resolve(result);
      }
    });
  });
};

/** js optimize フィルタ */
export const jsOptimize: Filter = async (transit) => {
  const result = await transpile(transit);

  if (result.map === null || result.map === undefined) {
    return transit.update(result.code ?? "", undefined);
  }

  return transit.update(result.code ?? "", JSON.stringify(result.map));
};
