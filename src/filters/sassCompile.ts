import path from "path";

import { Filter } from "../types/Filter";

/** sass compile フィルタ */
export const sassCompile: Filter = async (transit, context) => {
  const sass = await import("sass");
  const result = await sass.default.compileStringAsync(transit.data, {
    syntax: /sass$/.test(transit.srcFileName) ? "indented" : "scss",
    loadPaths: [path.dirname(transit.srcFilePath)],
    sourceMap: true,
    sourceMapIncludeSources: true,
  });

  context.dependency.add(
    transit.srcFilePath,
    ...result.loadedUrls.map((x) =>
      path.win32 === path
        ? x.pathname.replace(/^\/+/, "").split("/").join(path.sep)
        : x.pathname
    )
  );

  const next = transit.update(
    result.css,
    result.sourceMap ? JSON.stringify(result.sourceMap) : undefined
  );

  return next;
};
