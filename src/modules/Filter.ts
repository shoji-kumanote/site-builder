import { Context } from "./Context";
import { Transit } from "./Transit";

/**
 * タイプ: フィルタ
 *
 * @param transit - 作業用データ
 * @param context - 実行時コンテキスト
 */
export type Filter = (transit: Transit, context: Context) => Promise<Transit>;
