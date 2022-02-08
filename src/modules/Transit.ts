import fs from "fs";
import path from "path";

/** クラス: 作業データ */
export class Transit {
  /** 内容 */
  readonly data: string;
  /** ソースマップ */
  readonly sourceMap: string | undefined;
  /** ソースファイルの相対パス */
  readonly entryPath: string;
  /** ソースファイルのファイルパス */
  readonly srcFilePath: string;
  /** ソースファイルのファイル名 */
  readonly srcFileName: string;
  /** 出力ファイルのファイルパス */
  readonly distFilePath: string | undefined;
  /** 出力ファイルのファイル名 */
  readonly distFileName: string | undefined;

  /** コンストラクタ */
  private constructor(
    data: string,
    sourceMap: string | undefined,
    entryPath: string,
    srcFilePath: string,
    srcFileName: string,
    distFilePath: string | undefined,
    distFileName: string | undefined
  ) {
    this.data = data;
    this.sourceMap = sourceMap;
    this.entryPath = entryPath;
    this.srcFilePath = srcFilePath;
    this.srcFileName = srcFileName;
    this.distFilePath = distFilePath;
    this.distFileName = distFileName;
  }

  /**
   * 作業データを作成
   *
   * @param srcFilePath - ソースファイルパス
   */
  static async create(
    entryPath: string,
    srcFilePath: string,
    distFilePath: string | undefined
  ): Promise<Transit> {
    const transit = new Transit(
      await fs.promises.readFile(srcFilePath, "utf-8"),
      undefined,
      entryPath,
      srcFilePath,
      path.basename(srcFilePath),
      distFilePath,
      distFilePath === undefined ? undefined : path.basename(distFilePath)
    );

    return transit;
  }

  /**
   * 内容とソースマップを入れ替えた新しい作業データを作成
   *
   * @param data - 内容
   * @param sourceMap - ソースマップ
   */
  update(data: string, sourceMap?: string): Transit {
    return new Transit(
      data,
      sourceMap,
      this.entryPath,
      this.srcFilePath,
      this.srcFileName,
      this.distFilePath,
      this.distFileName
    );
  }
}
