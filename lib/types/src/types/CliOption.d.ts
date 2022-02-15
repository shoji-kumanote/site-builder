/** タイプ: コマンドラインオプション */
export declare type CliOption = {
    /** 設定ファイル */
    readonly config: string[];
    /** dry-run モード */
    readonly dryRun: boolean;
    /** dev モード */
    readonly dev: boolean;
};
