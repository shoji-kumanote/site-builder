import { WorkFlow } from "../types/WorkFlow";
/**
 * CSS向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param cssOptimize - cssOptimize フィルタの有無
 * @param cssMinify - cssMinify フィルタの有無
 * @param cssFormat - cssFormat フィルタの有無
 * @param smarty - smarty フィルタの有無
 */
export declare const getCssWorkFlows: (entryPath: string, cssOptimize: boolean, cssMinify: boolean, cssFormat: boolean, smarty: boolean) => WorkFlow[];
