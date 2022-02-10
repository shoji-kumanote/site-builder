import { Logger } from "./Logger";
/** クラス: ファイル操作 */
export declare class File {
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
    constructor(logger: Logger, dryRun: boolean);
    /**
     * ファイル削除
     *
     * @param filePath - ファイルパス
     */
    unlink(filePath: string): Promise<void>;
    /**
     * 再帰的に空のディレクトリを削除
     *
     * @param dirPath - ディレクトリパス
     * @param first - 初回コールフラグ
     */
    private removeDirs;
    /**
     * 空のディレクトリを削除
     *
     * @param dirPath - ディレクトリパス
     */
    removeEmptyDirs(dirPath: string): Promise<void>;
    /**
     * ファイル書き出しの準備としてファイルに至るディレクトリを作成
     *
     * @param filePath - ファイルパス
     * @param withUnlink - 削除フラグ / 指定時はファイルが存在した場合に削除する
     */
    prepareWrite(filePath: string, withUnlink?: boolean): Promise<void>;
    /**
     * テキストファイル書き出し（末尾に改行が入る）
     *
     * @param filePath - ファイルパス
     * @param data - 内容
     */
    writeText(filePath: string, data: string): Promise<void>;
    /**
     * ファイル書き出し
     *
     * @param filePath - ファイルパス
     * @param data - 内容
     */
    write(filePath: string, data: string): Promise<void>;
    /**
     * ファイルコピー
     *
     * @param srcFilePath - コピー元
     * @param distFilePath - コピー先
     */
    copy(srcFilePath: string, distFilePath?: string): Promise<void>;
}
