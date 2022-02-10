import path from "path";

import { Context } from "../modules/Context";
import { Transit } from "../modules/Transit";
import { WorkFlow } from "../types/WorkFlow";

import { annotateSourceMap } from "./annotateSourceMap";
import { getFilter } from "./getFilter";

/**
 * ワークフローを実行
 *
 * @param workFlow - ワークフロー
 * @param transit - 作業用データ
 * @param context - 実行時コンテキスト
 */
export const applyWorkFlow = async (
  workFlow: WorkFlow,
  transit: Transit,
  context: Context
): Promise<void> => {
  const filter = await getFilter(workFlow.filterType);

  context.logger.begin();
  context.logger.filterType(workFlow.filterType);

  try {
    if (workFlow.binary) {
      await filter(transit, context);
      context.logger.begin();
      context.logger.fileSuccess("write", transit.distFilePath ?? "");
      context.logger.end();
      context.logger.info();
    } else {
      const result = await filter(transit, context);

      if (workFlow.distPath !== undefined) {
        // ここで出力
        context.logger.begin();

        if (workFlow.sourceMap && result.sourceMap) {
          await context.file.write(
            path.resolve(context.config.dist, workFlow.distPath),
            annotateSourceMap(
              result.data,
              `${path.basename(workFlow.distPath)}.map`
            )
          );
          await context.file.write(
            path.resolve(context.config.dist, `${workFlow.distPath}.map`),
            result.sourceMap
          );
        } else {
          await context.file.write(
            path.resolve(context.config.dist, workFlow.distPath),
            annotateSourceMap(result.data)
          );
        }
        context.logger.end();
        context.logger.info();
      }
      for (const next of workFlow.next ?? []) {
        /* eslint-disable no-await-in-loop */
        await applyWorkFlow(next, result, context);
      }
    }
  } catch (e) {
    context.logger.fileFailure("", transit.srcFilePath, e);
  }
  context.logger.end();
};
