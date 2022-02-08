import path from "path";
import url from "url";

import { Filter } from "../types/Filter";

/** css minify フィルタ */
export const cssMinify: Filter = async (transit) => {
  const postcss = await import("postcss");
  const csso = await import("postcss-csso");

  const { css, map } = postcss
    .default([csso.default({ restructure: false })])
    .process(transit.data, {
      from: transit.srcFileName,
      to: transit.distFileName,
      map: {
        inline: false,
        prev: transit.sourceMap ?? false,
      },
    });

  if (!map) {
    return transit.update(css, undefined);
  }

  const mapJSON = map.toJSON();

  mapJSON.sources = mapJSON.sources.map((x) => {
    if (/^file/.test(x)) {
      return path.relative(
        path.dirname(transit.srcFilePath),
        new url.URL(x).pathname
      );
    }

    return x;
  });

  return transit.update(css, JSON.stringify(mapJSON));
};
