import path from "path";

import { Context } from "../modules/Context";

/**
 * ファイルのビルド結果を削除
 *
 * @param context - コンテキスト
 * @param entry - エントリ
 */
export const unBuildFile = async (
  context: Context,
  filePath: string
): Promise<void> => {
  const entry = context.getEntry(filePath);

  if (entry === undefined) return;

  const distFilePaths = entry.getDistPaths();

  if (distFilePaths.length > 0) {
    for (const distFilePath of distFilePaths) {
      // eslint-disable-next-line no-await-in-loop
      await context.file.unlink(
        path.resolve(context.config.dist, distFilePath)
      );
    }
  }
};
