import { Logger } from "./Logger";
/** クラス: 依存関係 */
export declare class Dependency {
    #private;
    /** トランザクション開始 */
    beginTransaction(): void;
    /** ロールバック */
    rollback(): void;
    /** コミット */
    commit(): void;
    /** すべての依存を削除 */
    clearAll(): void;
    /**
     * 任意のファイルの依存を削除
     *
     * @param filePath - ファイルパス
     */
    clear(filePath: string): void;
    /**
     * 任意のファイルの依存を追加
     *
     * @param filePath - ファイルパス
     * @param dependFilePaths - 依存ファイルパスの配列
     */
    add(filePath: string, ...dependFilePaths: string[]): void;
    /**
     * あるファイルを依存に持つファイルパスを得る
     *
     * @param dependFilePath - 依存ファイル
     * @returns ファイルパスの配列
     */
    getByDepend(dependFilePath: string): string[];
    /** 依存関係のデバッグ出力 */
    dump(logger: Logger): void;
}
