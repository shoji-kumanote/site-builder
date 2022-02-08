import { globby } from "globby";

import { Config } from "./Config";
import { Dependency } from "./Dependency";
import { Entry } from "./Entry";
import { File } from "./File";
import { Logger } from "./Logger";

/** 実行時コンテキスト */
export class Context {
  /** 設定 */
  readonly config: Config;
  /** ロガー */
  readonly logger: Logger;
  /** ファイル操作 */
  readonly file: File;
  /** 依存関係 */
  readonly dependency: Dependency;

  /**
   * コンストラクタ
   *
   * @param config - 設定
   */
  constructor(config: Config) {
    this.config = config;
    this.logger = new Logger(config);
    this.file = new File(this.logger, config.dryRun);
    this.dependency = new Dependency();
  }

  /** 対象のエントリ取得 */
  async getEntries(): Promise<Entry[]> {
    const filePaths = await globby(
      [...this.config.src, ...this.config.ignore.map((x) => `!${x}`)],
      { onlyFiles: true }
    );

    return filePaths.map((x) => new Entry(this.config, x));
  }
}
