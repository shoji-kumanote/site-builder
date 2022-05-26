/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

// eslint-disable-next-line import/no-unresolved
import path from "path";

// eslint-disable-next-line import/no-unresolved
import chalk, { Color, Modifiers } from "chalk"; // ???
import { format } from "date-fns";
import terminalSize from "term-size";

import { Config } from "./Config";
import { Entry } from "./Entry";
import { FilterType } from "./FilterType";

/** コンソールの幅取得 */
const width = (): number => terminalSize().columns;

/** タイプ: ログの色指定 */
export type LoggerColor = Color | Modifiers | LoggerColor[];

/** タイプ: ディレクトリ定義 */
type Dir = { name: string; dirPath: string };

/** タイプ: ファイル情報 */
type FileInfo = { name: string; relPath: string };

/**
 * 色指定を反映
 *
 * @param value - 文字列
 * @param colors - 色指定
 */
const applyColor = (value: string, ...colors: LoggerColor[]): string => {
  let result = value;
  for (const color of colors) {
    if (typeof color === "string") {
      result = chalk[color](result);
    } else {
      result = applyColor(result, ...color);
    }
  }

  return result;
};

/** クラス: ロガー */
export class Logger {
  /** idle検出タイマー */
  #idleTimer: undefined | NodeJS.Timeout;

  /** indent */
  #indent: string;

  /** ディレクトリ定義 */
  readonly dirs: Dir[];

  /**
   * コンストラクタ
   *
   * @param config - 設定
   */
  constructor(config: Config) {
    this.#indent = "";

    this.dirs = [
      { name: "BASE", dirPath: config.base },
      { name: "DIST", dirPath: config.dist },
    ];
  }

  /** 字下げ開始 */
  begin(): void {
    this.#indent = `${this.#indent}  `;
  }

  /** 字下げ終了 */
  end(): void {
    this.#indent = this.#indent.slice(2);
  }

  /**
   * バナー出力
   *
   * @param title - タイトル
   * @param colors - 色指定
   */
  banner(title: string, ...colors: LoggerColor[]): void {
    if (colors.length === 0) {
      this.banner(title, "green");

      return;
    }

    console.info("");
    console.info(
      applyColor("__", colors, "inverse"),
      title,
      applyColor("_".repeat(width() - title.length - 4), colors, "inverse")
    );
    console.info("");
  }

  idle(timeoutMs = 150): void {
    if (this.#idleTimer !== undefined) clearTimeout(this.#idleTimer);

    this.#idleTimer = setTimeout(() => {
      this.banner(format(new Date(), "HH:mm:ss"), "gray");
      console.info("");
    }, timeoutMs);
  }

  /**
   * 情報ログ出力
   *
   * @param args - 出力値
   */
  info(...args: unknown[]): void {
    if (this.#indent === "") {
      console.info(...args);
    } else {
      console.info(this.#indent.slice(1), ...args);
    }
  }

  /**
   * 警告ログ出力
   *
   * @param args - 出力値
   */
  warn(...args: unknown[]): void {
    if (this.#indent === "") {
      console.warn(...args);
    } else {
      console.warn(this.#indent.slice(1), ...args);
    }
  }

  /**
   * エラーログ出力
   *
   * @param args - 出力値
   */
  error(...args: unknown[]): void {
    if (this.#indent === "") {
      console.error(...args);
    } else {
      console.error(this.#indent.slice(1), ...args);
    }
  }

  /**
   * ファイル情報取得
   *
   * @param filePath - ファイルパス
   */
  private getFileInfo(filePath: string): FileInfo {
    for (const { name, dirPath } of this.dirs) {
      const relPath = path.relative(dirPath, filePath);

      if (!relPath.includes("..")) return { name, relPath };
    }

    return { name: "", relPath: filePath };
  }

  /**
   * エラーメッセージの取得
   *
   * @param error - エラーオブジェクトなど
   * @param color - 色指定
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getErrorMessage(error: any, color: LoggerColor[]): string {
    if (typeof error === "object" && error !== null) {
      if ("code" in error) {
        return applyColor(` (${error.code})`, color);
      }

      if ("message" in error) {
        return applyColor(` (${error.message})`, color);
      }
    }

    return "";
  }

  /**
   * ファイルについてのログ出力
   *
   * @param label - ラベル
   * @param color - 色指定
   * @param filePath - ファイルパス
   * @param error - エラーオブジェクトなど
   */
  private file(
    label: string,
    color: LoggerColor[],
    filePath: string,
    error: unknown = undefined
  ): void {
    const { name, relPath } = this.getFileInfo(filePath);
    const formattedLabel =
      label.length === 0 ? "" : `[${applyColor(label, color)}] `;
    const message = this.getErrorMessage(error, color);

    this.info(
      `${formattedLabel}${applyColor(`${name}: `, "dim")}${relPath}${message}`
    );
  }

  /**
   * ファイルについての成功ログ出力
   *
   * @param label - ラベル
   * @param filePath - ファイルパス
   * @param error - エラーオブジェクトなど
   */
  fileSuccess(label: string, filePath: string, error?: unknown): void {
    this.file(label, ["green"], filePath, error);
  }

  /**
   * ファイルについての情報ログ出力
   *
   * @param label - ラベル
   * @param filePath - ファイルパス
   * @param error - エラーオブジェクトなど
   */
  fileNotice(label: string, filePath: string, error?: unknown): void {
    this.file(label, ["cyan"], filePath, error);
  }

  /**
   * ファイルについての警告ログ出力
   *
   * @param label - ラベル
   * @param filePath - ファイルパス
   * @param error - エラーオブジェクトなど
   */
  fileWarning(label: string, filePath: string, error?: unknown): void {
    this.file(label, ["yellow"], filePath, error);
  }

  /**
   * ファイルについての失敗ログ出力
   *
   * @param label - ラベル
   * @param filePath - ファイルパス
   * @param error - エラーオブジェクトなど
   */
  fileFailure(label: string, filePath: string, error?: unknown): void {
    this.file(label, ["red"], filePath, error);
  }

  /**
   * エントリについてログ出力
   *
   * @param entry - エントリ
   * @param colors - 色指定
   */
  entry(entry: Entry, ...colors: LoggerColor[]): void {
    this.info(
      applyColor("*", "dim"),
      applyColor(
        `${entry.entryPath} [${entry.entryType}]`,
        colors.length === 0 ? "green" : colors
      )
    );
  }

  /**
   * フィルタ種別についてログ出力
   *
   * @param filterType - フィルタ種別
   * @param distPath - 出力ファイルパス
   */
  filterType(
    filterType: FilterType,
    distPath?: string,
    sourceMap?: boolean
  ): void {
    if (distPath === undefined) {
      this.info(applyColor(filterType, "yellow"));
    } else {
      this.info(
        applyColor(filterType, "yellow"),
        "-->",
        applyColor(distPath, "magenta")
      );

      if (sourceMap) {
        this.info(
          applyColor(filterType, "hidden"),
          applyColor("-->", "dim"),
          applyColor(`${distPath}.map`, "magenta")
        );
      }
    }
  }
}
