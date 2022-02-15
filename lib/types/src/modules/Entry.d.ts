import { WorkFlow } from "../types/WorkFlow";
import { Config } from "./Config";
import { EntryType } from "./EntryType";
/** クラス: エントリ */
export declare class Entry {
    #private;
    /** エントリ種別 */
    readonly entryType: EntryType;
    /** ソースファイルパス */
    readonly srcFilePath: string;
    /** ソースの相対パス */
    readonly entryPath: string;
    /**
     * コンストラクタ
     *
     * @param config - 設定
     * @param filePath - ソースファイルパス
     */
    constructor(config: Config, filePath: string);
    /**
     * フィルタが有効かどうか
     *
     * @param filterType - フィルタ種別
     */
    private isFilterEnabled;
    /** ワークフロー作成 */
    getWorkFlows(): WorkFlow[];
    /** メインの出力ファイルパス取得 */
    getPrimaryDistPath(): string | undefined;
    /**
     * すべての出力ファイルパス取得
     *
     * @param includeSourceMap - ソースマップを含む
     */
    getDistPaths(includeSourceMap?: boolean): string[];
}
