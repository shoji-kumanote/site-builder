import fs from "fs";
import path from "path";

import { insertLastNewLine } from "../util/insertLastNewLine";

import { Logger } from "./Logger";

/** クラス: ファイル操作 */
export class File {
  /** ロガー */
  readonly logger: Logger;
  /** dry-runモード */
  readonly dryRun: boolean;

  /**
   * コンストラクタ
   *
   * @param logger - ロガー
   * @param dryRun - dry-runモード
   */
  constructor(logger: Logger, dryRun: boolean) {
    this.logger = logger;
    this.dryRun = dryRun;
  }

  /**
   * ファイル削除
   *
   * @param filePath - ファイルパス
   */
  async unlink(filePath: string): Promise<void> {
    try {
      if (!this.dryRun) await fs.promises.unlink(filePath);
      this.logger.fileSuccess("unlink", filePath);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        e.code === "ENOENT"
      ) {
        this.logger.fileWarning("unlink", filePath, e);
      } else {
        this.logger.fileFailure("unlink", filePath, e);
      }
    }
  }

  /**
   * 再帰的に空のディレクトリを削除
   *
   * @param dirPath - ディレクトリパス
   * @param first - 初回コールフラグ
   */
  private async removeDirs(dirPath: string, first: boolean): Promise<void> {
    try {
      if (!(await fs.promises.stat(dirPath)).isDirectory()) return;
    } catch (e) {
      this.logger.fileFailure("rmdir", dirPath, e);

      return;
    }

    for (const entry of await fs.promises.readdir(dirPath)) {
      // eslint-disable-next-line no-await-in-loop
      await this.removeDirs(path.resolve(dirPath, entry), false);
    }

    if (first) return;

    const entries = await fs.promises.readdir(dirPath);

    if (entries.length === 0) {
      try {
        if (!this.dryRun) await fs.promises.rmdir(dirPath);
        this.logger.fileSuccess("rmdir", dirPath);
      } catch (e) {
        this.logger.fileFailure("rmdir", dirPath, e);
      }
    }
  }

  /**
   * 空のディレクトリを削除
   *
   * @param dirPath - ディレクトリパス
   */
  async removeEmptyDirs(dirPath: string): Promise<void> {
    await this.removeDirs(dirPath, true);
  }

  /**
   * ファイル書き出しの準備としてファイルに至るディレクトリを作成
   *
   * @param filePath - ファイルパス
   * @param withUnlink - 削除フラグ / 指定時はファイルが存在した場合に削除する
   */
  async prepareWrite(filePath: string, withUnlink = false): Promise<void> {
    if (!this.dryRun) {
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

      if (withUnlink) {
        try {
          await fs.promises.unlink(filePath);
        } catch {
          //
        }
      }
    }
  }

  /**
   * テキストファイル書き出し（末尾に改行が入る）
   *
   * @param filePath - ファイルパス
   * @param data - 内容
   */
  async writeText(filePath: string, data: string): Promise<void> {
    await this.write(filePath, insertLastNewLine(data));
  }

  /**
   * ファイル書き出し
   *
   * @param filePath - ファイルパス
   * @param data - 内容
   */
  async write(filePath: string, data: string): Promise<void> {
    await this.prepareWrite(filePath);

    if (!this.dryRun) {
      try {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, data);
      } catch (e) {
        this.logger.fileFailure("write", filePath, e);

        return;
      }
    }
    this.logger.fileSuccess("write", filePath);
  }
}
