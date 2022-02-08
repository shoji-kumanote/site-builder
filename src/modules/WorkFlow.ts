import { FilterType } from "./FilterType";

/** タイプ: ワークフロー */
export type WorkFlow = {
  /** 出力相対パス */
  distPath: string;
  /** バイナリ */
  binary: boolean;
  /** ソースマップ出力の有無 */
  sourceMap: boolean;
  /** 使用するフィルタ */
  filterType: FilterType;
  /** 次のワークフロー */
  next: WorkFlow[];
};
