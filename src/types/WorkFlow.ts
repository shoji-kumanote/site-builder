import { FilterType } from "../modules/FilterType";

/** タイプ: ワークフロー */
export type WorkFlow = {
  /** 使用するフィルタ */
  filterType: FilterType;
  /** 出力相対パス */
  distPath?: string;
  /** バイナリ */
  binary?: boolean;
  /** ソースマップ出力の有無 */
  sourceMap?: boolean;
  /** 次のワークフロー */
  next?: WorkFlow[];
};
