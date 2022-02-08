import path from "path";

import { BuildResult, OutputFile } from "esbuild";

type EsBuildResult = BuildResult & { outputFiles: OutputFile[] };

/**
 * esbuild の出力からコードとソースマップを抽出
 *
 * @param outputFiles - 出力ファイルリスト
 * @returns コード, ソースマップ, 依存ファイルの配列
 */
export const getEsBuildResult = (
  esBuildResult: EsBuildResult,
  srcDirPath: string
): [string, string | undefined, string[]] => {
  const result: [string, string | undefined, string[]] = [
    "",
    undefined,
    Object.keys(esBuildResult.metafile?.inputs ?? {}).map((x): string =>
      path.resolve(srcDirPath, path.relative(srcDirPath, x))
    ),
  ];

  for (const file of esBuildResult.outputFiles) {
    if (/\.map$/.test(file.path)) {
      result[1] = file.text;
    } else {
      result[0] = file.text;
    }
  }

  return result;
};
