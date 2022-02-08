import { Context } from "./Context";

/**
 * タイプ: コマンド
 *
 * @param context - 実行時コンテキスト
 */
export type Command = (context: Context) => Promise<void>;
