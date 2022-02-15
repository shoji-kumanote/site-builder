import { Context } from "../modules/Context";
/**
 * ファイルのビルド結果を削除
 *
 * @param context - コンテキスト
 * @param entry - エントリ
 */
export declare const unBuildFile: (context: Context, filePath: string) => Promise<void>;
