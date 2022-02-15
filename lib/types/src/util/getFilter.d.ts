import { FilterType } from "../modules/FilterType";
import { Filter } from "../types/Filter";
/**
 * フィルタ種別に対応するフィルタ関数取得
 *
 * @param filterType - フィルタ種別
 * @returns フィルタ
 */
export declare const getFilter: (filterType: FilterType) => Promise<Filter>;
