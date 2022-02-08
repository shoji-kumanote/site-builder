import { Filter } from "../modules/Filter";
import { getEsBuildResult } from "../util/getEsBuildResult";

/** mjs bundle フィルタ */
export const mjsBundle: Filter = async (transit, context) => {
  const esbuild = await import("esbuild");

  const result = await esbuild.build({
    bundle: true,
    entryPoints: [transit.srcFilePath],
    splitting: false,
    sourcemap: "external",
    write: false,
    outdir: "out",
    metafile: true,
  });

  const [data, sourceMap, deps] = getEsBuildResult(result, context.config.base);

  context.dependency.add(transit.srcFilePath, ...deps);

  return transit.update(data, sourceMap);
};
