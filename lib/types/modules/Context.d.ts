import { Config } from "./Config";
import { Dependency } from "./Dependency";
import { Entry } from "./Entry";
import { File } from "./File";
import { Logger } from "./Logger";
/** 実行時コンテキスト */
export declare class Context {
    #private;
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
    constructor(config: Config);
    get config(): Config;
    /** 設定ファイルの再読み込み */
    reloadConfig(): Promise<void>;
    /** 全ソースファイルのエントリ取得 */
    getEntries(): Promise<Entry[]>;
    /** 指定ファイルのエントリ取得 */
    getEntry(filePath: string): Entry | undefined;
}
