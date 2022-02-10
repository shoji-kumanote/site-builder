import { Context } from "../modules/Context";
import { Transit } from "../modules/Transit";
import { WorkFlow } from "../types/WorkFlow";
/**
 * ワークフローを実行
 *
 * @param workFlow - ワークフロー
 * @param transit - 作業用データ
 * @param context - 実行時コンテキスト
 */
export declare const applyWorkFlow: (workFlow: WorkFlow, transit: Transit, context: Context) => Promise<void>;
