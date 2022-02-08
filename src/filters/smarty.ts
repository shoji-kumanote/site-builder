import { Filter } from "../modules/Filter";

/** smarty フィルタ */
export const smarty: Filter = async (transit) =>
  transit.update(`{literal}${transit.data}{/literal}`);
