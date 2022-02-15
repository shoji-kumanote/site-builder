import { WorkFlow } from "../types/WorkFlow";
/**
 * JavaScript向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param jsOptimize - jsOptimize フィルタの有無
 * @param jsMinify - jsMinify フィルタの有無
 * @param jsFormat - jsFormat フィルタの有無
 */
export declare const getJsWorkFlows: (entryPath: string, jsOptimize: boolean, jsMinify: boolean, jsFormat: boolean) => WorkFlow[];
