import { Filter } from "../modules/Filter";

/** css optimize フィルタ */
export const cssOptimize: Filter = async (transit) => {
  const postcss = await import("postcss");
  const autoprefixer = await import("autoprefixer");
  const mqpacker = await import("css-mqpacker");
  const sorting = await import("postcss-sorting");

  const { css, map } = postcss
    .default([
      autoprefixer.default(),
      mqpacker.default(),
      sorting.default({
        "properties-order": "alphabetical",
      }),
    ])
    .process(transit.data, {
      from: transit.srcFileName,
      to: transit.distFileName,
      map: {
        inline: false,
        prev: transit.sourceMap ?? false,
      },
    });

  return transit.update(css, map?.toString() ?? undefined);
};
