import { Logger } from "./Logger";

type DepsMap = Map<string, Set<string>>;

/**
 * 依存データをコピー
 *
 * @param src - コピー元
 * @param dest - コピー先
 */
const copy = (src: DepsMap, dest: DepsMap): void => {
  dest.clear();
  for (const [key, value] of src.entries()) {
    dest.set(key, new Set(value));
  }
};

/** クラス: 依存関係 */
export class Dependency {
  #map: DepsMap = new Map();
  #backup: DepsMap = new Map();

  /** トランザクション開始 */
  beginTransaction(): void {
    copy(this.#map, this.#backup);
  }

  /** ロールバック */
  rollback(): void {
    copy(this.#backup, this.#map);
  }

  /** コミット */
  // eslint-disable-next-line class-methods-use-this
  commit(): void {
    //
  }

  /** すべての依存を削除 */
  clearAll(): void {
    this.#map.clear();
  }

  /**
   * 任意のファイルの依存を削除
   *
   * @param filePath - ファイルパス
   */
  clear(filePath: string): void {
    const entry = this.#map.get(filePath);

    if (entry) entry.clear();
  }

  /**
   * 任意のファイルの依存を追加
   *
   * @param filePath - ファイルパス
   * @param dependFilePaths - 依存ファイルパスの配列
   */
  add(filePath: string, ...dependFilePaths: string[]): void {
    const entry = this.#map.get(filePath) ?? new Set<string>();

    for (const dependFilePath of dependFilePaths) {
      if (filePath !== dependFilePath) {
        entry.add(dependFilePath);
      }
    }

    this.#map.set(filePath, entry);
  }

  /**
   * あるファイルを依存に持つファイルパスを得る
   *
   * @param dependFilePath - 依存ファイル
   * @returns ファイルパスの配列
   */
  getByDepend(dependFilePath: string): string[] {
    const result: Set<string> = new Set();

    for (const [filePath, dependFilePathSet] of this.#map.entries()) {
      if (dependFilePathSet.has(dependFilePath)) {
        result.add(filePath);
      }
    }

    return [...result];
  }

  /** 依存関係のデバッグ出力 */
  dump(logger: Logger): void {
    logger.banner("dependency");
    for (const [a, b] of this.#map.entries()) {
      logger.fileSuccess("", a);
      logger.begin();
      for (const x of b) {
        logger.fileSuccess("", x);
      }
      logger.end();
      logger.info();
    }
  }
}
