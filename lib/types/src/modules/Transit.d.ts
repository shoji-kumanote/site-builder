/** クラス: 作業データ */
export declare class Transit {
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
    private constructor();
    /**
     * 作業データを作成
     *
     * @param srcFilePath - ソースファイルパス
     */
    static create(entryPath: string, srcFilePath: string, distFilePath: string | undefined): Promise<Transit>;
    /**
     * 内容とソースマップを入れ替えた新しい作業データを作成
     *
     * @param data - 内容
     * @param sourceMap - ソースマップ
     */
    update(data: string, sourceMap?: string): Transit;
}
