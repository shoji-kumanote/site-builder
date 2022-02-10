import { Color, Modifiers } from "chalk";
import { Config } from "./Config";
import { Entry } from "./Entry";
import { FilterType } from "./FilterType";
/** タイプ: ログの色指定 */
export declare type LoggerColor = Color | Modifiers | LoggerColor[];
/** タイプ: ディレクトリ定義 */
declare type Dir = {
    name: string;
    dirPath: string;
};
/** クラス: ロガー */
export declare class Logger {
    #private;
    /** ディレクトリ定義 */
    readonly dirs: Dir[];
    /**
     * コンストラクタ
     *
     * @param config - 設定
     */
    constructor(config: Config);
    /** 字下げ開始 */
    begin(): void;
    /** 字下げ終了 */
    end(): void;
    /**
     * バナー出力
     *
     * @param title - タイトル
     * @param colors - 色指定
     */
    banner(title: string, ...colors: LoggerColor[]): void;
    idle(timeoutMs?: number): void;
    /**
     * 情報ログ出力
     *
     * @param args - 出力値
     */
    info(...args: unknown[]): void;
    /**
     * 警告ログ出力
     *
     * @param args - 出力値
     */
    warn(...args: unknown[]): void;
    /**
     * エラーログ出力
     *
     * @param args - 出力値
     */
    error(...args: unknown[]): void;
    /**
     * ファイル情報取得
     *
     * @param filePath - ファイルパス
     */
    private getFileInfo;
    /**
     * エラーメッセージの取得
     *
     * @param error - エラーオブジェクトなど
     * @param color - 色指定
     */
    private getErrorMessage;
    /**
     * ファイルについてのログ出力
     *
     * @param label - ラベル
     * @param color - 色指定
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    private file;
    /**
     * ファイルについての成功ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileSuccess(label: string, filePath: string, error?: unknown): void;
    /**
     * ファイルについての情報ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileNotice(label: string, filePath: string, error?: unknown): void;
    /**
     * ファイルについての警告ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileWarning(label: string, filePath: string, error?: unknown): void;
    /**
     * ファイルについての失敗ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileFailure(label: string, filePath: string, error?: unknown): void;
    /**
     * エントリについてログ出力
     *
     * @param entry - エントリ
     * @param colors - 色指定
     */
    entry(entry: Entry, ...colors: LoggerColor[]): void;
    /**
     * フィルタ種別についてログ出力
     *
     * @param filterType - フィルタ種別
     * @param distPath - 出力ファイルパス
     */
    filterType(filterType: FilterType, distPath?: string, sourceMap?: boolean): void;
}
export {};
