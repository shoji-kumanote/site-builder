import path from "path";

import { globby } from "globby";
import micromatch from "micromatch";

import { Config } from "./Config";
import { Dependency } from "./Dependency";
import { Entry } from "./Entry";
import { File } from "./File";
import { Logger } from "./Logger";

/** 実行時コンテキスト */
export class Context {
  /** 設定 */
  #config: Config;

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
    this.#config = config;
    this.logger = new Logger(config);
    this.file = new File(this.logger, config.dryRun);
    this.dependency = new Dependency();
  }

  get config(): Config {
    return this.#config;
  }

  /** 設定ファイルの再読み込み */
  async reloadConfig(): Promise<void> {
    this.#config = await Config.create({
      config: this.#config.config,
      dev: this.#config.dev,
      dryRun: this.#config.dryRun,
    });
  }

  /** 全ソースファイルのエントリ取得 */
  async getEntries(): Promise<Entry[]> {
    const patterns = [
      ...this.config.src,
      ...this.config.ignore.map((x) => `!${x}`),
    ];
    const filePaths = await globby(
      path === path.win32
        ? patterns.map((x) => x.split(path.sep).join("/"))
        : patterns,
      { onlyFiles: true }
    );

    console.debug(this.config.src);

    return filePaths.map((x) => new Entry(this.#config, x));
  }

  /** 指定ファイルのエントリ取得 */
  getEntry(filePath: string): Entry | undefined {
    if (micromatch([filePath], this.config.ignore).length > 0) {
      return undefined;
    }

    return new Entry(this.#config, filePath);
  }
}
