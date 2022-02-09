import path from "path";

import { Command } from "../types/Command";
import { buildFile } from "../util/buildFile";
import { unBuildFile } from "../util/unBuildFile";

import { build } from "./build";

/** watch コマンド */
export const watch: Command = async (context) => {
  const { logger } = context;

  await build(context);

  logger.banner("watch", "blue");

  const chokidar = await import("chokidar");

  const watcher = chokidar.watch(
    [
      ...context.config.src.map((x) => path.resolve(x, "**", "*")),
      ...context.config.config,
    ],
    {
      atomic: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
      useFsEvents: true,
    }
  );

  const isConfigFile = (filePath: string): boolean =>
    context.config.config.includes(filePath);

  watcher.on("ready", () => {
    context.logger.banner("start watching ...", "green");
    context.logger.info();

    watcher.on("add", async (filePath) => {
      context.logger.fileNotice("add", filePath);
      context.logger.begin();

      if (isConfigFile(filePath)) {
        // 設定ファイル追加はありえないので何もしない
      } else {
        await buildFile(context, filePath);
      }
      context.logger.end();
      context.logger.idle();
    });

    watcher.on("change", async (filePath) => {
      context.logger.fileNotice("update", filePath);
      context.logger.begin();

      if (isConfigFile(filePath)) {
        await context.reloadConfig();
        await build(context);
      } else {
        await buildFile(context, filePath);
      }
      context.logger.end();
      context.logger.idle();
    });

    watcher.on("unlink", async (filePath) => {
      context.logger.fileNotice("unlink", filePath);
      context.logger.begin();

      if (isConfigFile(filePath)) {
        // 設定ファイル削除は何もしない
      } else {
        await unBuildFile(context, filePath);
      }
      context.logger.end();
      context.logger.idle();
    });
  });
};
